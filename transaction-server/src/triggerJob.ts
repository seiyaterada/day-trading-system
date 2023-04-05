import redisClient from "../db/redisClient";
import {connectToDatabase} from "../db/connection";
import {CronJob} from "cron";
import { getQuote } from "./quote";
import { Collection } from "mongodb";

let userCommandLogs: Collection
let errorLogs: Collection
let accountTransactionLogs: Collection
let users: Collection
let buyTriggerDB: Collection
let sellTriggerDB: Collection

(async () => {
    const db = await connectToDatabase();
    if(!db) {
        console.log("Error: Database connection failed");
        return;
    }
    userCommandLogs = await db.collection("USER_COMMAND_LOGS");
    accountTransactionLogs = await db.collection("ACCOUNT_TRANSACTION_LOGS");
    errorLogs = await db.collection("ERROR _LOGS");
    users = await db.collection("USERS");
    buyTriggerDB = await db.collection("BUY_TRIGGERS");
    sellTriggerDB = await db.collection("SELL_TRIGGERS");

  })();

  // Create job for stock triggers
export const job = new CronJob('0 * * * * *', async () => {
	console.log("Start Job");
	const buyTriggers = await buyTriggerDB.find({set: true}).toArray();
	const sellTriggers = await sellTriggerDB.find({set: true}).toArray();
	
	if(buyTriggers) {
		console.log(buyTriggers);
		// Check if any buy triggers are met
		for(const buyTrigger of buyTriggers) {
			const quote = await getQuote(buyTrigger.stockSymbol, buyTrigger.username);
			if(quote && quote >= buyTrigger.triggerPrice) {
				try{
					const user = users.findOne({username: buyTrigger.username, "stocks.symbol": buyTrigger.stockSymbol});
					let update = {}
					if(await user) {
						update = {
							$inc: {
								"stocks.$.amount": buyTrigger.amount,
								reservedCash: -(buyTrigger.amount * buyTrigger.triggerPrice)
							}
						}
					} else {
						update = {
							$push: {
								stocks: {
									symbol: buyTrigger.stockSymbol,
									amount: buyTrigger.amount
								},
							$inc: {
								reservedCash: -(buyTrigger.amount * buyTrigger.triggerPrice)
								}
							}
						}
					}
					await users.updateOne({
						username: buyTrigger.username,
						"stocks.symbol": buyTrigger.stockSymbol
					},
					update
					)
					await buyTriggerDB.deleteOne({
						username: buyTrigger.username, 
						stockSymbol: buyTrigger.stockSymbol
					});
					await accountTransactionLogs.insertOne({
						type: "AccountTransactionType",
						transactionId: 1,
						timestamp: new Date(),
						server: "transaction-server",
						action: "TRIGGER_BUY",
						username: buyTrigger.username,
						stockSymbol: buyTrigger.stockSymbol,
						funds: buyTrigger.amount * buyTrigger.triggerPrice
					});
				} catch(e:any) {
					console.log(e.message);
					await errorLogs.insertOne({
						type: "ErrorEventType",
						transactionId: 1,
						timestamp: new Date(),
						server: "transaction-server",
						action: "TRIGGER_BUY",
						username: buyTrigger.username,
						stockSymbol: buyTrigger.stockSymbol,
						funds: buyTrigger.amount * buyTrigger.triggerPrice,
						error: e.message
					});
				}
			}
		}
	}

	if(sellTriggers) {
		// Check if any sell triggers are met
		for(const sellTrigger of sellTriggers) {
			const quote = await getQuote(sellTrigger.stockSymbol, sellTrigger.username);
			if(quote && quote <= sellTrigger.triggerPrice) {
				try{
					const user = await users.findOne({username: sellTrigger.username, "stocks.symbol": sellTrigger.stockSymbol});
					let update = {}
					if(user) {
						update = {
							$inc: {
								balance: sellTrigger.amount * sellTrigger.triggerPrice,
								"reservedStocks.$.amount": -sellTrigger.amount
							}
						}
					}
					await users.updateOne({
						username: sellTrigger.username,
						"stocks.symbol": sellTrigger.stockSymbol
					},
					update)
					await sellTriggerDB.deleteOne({
						username: sellTrigger.username,
						stockSymbol: sellTrigger.stockSymbol
					});
					await accountTransactionLogs.insertOne({
						type: "AccountTransactionType",
						transactionId: 1,
						timestamp: new Date(),
						server: "transaction-server",
						action: "TRIGGER_SELL",
						username: sellTrigger.username,
						stockSymbol: sellTrigger.stockSymbol,
						funds: sellTrigger.amount * sellTrigger.triggerPrice
					});
				} catch(e:any) {
					console.log(e.message);
					await errorLogs.insertOne({
						type: "ErrorEventType",
						transactionId: 1,
						timestamp: new Date(),
						server: "transaction-server",
						action: "TRIGGER_SELL",
						username: sellTrigger.username,
						stockSymbol: sellTrigger.stockSymbol,
						funds: sellTrigger.amount * sellTrigger.triggerPrice,
						error: e.message
					});
				}
			}
		}
	}
});