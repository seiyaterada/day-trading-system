import express from "express";
import cors from "cors";
import {connectToDatabase} from "../db/connection";
import { ErrorType, AccountTransactionType, User, Stock } from "./interfaces";
import { userExists } from "./userExists";
import { getQuote } from "./quote";
import redisClient from "../db/redisClient";
import {job} from "./triggerJob";
require('newrelic');
// import { Blob } from 'blob';
// import routes from "./routes.mjs";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

(async () => {
  await redisClient.connect();
})();

//Start the trigger job
job.start();


app.get('/redis', async (req, res) => {
  const result = await getQuote("S", "test1");
  res.send(result);
});

app.post('/redis', async (req, res) => {
  const sym = "S";
  const result = await redisClient.set(sym, 100, {EX: 60});

  res.send(result);
});


app.post('/add', async (req, res) => {
  console.log("ADD REQUEST RECIEvED");
  const db = await connectToDatabase();
  if(!db) { 
    res.send("Error: Database connection failed").status(500);
    return;
  }
  let userCommandLogs = await db.collection("USER_COMMAND_LOGS");
  let accountTransactionLogs = await db.collection("ACCOUNT_TRANSACTION_LOGS");
  let errorLogs = await db.collection("ERROR _LOGS");
  let users = await db.collection("USERS");

  const transactionId: number = req.body.transactionId;
  const username: string = req.body.username;
  const amount: number = req.body.amount;
  const user: User = {
    username: username,
    balance: amount
  }
  await userCommandLogs.insertOne({
    type: "UserCommandType",
    transactionId: 1,  
    timestamp: new Date(), 
    server: "transaction-server", 
    command: "ADD", 
    username: username, 
    funds: user.balance
  });

  // if user already exists update account balance
  try {
    const result = await users.updateOne(
      { username: user.username },
      { $inc: { balance: user.balance } },
      { upsert: true }
    );
  
    await accountTransactionLogs.insertOne({
      type: "AccountTransactionType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      command: "ADD",
      username: username,
      funds: user.balance
    });
  
    res.send(`Successfully added ${amount} to ${username}`).status(200);
  
  } catch(e:any) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: e.message,
      command: "ADD",
      username: username,
      funds: user.balance
    });
  
    const errorMsg = `Error: Failed to update account ${username}`;
    
    res.send(errorMsg).status(500);
  }
});

// Get quote of a stock
app.post('/quote', async(req, res) => {
  const db = await connectToDatabase();
  if(!db) { 
    res.send("Error: Database connection failed").status(500);
    return;
  }
  let userCommandLogs = await db.collection("USER_COMMAND_LOGS");
  let accountTransactionLogs = await db.collection("ACCOUNT_TRANSACTION_LOGS");
  let errorLogs = await db.collection("ERROR_LOGS");
  let users = await db.collection("USERS");

  const transactionId: number = req.body.transactionId;
  const username: string = req.body.username;
  const stockSymbol: string = req.body.stockSymbol;
  const funds: number = req.body.funds;

  try {
    await userCommandLogs.insertOne({
      type: "UserCommandType",
      transactionId: transactionId, 
      timestamp: new Date(),  
      server: "transaction-server", 
      command: "QUOTE", 
      username: username, 
      stockSymbol: stockSymbol, 
      funds: funds
    });
  
    const userExist = await userExists(username);
  
    if (userExist) {
      const quote = await getQuote(stockSymbol, username);
      if (quote) {
        res.send(quote).status(200);
      } else {
        await errorLogs.insertOne({
          type: "ErrorEventType",
          transactionId: 1, 
          timestamp: new Date(), 
          server: "transaction-server", 
          errorMessage: "Failed to get quote", 
          command: "QUOTE", 
          username: username, 
          stockSymbol: stockSymbol
        });
        res.send(`Error: Failed to get quote for ${stockSymbol}`).status(500);
      }
    } else {
      await errorLogs.insertOne({
        type: "ErrorEventType",
        transactionId: 1, 
        timestamp: new Date(), 
        server: "transaction-server", 
        errorMessage: "User does not exist", 
        command: "QUOTE", 
        username: username, 
        stockSymbol: stockSymbol
      });
      res.send(`Error: User ${username} does not exist`).status(500);
    }
  } catch (e:any) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1, 
      timestamp: new Date(), 
      server: "transaction-server", 
      errorMessage: e.message, 
      command: "QUOTE", 
      username: username, 
      stockSymbol: stockSymbol
    });
    res.send(`Error: ${e.message}`).status(500);
  }
});

