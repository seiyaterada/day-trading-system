const redis = require('redis');
const client_redis =  redis.createClient({
    legacyMode:true,
    PORT:6379
});

function SetRedisData(SYM,data){

    client_redis.connect().then(async() =>{
        console.log("Jumping into redis caching\n");
        try {
            // key, expiration, data from quote server
            console.log("processing caching data");
            client_redis.SETEX(SYM,3600,data)
            console.log("Complete caching data");
        } catch (err) {
            console.error(err);
        }
    })
}
module.exports = {SetRedisData};
