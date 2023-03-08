const net = require('net');
const redis = require('redis');
const SYM = "S";
const user_id = "oY01WVirLr";

const HOST = 'quoteserve.seng.uvic.ca';
const QUOTE_PORT = 4444;
const client = new net.Socket();

const REDIS_PORT = 6379;
const client_redis = redis.createClient(REDIS_PORT);

exports.getQuoteInfo = (sym, userID) =>{

    client.connect(HOST,QUOTE_PORT,() =>{
        console.log('Connected to server');
        client.write(`${SYM}, ${user_id} \n`);
        // client.write(SYM + " " + user_id + "\n");
    });

    client.on('data',(data)=>{
        console.log(`Received: ${data}`);
        // setRedisData(data);
        client.destroy();
    });

    client.on('close',()=>{
        console.log(`Connection Closed`);
    });
}

// function setRedisData(data){
//     try {
//         // key, expiration, data
//         // TO DO: Generate key from data
//         client_redis.set(key,3600,data)
//     } catch (err) {
//         console.error(err);
//     }
// }
