const redis = require('redis');
const REDIS_PORT = 6379;
const client_redis = redis.createClient(REDIS_PORT);

function SetRedisData(data){
    console.log("Jumpint into redis");
    try {
        // key, expiration, data
        client_redis.set(key,3600,data)
    } catch (err) {
        console.error(err);
    }
}
module.exports = {SetRedisData};

// cache middleware, may not be needed
/*
export function Cache(){

}
*/