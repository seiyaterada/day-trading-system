import express from "express";
import cors from "cors";
import {connectToDatabase} from "../db/connection";
import { ErrorType, AccountTransactionType, User, Stock } from "./interfaces";
import { userExists } from "./userExists";
import { getQuote } from "./quote";
// import routes from "./routes.mjs";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());
// await db.deleteCollection("LOGS");
// await db.deleteCollection("USERS");

// let userCommandLogs = await db.collection("USER COMMAND LOGS");
// let accountTransactionLogs = await db.collection("ACCOUNT TRANSACTION LOGS");
// let errorLogs = await db.collection("ERROR LOGS");
// let users = await db.collection("USERS");
// let systemEventLogs = await db.collection("SYSTEM EVENT LOGS");
// let debugLogs = await db.collection("DEBUG LOGS");

app.post('/add', async (req, res) => {
  const db = await connectToDatabase();
  if(!db) { 
    res.send("Error: Database connection failed").status(500);
    return;
  }
  let userCommandLogs = await db.collection("USER_COMMAND_LOGS");
  let accountTransactionLogs = await db.collection("ACCOUNT_TRANSACTION_LOGS");
  let errorLogs = await db.collection("ERROR _LOGS");
  let users = await db.collection("USERS");

  const username = 'test1'
  const transactionId: number = req.body.transactionId;
  const user: User = {
    username: username,
    funds: 1000
  }
  await userCommandLogs.insertOne({
    transactionId: 1,  
    timestamp: new Date(), 
    server: "transaction-server", 
    command: "ADD", 
    username: username, 
    funds: user.funds
  });

  // if user already exists update account balance
  try {
    const result = await users.updateOne(
      { username: user.username },
      { $inc: { balance: user.funds } },
      { upsert: true }
    );
  
    await accountTransactionLogs.insertOne({
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      command: "ADD",
      username: username,
      funds: user.funds
    });
  
    res.send(result).status(200);
  
  } catch(e:any) {
    await errorLogs.insertOne({
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: e.message,
      command: "ADD",
      username: username,
      funds: user.funds
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

  // const transactionId: number = req.body.transactionId;
  // const username: string = req.body.username;
  // const stockSymbol: string = req.body.stockSymbol;
  // const amount: number = req.body.amount;

  // Test Data
  const transactionId: number = 10;
  const username: string = "test1";
  const stockSymbol: string = "SYM";
  const amount: number = 100;

  await userCommandLogs.insertOne({
    transactionId: transactionId, 
    timestamp: new Date(), 
    server: "transaction-server", 
    command: "BUY", 
    username: username, 
    stockSymbol: stockSymbol
  });

  const userExist = await userExists(username);

  if(!userExist) {
    await errorLogs.insertOne({transactionId: 1, timestamp: new Date(), server: "transaction-server", errorMessage: "User does not exist", command: "BUY", username: username, stockSymbol: stockSymbol});
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

  // const transactionId: number = req.body.transactionId;
  // const username: string = req.body.username;
  // const stockSymbol: string = req.body.stockSymbol;

  // Test Data
  const transactionId: number = 11;
  const username: string = "test1";
  const stockSymbol: string = "SYM";

  await userCommandLogs.insertOne({
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

  // const transactionId: number = req.body.transactionId;
  // const username: string = req.body.username;
  // const stockSymbol: string = req.body.stockSymbol;

  // Test Data
  const transactionId: number = 12;
  const username: string = "test1";
  const stockSymbol: string = "SYM";

  await userCommandLogs.insertOne({
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
  
  // const transactionId: number = req.body.transactionId;
  // const username: string = req.body.username;
  // const stockSymbol: string = req.body.stockSymbol;
  // const amount: number = req.body.amount;

  // Test Data
  const transactionId: number = 14;
  const username: string = "test1";
  const stockSymbol: string = "SYM";
  const amount: number = 100;

  await userCommandLogs.insertOne({
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

  // const transactionId: number = req.body.transactionId;
  // const username: string = req.body.username;
  // const stockSymbol: string = req.body.stockSymbol;

  // Test Data
  const transactionId: number = 15;
  const username: string = "test1";
  const stockSymbol: string = "SYM";

  await userCommandLogs.insertOne({
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
  
  // const transactionId: number = req.body.transactionId;
  // const username: string = req.body.username;
  // const stockSymbol: string = req.body.stockSymbol;

  // Test Data
  const transactionId: number = 15;
  const username: string = "test1";
  const stockSymbol: string = "SYM";
  
  await userCommandLogs.insertOne({
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
      transactionId: 1,
      timestamp: new Date(),
      server: "transaction-server",
      errorMessage: "User does not exist",
      command: "CANCEL_SELL",
      username: username,
      stockSymbol: stockSymbol
    });

    res.send(`Error: User ${username} does not exist`).status(500);
  }

  const user = await users.findOne({username: username, uncommittedSells: {$exists: true}});

  if(user) {
    try {
      await users.updateOne({username: username}, {$unset: {uncommittedSells: ""}});
    } catch(e:any) {
      await errorLogs.insertOne({
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



// Load the /posts routes
// app.use("/", routes);

// Global error handling
// app.use((err, _req, res, next) => {
//   res.status(500).send("Uh oh! An unexpected error occured.")
// })

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});