const redis = require('redis');
const REDIS_PORT = 6379;
const client_redis = redis.createClient(REDIS_PORT);

function SetRedisData(SYM,data){
    console.log("Jumping into redis\n");

    try {
        // key, expiration, data from quote server
        console.log("processing caching data");
        client_redis.SETEX(SYM,3600,data)
        console.log("Complete caching data");

    } catch (err) {
        console.error(err);
    }
}
module.exports = {SetRedisData};
