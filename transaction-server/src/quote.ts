import net from "net";
import {connectToDatabase} from "../db/connection";

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

    let response;
     const client =  net.createConnection(QUOTE_PORT, HOST,()=>{
        console.log(`Connecting to the quote server with port ${QUOTE_PORT}`);
        client.write(`${sym} ${username} \n`);
    });

     client.on('data',async (data)=>{
        await quoteServerLogs.insertOne({transactionId: 1, timestamp: new Date(), server: "transaction-server", command: "QUOTE", username: username, stockSymbol: sym, quoteServerTime: data[3], cryptokey: data[4]});
        //quote, SYM, user_id, timestamp, cryptokey}
        console.log(`Received: ${data}`);

        // pass the cryptokey and orginal data to redis
        console.log(`KEY IS: ${SYM}`);
        // lib.SetRedisData(SYM,data);
        response = data[0];
        client.destroy();
    });

    client.on('error',async (err)=>{
        await errorLogs.insertOne({transactionId: 1, timestamp: new Date(), server: "transaction-server", errorMessage: err.message, command: "QUOTE", username: user_id});
        console.log(`Error: ${err.message}`);
        client.destroy();
        return 0
    });

     client.on('close',()=>{
        console.log(`Connection Closed`);
    });
    if (response) {
        return response[0];
    } else {
        return 0;
    }
}
