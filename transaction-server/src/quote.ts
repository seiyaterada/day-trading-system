import net from "net";
import {connectToDatabase} from "../db/connection";
import redisClient from "../db/redisClient";

// Test Data before transaction server online
const SYM = "S";
const user_id = "oY01WVirLr";

const HOST = 'quoteserve.seng.uvic.ca';
const QUOTE_PORT = 4444;


export const getQuote = async (sym: string, username: string) =>{
    const db = await connectToDatabase();
    if(!db) { 
        // res.send("Error: Database connection failed").status(500);
        return 0;
      }
    let quoteServerLogs = await db.collection("QUOTE SERVER LOGS");
    let errorLogs = await db.collection("ERROR LOGS");

    let result = await redisClient.get(sym);

    if (!result) {
        try{
            const client =  net.createConnection(QUOTE_PORT, HOST,()=>{
                console.log(`Connecting to the quote server with port ${QUOTE_PORT}`);
                client.write(`${sym} ${username} \n`);
            });
        
             client.on('data',async (data)=>{
                 
                client.destroy();
                await redisClient.set(sym, data[0], {EX: 60});
                await quoteServerLogs.insertOne({type: "QuoteServerType", transactionId: 1, timestamp: new Date(), server: "transaction-server", command: "QUOTE", username: username, stockSymbol: sym, quoteServerTime: data[3], cryptokey: data[4]});
                return data[0];
            });
        
            client.on('error',async (err)=>{
                await errorLogs.insertOne({type: "ErrorEventType", transactionId: 1, timestamp: new Date(), server: "transaction-server", errorMessage: err.message, command: "QUOTE", username: user_id});
                console.log(`Error: ${err.message}`);
                client.destroy();
            });
        
             client.on('close',()=>{
                console.log(`Connection Closed`);
            });
        } catch(e:any) {
            console.log(e.message);
        }
    }

    // Got quote from cache if we made it to this point
    return result;
}