app.post('/buy', async (req, res) => {
  const db = await connectToDatabase();
  if(!db) { 
    res.send("Error: Database connection failed").status(500);
    return;
  }
  let userCommandLogs = await db.collection("USER_COMMAND_LOGS");
  let accountTransactionLogs = await db.collection("ACCOUNT_TRANSACTION_LOGS");
  let errorLogs = await db.collection("ERROR_LOGS");
  let users = await db.collection("USERS");

  const transactionId: number = req.body.transactionId;
  const username: string = req.body.username;
  const stockSymbol: string = req.body.stockSymbol;
  const amount: number = req.body.amount;

  // Test Data
  // const transactionId: number = 10;
  // const username: string = "test1";
  // const stockSymbol: string = "SYM";
  // const amount: number = 100;

  await userCommandLogs.insertOne({
    type: "UserCommandType",
    transactionId: transactionId, 
    timestamp: new Date(), 
    server: "transaction-server", 
    command: "BUY", 
    username: username, 
    stockSymbol: stockSymbol
  });

  const userExist = await userExists(username);

  if(!userExist) {
    await errorLogs.insertOne({type: "ErrorEventType", transactionId: 1, timestamp: new Date(), server: "transaction-server", errorMessage: "User does not exist", command: "BUY", username: username, stockSymbol: stockSymbol});
    res.send(`Error: User ${username} does not exist`).status(500);
  } else {
    // Get quote from quote server
    // const quote = await getQuote(stockSymbol, username);
    const quote = 10;
    const numStocks = Math.floor(amount / quote);
    const transPrice = numStocks * quote;
    const user = await users.findOne({username: username});

    if(numStocks == 0 || user && user.balance < transPrice) {
      await errorLogs.insertOne({
        type: "ErrorEventType",
        transactionId: 1, 
        timestamp: new Date(), 
        server: "transaction-server", 
        errorMessage: "Not enough funds", 
        command: "BUY", 
        username: username, 
        stockSymbol: stockSymbol
      });
      res.send(`Error: Not enough funds to buy ${stockSymbol}`).status(500);
    } else {
      // Add uncommitted buy to user
      try {
        // First get rid of any uncommitted buys
        await users.updateOne({username: username}, {$unset: {uncommittedBuys: ""}});

        await users.updateOne(
          {username: username}, 
          {$set: 
            {uncommittedBuys: 
              {stockSymbol: stockSymbol, 
                numStocks: numStocks, 
                price: transPrice, 
                expiryTime: new Date().setSeconds(new Date().getSeconds() + 61)
              }
            }
          });
        await accountTransactionLogs.insertOne({
          type: "AccountTransactionType",
          transactionId: 1, 
          timestamp: new Date(), 
          server: "transaction-server", 
          command: "BUY", 
          username: username, 
          stockSymbol: stockSymbol, 
          funds: transPrice
        });
        res.send(`Successfully bought ${numStocks} of ${stockSymbol} for ${transPrice}`).status(200);
      } catch(e:any) {
        await errorLogs.insertOne({
          type: "ErrorEventType",
          transactionId: 1, 
          timestamp: new Date(), 
          server: "transaction-server", 
          errorMessage: e.message, 
          command: "BUY", 
          username: username, 
          stockSymbol: stockSymbol
        });
        res.send(`Error: Failed to update account ${username}`).status(500);
      }
    }
  }
});

app.post('/commitBuy', async (req, res) => {
  const db = await connectToDatabase();
  if(!db) { 
    res.send("Error: Database connection failed").status(500);
    return;
  }
  let userCommandLogs = await db.collection("USER_COMMAND_LOGS");
  let accountTransactionLogs = await db.collection("ACCOUNT_TRANSACTION_LOGS");
  let errorLogs = await db.collection("ERROR_LOGS");
  let users = await db.collection("USERS");

  const transactionId: number = req.body.transactionId;
  const username: string = req.body.username;
  //const stockSymbol: string = req.body.stockSymbol;

  // Test Data
  // const transactionId: number = 11;
  // const username: string = "test1";
  const stockSymbol: string = "S";

  await userCommandLogs.insertOne({
    type: "UserCommandType",
    transactionId: transactionId, 
    timestamp: new Date(), 
    server: "transaction-server", 
    command: "COMMIT_BUY", 
    username: username, 
    stockSymbol: stockSymbol
  });

  const userExist = await userExists(username);

  if(!userExist) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1, 
      timestamp: new Date(), 
      server: "transaction-server", 
      errorMessage: "User does not exist", 
      command: "COMMIT_BUY", 
      username: username, 
      stockSymbol: stockSymbol
    });
    res.send(`Error: User ${username} does not exist`).status(500);
  }

  const user = await users.findOne({username: username, uncommittedBuys: {$exists: true}});

  // make sure user has uncommitted buy
  // if(!user) {
  //   await errorLogs.insertOne({transactionId: 1, timestamp: new Date(), server: "transaction-server", errorMessage: "No uncommitted buys", command: "COMMIT_BUY", username: username, stockSymbol: stockSymbol});
  //   res.send(`Error: No uncommitted buys`).status(500);
  // }

  // make sure uncommitted buy is not expired
  if(user && user.uncommittedBuys.expiryTime < new Date()) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server", 
      errorMessage: "Uncommitted buy expired", 
      command: "COMMIT_BUY", 
      username: username, 
      stockSymbol: stockSymbol
    });

    await users.updateOne({username: username}, {$unset: {uncommittedBuys: ""}});
    return res.send(`Error: Uncommitted buy expired`).status(500);
  }

  // check if user owns any shares of the stock
  if (user) {
    try {
      const filter = { username: username };
      let stockIndex = -1;
      if(user.stocks) {
        stockIndex = user.stocks.findIndex((stock:Stock) => stock.stockSymbol === stockSymbol); 
      }
      let update = {}

      if (stockIndex >= 0) {
        update = {
          $inc: { balance: -user.uncommittedBuys.price, [`stocks.${stockIndex}.numStocks`]: user.uncommittedBuys.numStocks },
          $unset: { uncommittedBuys: "" }

        }
      } else {
        update = {
          $inc: { balance: -user.uncommittedBuys.price },
          $unset: { uncommittedBuys: "" },
          $push: { stocks: { stockSymbol, numStocks: user.uncommittedBuys.numStocks } }
        }
      }
  
      await users.updateOne(filter, update);
  
      await accountTransactionLogs.insertOne({
        type: "AccountTransactionType",
        transactionId: 1,
        timestamp: new Date(),
        server: "transaction-server",
        command: "COMMIT_BUY",
        username: username,
        stockSymbol: stockSymbol,
        funds: user.uncommittedBuys.price
      });
  
      res.send(`Successfully committed buy`).status(200);
    } catch (e:any) {
      await errorLogs.insertOne({
        type: "ErrorEventType",
        transactionId: 1,
        timestamp: new Date(),
        server: "transaction-server",
        errorMessage: e.message,
        command: "COMMIT_BUY",
        username: username,
        stockSymbol: stockSymbol
      });
  
      res.send(`Error: Failed to update account ${username}`).status(500);
    }
  }
  else {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1, 
      timestamp: new Date(), 
      server: "transaction-server", 
      errorMessage: "No uncommitted buys", 
      command: "COMMIT_BUY", 
      username: username, 
      stockSymbol: stockSymbol
    });

    res.send(`Error: No uncommitted buys`).status(500);
  }
});

