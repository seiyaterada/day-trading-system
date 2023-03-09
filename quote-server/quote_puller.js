const lib = require('./quote_caching');
const net = require('net');

// Test Data before transaction server online
const SYM = "S";
const user_id = "oY01WVirLr";

const HOST = 'quoteserve.seng.uvic.ca';
const QUOTE_PORT = 4444;

// exports.GetQuoteInfo = (sym, userID) =>{

     const client =  net.createConnection(QUOTE_PORT, HOST,()=>{
        console.log(`Connecting to the quote server with port ${QUOTE_PORT}`);
        client.write(`${SYM} ${user_id} \n`);
    });

     client.on('data',(data)=>{
        //quote, SYM, user_id, timestamp, cryptokey}
        console.log(`Received: ${data}`);

        // pass the cryptokey and orginal data to redis
        console.log(`KEY IS: ${SYM}`);
        lib.SetRedisData(SYM,data);
        client.destroy();
    });

     client.on('close',()=>{
        console.log(`Connection Closed`);
    });
// }
