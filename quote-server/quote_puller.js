const lib = require('./quote_caching');
const net = require('net');

/* For testing purpose
const SYM = "S";
const user_id = "oY01WVirLr";
*/

const HOST = 'quoteserve.seng.uvic.ca';
const QUOTE_PORT = 4444;

exports.GetQuoteInfo = (sym, userID) =>{

    const client = net.createConnection(QUOTE_PORT, HOST,()=>{
        console.log(`Connecting to the quote server with port ${QUOTE_PORT}`);
        client.write(`${sym} ${userID} \n`);
        // client.write(`${SYM} ${user_id} \n`);
    });

    client.on('data',(data)=>{
        console.log(`Received: ${data}`);

        //quote, SYM, user_id, timestamp, cryptokey}
        var elements =data.split(',');

        // pass the cryptokey to redis
        lib.SetRedisData(elements[4]);
        client.destroy();
    });

    client.on('close',()=>{
        console.log(`Connection Closed`);
    });
}