app.post('/cancelBuy', async (req, res) => {
  const db = await connectToDatabase();
  if(!db) { 
    res.send("Error: Database connection failed").status(500);
    return;
  }
  let userCommandLogs = await db.collection("USER_COMMAND_LOGS");
  let accountTransactionLogs = await db.collection("ACCOUNT_TRANSACTION_LOGS");
  let errorLogs = await db.collection("ERROR_LOGS");
  let users = await db.collection("USERS");

  const transactionId: number = req.body.transactionId;
  const username: string = req.body.username;
  const stockSymbol: string = req.body.stockSymbol;

  // Test Data
  // const transactionId: number = 12;
  // const username: string = "test1";
  // const stockSymbol: string = "SYM";

  await userCommandLogs.insertOne({
    type: "UserCommandType",
    transactionId: transactionId, 
    timestamp: new Date(), 
    server: "transaction-server", 
    command: "CANCEL_BUY", 
    username: username, 
    stockSymbol: stockSymbol
  });

  const userExist = await userExists(username);

  if(!userExist) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1, 
      timestamp: new Date(), 
      server: "transaction-server", 
      errorMessage: "User does not exist", 
      command: "CANCEL_BUY", 
      username: username, 
      stockSymbol: stockSymbol
    });

    res.send(`Error: User ${username} does not exist`).status(500);
  }

  const user = await users.findOne({username: username, uncommittedBuys: {$exists: true}});
  
  if(user) {
    try {
      await users.updateOne({username: username}, {$unset: {uncommittedBuys: ""}});
    } catch(e:any) {
      await errorLogs.insertOne({
        type: "ErrorEventType",
        transactionId: 1, 
        timestamp: new Date(), 
        server: "transaction-server", 
        errorMessage: e.message, 
        command: "CANCEL_BUY", 
        username: username, 
        stockSymbol: stockSymbol
      });

      return res.send(`Error: Failed to update account ${username}`).status(500);
    }
  } else {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1, 
      timestamp: new Date(), 
      server: "transaction-server", 
      errorMessage: "No uncommitted buys", 
      command: "CANCEL_BUY", 
      username: username, 
      stockSymbol: stockSymbol
    });

    return res.send(`Error: No uncommitted buys`).status(500);
  }

  await accountTransactionLogs.insertOne({
    type: "AccountTransactionType",
    transactionId: 1, 
    timestamp: new Date(), 
    server: "transaction-server", 
    command: "CANCEL_BUY", 
    username: username, 
    stockSymbol: stockSymbol, 
    funds: user.uncommittedBuys.price
  });

  res.send(`Successfully cancelled buy`).status(200);
});

app.post('/sell', async (req, res) => {
  const db = await connectToDatabase();
  if(!db) {
    res.send("Error: Database connection failed").status(500);
    return;
  }
  let userCommandLogs = await db.collection("USER_COMMAND_LOGS");
  let accountTransactionLogs = await db.collection("ACCOUNT_TRANSACTION_LOGS");
  let errorLogs = await db.collection("ERROR_LOGS");
  let users = await db.collection("USERS");
  
  const transactionId: number = req.body.transactionId;
  const username: string = req.body.username;
  const stockSymbol: string = req.body.stockSymbol;
  const amount: number = req.body.amount;

  // Test Data
  // const transactionId: number = 14;
  // const username: string = "test1";
  // const stockSymbol: string = "SYM";
  // const amount: number = 100;

  await userCommandLogs.insertOne({
    type: "UserCommandType",
    transactionId: transactionId,
    timestamp: new Date(),
    server: "transaction-server",
    command: "SELL",
    username: username,
    stockSymbol: stockSymbol,
    numStocks: amount
  });

  // const quote = await getQuote(stockSymbol, username);
  const quote = 10;
  const userExist = await userExists(username);

  if(!userExist) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: "User does not exist",
      command: "SELL",
      username: username,
      stockSymbol: stockSymbol
    });

    res.send(`Error: User ${username} does not exist`).status(500);
  }

  // Check if user owns any of the stock
  const user = await users.findOne({username: username, stocks:{$elemMatch:{stockSymbol: stockSymbol, numStocks:{ $gt: 0}}}});
  if(!user) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: "User does not own any of the stock",
      command: "SELL",
      username: username,
      stockSymbol: stockSymbol
    });

    return res.send(`Error: User ${username} does not own any of the stock`).status(500);
  }

  // Check if user has enough stocks to sell
  const numStocksSell = Math.floor(amount / quote)
  const userStocks = user && user.stocks.find((stock: Stock) => stock.stockSymbol === stockSymbol);
  if(user && userStocks < numStocksSell) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: "User does not have enough stocks to sell",
      command: "SELL",
      username: username,
      stockSymbol: stockSymbol
    });

    return res.send(`Error: User ${username} does not have enough stocks to sell`).status(500);
  }

  // Add uncommitted sell to user
  try {
    // first get rid of any uncommitted sells
    await users.updateOne({username: username}, {$unset: {uncommittedSells: ""}});

    await users.updateOne(
      {username: username}, 
      {$set: 
        {uncommittedSells: 
          {stockSymbol: stockSymbol, 
            numStocks: numStocksSell,
            price: numStocksSell * quote,
            timestamp: new Date().setSeconds(new Date().getSeconds() + 60)
          }
        }
      });
      await accountTransactionLogs.insertOne({
        type: "AccountTransactionType",
        transactionId: 1,
        timestamp: new Date(),
        server: "transaction-server",
        command: "SELL",
        username: username,
        stockSymbol: stockSymbol,
        numStocks: numStocksSell,
        funds: numStocksSell * quote
      });

      res.send(`Successfully sold ${numStocksSell} stocks`).status(200);
  } catch(e:any) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: e.message,
      command: "SELL",
      username: username,
      stockSymbol: stockSymbol
    });

    res.send(`Error: Failed to update account ${username}`).status(500);
  }


});

