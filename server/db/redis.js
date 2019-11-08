const redis = require('redis');
const bluebird = require('bluebird');

// Promisify redis
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// Create client
const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
// Set password if needed
if (process.env.REDIS_PASSWORD) client.auth(process.env.REDIS_PASSWORD);

client.on('error', (err) => {
    console.log('Redis error: ' + err);
});

module.exports = { redis, client };