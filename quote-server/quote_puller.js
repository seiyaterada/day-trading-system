const net = require('net');
const SYM = "S";
const user_id = "oY01WVirLr";

const HOST = 'quoteserve.seng.uvic.ca';
const QUOTE_PORT = 4444;
const client = new net.Socket();


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