app.post('/commitSell', async (req, res) => {
  const db = await connectToDatabase();
  if(!db) {
    res.send("Error: Database connection failed").status(500);
    return;
  }
  let userCommandLogs = await db.collection("USER_COMMAND_LOGS");
  let accountTransactionLogs = await db.collection("ACCOUNT_TRANSACTION_LOGS");
  let errorLogs = await db.collection("ERROR_LOGS");
  let users = await db.collection("USERS");

  const transactionId: number = req.body.transactionId;
  const username: string = req.body.username;
  // const stockSymbol: string = req.body.stockSymbol;

  // Test Data
  // const transactionId: number = 15;
  // const username: string = "test1";
  const stockSymbol: string = "S";

  await userCommandLogs.insertOne({
    type: "UserCommandType",
    transactionId: transactionId,
    timestamp: new Date(),
    server: "transaction-server",
    command: "COMMIT_SELL",
    username: username,
    stockSymbol: stockSymbol
  });

  const userExist = await userExists(username);

  if(!userExist) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: "User does not exist",
      command: "COMMIT_SELL",
      username: username,
      stockSymbol: stockSymbol
    });

    return res.send(`Error: User ${username} does not exist`).status(500);
  }

  const user = await users.findOne({username: username, uncommittedSells: {$exists: true}});

  // make sure uncommitted sell not expired
  if(user && user.uncommittedSells.expiryTime < new Date()) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: "Uncommitted sell expired",
      command: "COMMIT_SELL",
      username: username,
      stockSymbol: stockSymbol
    });

    return res.send(`Error: Uncommitted sell expired`).status(500);
  }

  if(user) {
    const stockIndex = user.stocks.findIndex((stock:Stock) => stock.stockSymbol === stockSymbol);

    // update user account
    try {
      const update = {
        $inc: {
          balance: user.uncommittedSells.price,
          [`stocks.${stockIndex}.numStocks`]: -user.uncommittedSells.numStocks,
        },
        $unset: {
          uncommittedSells: ""
        }
      };
  
      await users.updateOne({username: username}, update);
  
      await accountTransactionLogs.insertOne({
        type: "AccountTransactionType",
        transactionId: 1,
        timestamp: new Date(),
        server: "transaction-server",
        command: "COMMIT_SELL",
        username: username,
        stockSymbol: stockSymbol,
        numStocks: user.uncommittedSells.numStocks,
        funds: user.uncommittedSells.price
      });
  
      res.send(`Successfully committed sell`).status(200);
    } catch(e:any) {
      await errorLogs.insertOne({
        type: "ErrorEventType",
        transactionId: 1,
        timestamp: new Date(),
        server: "transaction-server",
        errorMessage: e.message,
        command: "COMMIT_SELL",
        username: username,
        stockSymbol: stockSymbol
      });
  
      res.send(`Error: Failed to update account ${username}`).status(500);
    }
  }
});

