const redis = require('redis');
const config = require('./index');

const redisClient = redis.createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port
  },
  password: config.redis.password,
  database: config.redis.db
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message);
});

// Connect to Redis
const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error.message);
  }
};

module.exports = { redisClient, connectRedis };
