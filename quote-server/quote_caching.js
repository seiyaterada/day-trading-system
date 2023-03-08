
export function setRedisData(data){
    try {
        // key, expiration, data
        // TO DO: Generate key from data
        client_redis.set(key,3600,data)
    } catch (err) {
        console.error(err);
    }
}

// cache middleware
export function cache(){

}