app.post('/cancelSell', async (req, res) => {
  const db = await connectToDatabase();
  if(!db) {
    res.send("Error: Database connection failed").status(500);
    return;
  }
  let userCommandLogs = await db.collection("USER_COMMAND_LOGS");
  let accountTransactionLogs = await db.collection("ACCOUNT_TRANSACTION_LOGS");
  let errorLogs = await db.collection("ERROR_LOGS");
  let users = await db.collection("USERS");
  
  const transactionId: number = req.body.transactionId;
  const username: string = req.body.username;
  const stockSymbol: string = req.body.stockSymbol;

  // Test Data
  // const transactionId: number = 15;
  // const username: string = "test1";
  // const stockSymbol: string = "SYM";
  
  await userCommandLogs.insertOne({
    type: "UserCommandType",
    transactionId: transactionId,
    timestamp: new Date(),
    server: "transaction-server",
    command: "CANCEL_SELL",
    username: username,
    stockSymbol: stockSymbol
  });

  const userExist = await userExists(username);

  if(!userExist) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: "User does not exist",
      command: "CANCEL_SELL",
      username: username,
      stockSymbol: stockSymbol
    });

    return res.send(`Error: User ${username} does not exist`).status(500);
  }

  const user = await users.findOne({username: username, uncommittedSells: {$exists: true}});

  if(user) {
    try {
      await users.updateOne({username: username}, {$unset: {uncommittedSells: ""}});
    } catch(e:any) {
      await errorLogs.insertOne({
        type: "ErrorEventType",
        transactionId: 1,
        timestamp: new Date(),
        server: "transaction-server",
        errorMessage: e.message,
        command: "CANCEL_SELL",
        username: username,
        stockSymbol: stockSymbol
      });

      res.send(`Error: Failed to update account ${username}`).status(500);
    }
    await accountTransactionLogs.insertOne({
      type: "AccountTransactionType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      command: "CANCEL_SELL",
      username: username,
      stockSymbol: stockSymbol,
      numStocks: user.uncommittedSells.numStocks,
      funds: user.uncommittedSells.price
    });
  
    res.send(`Successfully cancelled sell`).status(200);
  } else {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: "No uncommitted sells",
      command: "CANCEL_SELL",
      username: username,
      stockSymbol: stockSymbol
    });

    res.send(`Error: No uncommitted sells`).status(500);
  }
});

app.post('/setBuyAmount', async (req, res) => {
  const db = await connectToDatabase();
  if(!db) {
    res.send("Error: Database connection failed").status(500);
    return;
  }
  let userCommandLogs = await db.collection("USER_COMMAND_LOGS");
  let accountTransactionLogs = await db.collection("ACCOUNT_TRANSACTION_LOGS");
  let errorLogs = await db.collection("ERROR_LOGS");
  let users = await db.collection("USERS");
  let triggers = await db.collection("BUY_TRIGGERS");

  // const transactionId: number = req.body.transactionId;
  // const username: string = req.body.username;
  // const stockSymbol: string = req.body.stockSymbol;
  // const amount: number = req.body.amount;

  // Test Data
  const transactionId: number = 16;
  const username: string = "test1";
  const stockSymbol: string = "SYM";
  const amount: number = 100;

  await userCommandLogs.insertOne({
    type: "UserCommandType",
    transactionId: transactionId,
    timestamp: new Date(),
    server: "transaction-server",
    command: "SET_BUY_AMOUNT",
    username: username,
    stockSymbol: stockSymbol,
    amount: amount
  });

  const userExist = await userExists(username);

  if(!userExist) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: "User does not exist",
      command: "SET_BUY_AMOUNT",
      username: username,
      stockSymbol: stockSymbol
    });

    return res.send(`Error: User ${username} does not exist`).status(500);
  }

  try {
    await triggers.updateOne({
      username: username, 
      stockSymbol: stockSymbol
      }, 
      {
        $inc: 
        {
          amount: amount
        },
        $set:
        {
          triggerPrice: 0,
          set: false
        }
      },
      {upsert: true}
    );

    await accountTransactionLogs.insertOne({
      type: "AccountTransactionType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      command: "SET_BUY_AMOUNT",
      username: username,
      stockSymbol: stockSymbol,
      numStocks: amount
    });

    res.send(`Successfully set buy amount`).status(200);
  } catch(e:any) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: e.message,
      command: "SET_BUY_AMOUNT",
      username: username,
      stockSymbol: stockSymbol
    });

    res.send(`Error: Failed to set buy amount for ${username}`).status(500);
  }
});

app.post('/setBuyTrigger', async (req, res) => {
  const db = await connectToDatabase();
  if(!db) {
    res.send("Error: Database connection failed").status(500);
    return;
  }
  let userCommandLogs = await db.collection("USER_COMMAND_LOGS");
  let accountTransactionLogs = await db.collection("ACCOUNT_TRANSACTION_LOGS");
  let errorLogs = await db.collection("ERROR_LOGS");
  let users = await db.collection("USERS");
  let triggers = await db.collection("BUY_TRIGGERS");
  
  // const transactionId: number = req.body.transactionId;
  // const username: string = req.body.username;
  // const stockSymbol: string = req.body.stockSymbol;
  // const triggerPrice: number = req.body.triggerPrice;

  // Test Data
  const transactionId: number = 17;
  const username: string = "test1";
  const stockSymbol: string = "SYM";
  const triggerPrice: number = 10;

  await userCommandLogs.insertOne({
    type: "UserCommandType",
    transactionId: transactionId,
    timestamp: new Date(),
    server: "transaction-server",
    command: "SET_BUY_TRIGGER",
    username: username,
    stockSymbol: stockSymbol,
    triggerPrice: triggerPrice
  });

  const userExist = await userExists(username);

  if(!userExist) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: "User does not exist",
      command: "SET_BUY_TRIGGER",
      username: username,
      stockSymbol: stockSymbol
    });

    return res.send(`Error: User ${username} does not exist`).status(500);
  }

  const userTrigger = await triggers.findOne({username: username, stockSymbol: stockSymbol});
  const user = await users.findOne({username: username});

  if(!userTrigger) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: "User does not have set buy amount",
      command: "SET_BUY_TRIGGER",
      username: username,
      stockSymbol: stockSymbol
    });

    return res.send(`Error: User ${username} does not have set buy amount issued for this stock`).status(500);
  }

  const transPrice = Number((userTrigger.amount * userTrigger.triggerPrice).toFixed(2));

  if(user && transPrice > user.balance) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: "User does not have enough balance",
      command: "SET_BUY_TRIGGER",
      username: username,
      stockSymbol: stockSymbol
    });

    return res.send(`Error: User ${username} does not have enough balance to set this buy trigger`).status(500);
  }

  try {
    await triggers.updateOne({
      username: username,
      stockSymbol: stockSymbol
    },
    {
      $set:
      {
        triggerPrice: triggerPrice,
        set: true
      }
    });

    // Reserver the amount for the trigger transaction
    await users.updateOne({
      username: username
    },
    {
      $inc:
      {
        balance: -transPrice,
        lockedBalance: transPrice
      }
    });

    await accountTransactionLogs.insertOne({
      type: "AccountTransactionType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      command: "SET_BUY_TRIGGER",
      username: username,
      stockSymbol: stockSymbol,
      numStocks: userTrigger.amount,
      price: triggerPrice
    });

    res.send(`Successfully set buy trigger`).status(200);
  } catch(e:any) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: e.message,
      command: "SET_BUY_TRIGGER",
      username: username,
      stockSymbol: stockSymbol
    });

    res.send(`Error: Failed to set buy trigger for ${username}`).status(500);
  }
});

