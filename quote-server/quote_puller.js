const lib = require('./quote_caching');
const net = require('net');

const SYM = "S";
const user_id = "oY01WVirLr";


const HOST = 'quoteserve.seng.uvic.ca';
const QUOTE_PORT = 4444;

// exports.GetQuoteInfo = (sym, userID) =>{

    const client = net.createConnection(QUOTE_PORT, HOST,()=>{
        console.log(`Connecting to the quote server with port ${QUOTE_PORT}`);
        client.write(`${SYM} ${user_id} \n`);
        // client.write(`${SYM} ${user_id} \n`);
    });

    client.on('data',(data)=>{
        console.log(`Received: ${data}`);

        //quote, SYM, user_id, timestamp, cryptokey}
        // var elements =data.split(',');
        // pass the cryptokey to redis
        console.log(`KEY IS: ${SYM}`);

        lib.SetRedisData(SYM,data);
        client.destroy();
        console.log('after destory');

    });

    setTimeout(() => {
        console.log('wait caching settle down');
    }, 4000);


    client.on('close',()=>{
        console.log('before Closed');

        console.log(`Connection Closed`);
    });
// }