app.post('/cancelSetBuy', async (req, res) => {
  const db = await connectToDatabase();
  if(!db) {
    res.send("Error: Database connection failed").status(500);
    return;
  }
  let userCommandLogs = await db.collection("USER_COMMAND_LOGS");
  let accountTransactionLogs = await db.collection("ACCOUNT_TRANSACTION_LOGS");
  let errorLogs = await db.collection("ERROR_LOGS");
  let users = await db.collection("USERS");
  let triggers = await db.collection("BUY_TRIGGERS");

  // const transactionId: number = req.body.transactionId;
  // const username: string = req.body.username;
  // const stockSymbol: string = req.body.stockSymbol;

  // Test Data
  const transactionId: number = 17;
  const username: string = "test1";
  const stockSymbol: string = "SYM";

  await userCommandLogs.insertOne({
    type: "UserCommandType",
    transactionId: transactionId,
    timestamp: new Date(),
    server: "transaction-server",
    command: "CANCEL_SET_BUY",
    username: username,
    stockSymbol: stockSymbol
  });

  const userExist = await userExists(username);

  if(!userExist) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: "User does not exist",
      command: "CANCEL_SET_BUY",
      username: username,
      stockSymbol: stockSymbol
    });

    return res.send(`Error: User ${username} does not exist`).status(500);
  }

  const userTrigger = await triggers.findOne({username: username, stockSymbol: stockSymbol});

  if(!userTrigger) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: "User does not have set buy for this stock",
      command: "CANCEL_SET_BUY",
      username: username,
      stockSymbol: stockSymbol
    });

    return res.send(`Error: User ${username} does not have set buy issued for this stock`).status(500);
  }

  const transPrice = Number((userTrigger.amount * userTrigger.triggerPrice).toFixed(2));

  try {
    await triggers.deleteOne({
      username: username,
      stockSymbol: stockSymbol
    });

    // Release the reserved amount for the trigger transaction
    await users.updateOne({
      username: username
    },
    {
      $inc:
      {
        balance: transPrice,
        lockedBalance: -transPrice
      }
    });

    await accountTransactionLogs.insertOne({
      type: "AccountTransactionType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      command: "CANCEL_SET_BUY",
      username: username,
      stockSymbol: stockSymbol,
      numStocks: userTrigger.amount,
      price: userTrigger.triggerPrice
    });

    res.send(`Successfully cancelled set buy`).status(200);
  } catch(e:any) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: e.message,
      command: "CANCEL_SET_BUY",
      username: username,
      stockSymbol: stockSymbol
    });
    
    res.send(`Error: Failed to cancel set buy for ${username}`).status(500);
  }
});

app.post('/setSellAmount', async (req, res) => {
  const db = await connectToDatabase();
  if(!db) {
    res.send("Error: Database connection failed").status(500);
    return;
  }
  let userCommandLogs = await db.collection("USER_COMMAND_LOGS");
  let accountTransactionLogs = await db.collection("ACCOUNT_TRANSACTION_LOGS");
  let errorLogs = await db.collection("ERROR_LOGS");
  let users = await db.collection("USERS");
  let triggers = await db.collection("SELL_TRIGGERS");

  // const transactionId: number = req.body.transactionId;
  // const username: string = req.body.username;
  // const stockSymbol: string = req.body.stockSymbol;
  // const amount: number = req.body.amount;

  // Test Data
  const transactionId: number = 18;
  const username: string = "test1";
  const stockSymbol: string = "SYM";
  const amount: number = 10;

  await userCommandLogs.insertOne({
    type: "UserCommandType",
    transactionId: transactionId,
    timestamp: new Date(),
    server: "transaction-server",
    command: "SET_SELL_AMOUNT",
    username: username,
    stockSymbol: stockSymbol,
    numStocks: amount
  });

  const userExist = await userExists(username);

  if(!userExist) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: "User does not exist",
      command: "SET_SELL_AMOUNT",
      username: username,
      stockSymbol: stockSymbol
    });

    return res.send(`Error: User ${username} does not exist`).status(500);
  }

  const user = await users.findOne({username: username, stocks:{$elemMatch:{stockSymbol: stockSymbol, numStocks:{ $gt: 0}}}});

  if(user){
    const userStocks = user.stocks.find((stock: any) => stock.stockSymbol === stockSymbol).amount;

    if(userStocks < amount) {
      await errorLogs.insertOne({
        type: "ErrorEventType",
        transactionId: 1,
        timestamp: new Date(),
        server: "transaction-server",
        errorMessage: "User does not have enough stocks",
        command: "SET_SELL_AMOUNT",
        username: username,
        stockSymbol: stockSymbol
      });

      return res.send(`Error: User ${username} does not have enough stocks`).status(500);
    }

    let stockIndex = -1;
    if(user.reservedStocks) {
      stockIndex = user.reservedStocks.findIndex((stock:Stock) => stock.stockSymbol === stockSymbol); 
    }

    let update = {};

    if(stockIndex === -1) {
      update = {
        $push: {
          reservedStocks: {
            stockSymbol: stockSymbol,
            numStocks: amount
          }
        },
        $inc: {
          "stocks.$.numStocks": -amount
        }
      }
    } else {
      update = {
        $inc: {
          "reservedStocks.$.numStocks": amount,
          "stocks.$.numStocks": -amount
        }
      }
    }

    try {
      // Create/update sell trigger
      await triggers.updateOne({
        username: username,
        stockSymbol: stockSymbol
      },
      {
        $inc:
        {
          amount: amount
        },
        $set:
        {
          triggerPrice: 0,
          set: false
        }
      },
      {upsert: true});
  
      
      // Reserve the amount for the trigger transaction
      await users.updateOne({
        username: username,
        "stocks.stockSymbol": stockSymbol
      },
      update,
      {upsert: true}
      );
  
      await accountTransactionLogs.insertOne({
        type: "AccountTransactionType",
        transactionId: 1,
        timestamp: new Date(),
        server: "transaction-server",
        command: "SET_SELL_AMOUNT",
        username: username,
        stockSymbol: stockSymbol,
        numStocks: amount,
      });
  
      res.send(`Successfully set sell amount`).status(200);
    } catch(e:any) {
      await errorLogs.insertOne({
        type: "ErrorEventType",
        transactionId: 1,
        timestamp: new Date(),
        server: "transaction-server",
        errorMessage: e.message,
        command: "SET_SELL_AMOUNT",
        username: username,
        stockSymbol: stockSymbol
      });
      console.log(e.message)
      res.send(`Error: Failed to set sell amount for ${username}`).status(500);
    }
  } else {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: "User does not own stock",
      command: "SET_SELL_AMOUNT",
      username: username,
      stockSymbol: stockSymbol
    });

    return res.send(`Error: User ${username} does not own stock`).status(500);
  }
});

app.post('/setSellTrigger', async (req, res) => {
  const db = await connectToDatabase();
  if(!db) {
    res.send("Error: Database connection failed").status(500);
    return;
  }
  let userCommandLogs = await db.collection("USER_COMMAND_LOGS");
  let accountTransactionLogs = await db.collection("ACCOUNT_TRANSACTION_LOGS");
  let errorLogs = await db.collection("ERROR_LOGS");
  let users = await db.collection("USERS");
  let triggers = await db.collection("SELL_TRIGGERS");
  
  // const transactionId: number = req.body.transactionId;
  // const username: string = req.body.username;
  // const stockSymbol: string = req.body.stockSymbol;
  // const triggerPrice: number = req.body.triggerPrice;

  // Test Data
  const transactionId: number = 19;
  const username: string = "test1";
  const stockSymbol: string = "SYM";
  const triggerPrice: number = 10;

  await userCommandLogs.insertOne({
    type: "UserCommandType",
    transactionId: transactionId,
    timestamp: new Date(),
    server: "transaction-server",
    command: "SET_SELL_TRIGGER",
    username: username,
    stockSymbol: stockSymbol,
    triggerPrice: triggerPrice
  });

  const userExist = await userExists(username);

  if(!userExist) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: "User does not exist",
      command: "SET_SELL_TRIGGER",
      username: username,
      stockSymbol: stockSymbol
    });

    return res.send(`Error: User ${username} does not exist`).status(500);
  }

  const trigger = await triggers.findOne({
    username: username,
    stockSymbol: stockSymbol
  });

  if(!trigger) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: "User does not have a sell amount set",
      command: "SET_SELL_TRIGGER",
      username: username,
      stockSymbol: stockSymbol
    });

    return res.send(`Error: User ${username} does not have a sell amount set`).status(500);
  }

  try {
    await triggers.updateOne({ 
      username: username,
      stockSymbol: stockSymbol
    },
    {
      $set:
      {
        triggerPrice: triggerPrice,
        set: true
      }
    });

    await accountTransactionLogs.insertOne({
      type: "AccountTransactionType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      command: "SET_SELL_TRIGGER",
      username: username,
      stockSymbol: stockSymbol,
      triggerPrice: triggerPrice
    });

    res.send(`Successfully set sell trigger`).status(200);
  } catch(e:any) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: e.message,
      command: "SET_SELL_TRIGGER",
      username: username,
      stockSymbol: stockSymbol
    });

    res.send(`Error: Failed to set sell trigger for ${username}`).status(500);
  }
});

app.post('/cancelSetSell', async (req, res) => {
  const db = await connectToDatabase();
  if(!db) {
    res.send("Error: Database connection failed").status(500);
    return;
  }
  let userCommandLogs = await db.collection("USER_COMMAND_LOGS");
  let accountTransactionLogs = await db.collection("ACCOUNT_TRANSACTION_LOGS");
  let errorLogs = await db.collection("ERROR_LOGS");
  let users = await db.collection("USERS");
  let triggers = await db.collection("SELL_TRIGGERS");

  // const transactionId: number = req.body.transactionId;
  // const username: string = req.body.username;
  // const stockSymbol: string = req.body.stockSymbol;

  // Test Data
  const transactionId: number = 19;
  const username: string = "test1";
  const stockSymbol: string = "SYM";

  await userCommandLogs.insertOne({
    type: "UserCommandType",
    transactionId: transactionId,
    timestamp: new Date(),
    server: "transaction-server",
    command: "CANCEL_SELL",
    username: username,
    stockSymbol: stockSymbol
  });

  const userExist = await userExists(username);

  if(!userExist) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: "User does not exist",
      command: "CANCEL_SELL",
      username: username,
      stockSymbol: stockSymbol
    });

    return res.send(`Error: User ${username} does not exist`).status(500);
  }

  const trigger = await triggers.findOne({
    username: username,
    stockSymbol: stockSymbol
  });

  const stockAmount = trigger && trigger.amount;

  if(!trigger) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: "User does not have a sell trigger for this stock",
      command: "CANCEL_SELL",
      username: username,
      stockSymbol: stockSymbol
    });

    return res.send(`Error: User ${username} does not have a sell trigger set for this stock`).status(500);
  }

  try {
    // Cancel sell trigger
    await triggers.deleteOne({
      username: username,
      stockSymbol: stockSymbol
    });

    // Release the stocks from the user's account
    await users.updateOne({
      username: username,
      "stocks.stockSymbol": stockSymbol,
    },
    {
      $inc: {
        "reservedStocks.$.numStocks": -stockAmount,
        "stocks.$.numStocks": stockAmount
      }
    });


    await accountTransactionLogs.insertOne({
      type: "AccountTransactionType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      command: "CANCEL_SELL",
      username: username,
      stockSymbol: stockSymbol
    });

    res.send(`Successfully cancelled sell trigger`).status(200);
  } catch(e:any) {
    await errorLogs.insertOne({
      type: "ErrorEventType",
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: e.message,
      command: "CANCEL_SELL",
      username: username,
      stockSymbol: stockSymbol
    });

    res.send(`Error: Failed to cancel sell trigger for ${username}`).status(500);
  }
});

app.post('/dumplog' , async (req, res) => {
  const db = await connectToDatabase();
  if(!db) {
    res.send("Error: Database connection failed").status(500);
    return;
  }
  let userCommandLogs = await db.collection("USER_COMMAND_LOGS");
  let accountTransactionLogs = await db.collection("ACCOUNT_TRANSACTION_LOGS");
  let errorLogs = await db.collection("ERROR_LOGS");

  const transactionId: number = req.body.transactionId;
  const username: string = req.body.username;
  const filename: string = req.body.filename;

  await userCommandLogs.insertOne({
    type: "UserCommandType",
    transactionId: transactionId,
    timestamp: new Date(),
    server: "transaction-server",
    command: "DUMPLOG",
    username: username,
    filename: filename ?? ""
  });

  if(username) {
    const userExist = await userExists(username);

    if(!userExist) {
      await errorLogs.insertOne({
        type: "ErrorEventType",
        transactionId: 1,
        timestamp: new Date(),
        server: "transaction-server",
        errorMessage: "User does not exist",
        command: "DUMPLOG",
        username: username,
        filename: filename ?? ""
      });

      return res.send(`Error: User ${username} does not exist`).status(500);
    }

    const userLogs = await accountTransactionLogs.find({
      username: username
    },
    { projection: { _id: 0 } }).toArray();

    const logs = JSON.stringify(userLogs);

    res.send(logs).status(200);
  } else {
    const allLogs = await accountTransactionLogs.find({}, { projection: { _id: 0 } }).toArray();
    console.log(allLogs);

    const logs = JSON.stringify(allLogs);

    res.send(logs).status(200);
  }
});

app.post('/displaySummary', async (req, res) => {
  const db = await connectToDatabase();
  if(!db) {
    res.send("Error: Database connection failed").status(500);
    return;
  }
  let userCommandLogs = await db.collection("USER_COMMAND_LOGS");
  let accountTransactionLogs = await db.collection("ACCOUNT_TRANSACTION_LOGS");
  let errorLogs = await db.collection("ERROR_LOGS");
  let users = await db.collection("USERS");
  
  const transactionId: number = req.body.transactionId;
  const username: string = req.body.username;

  await userCommandLogs.insertOne({
    type: "UserCommandType",
    transactionId: transactionId,
    timestamp: new Date(),
    server: "transaction-server",
    command: "DISPLAY_SUMMARY",
    username: username
  });

  const userExist = await userExists(username);

  if(!userExist) {
    await errorLogs.insertOne({
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: "User does not exist",
      command: "DISPLAY_SUMMARY",
      username: username
    });

    return res.send(`Error: User ${username} does not exist`).status(500);
  }

  const user = await users.findOne({
    username: username
  });

  if (user) {
    const stocks = user.stocks;
    const reservedStocks = user.reservedStocks;
  
    const stockSummary = stocks.map((stock: any) => {
      return {
        stockSymbol: stock.stockSymbol,
        numStocks: stock.numStocks
      }
    });
  
    const reservedStockSummary = reservedStocks.map((stock: any) => {
      return {
        stockSymbol: stock.stockSymbol,
        numStocks: stock.numStocks
      }
    });
  
    const summary = {
      username: username,
      cash: user.cash,
      stocks: stockSummary,
      reservedStocks: reservedStockSummary
    }
  
    const dump = JSON.stringify(summary);
  
    res.send(dump).status(200);
  }
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});