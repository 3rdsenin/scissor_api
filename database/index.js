const mongoose = require('mongoose');
const redis = require('redis');

const redisConnect = () => {
    const redisClient = redis.createClient({
        url: process.env.REDIS_URL
    });
    redisClient.connect().then(() => {
        console.log('Connected to Redis');
    }).catch((err) => {
        console.log(err.message);
    })

}







const mongoConnect = async(url) => {
    mongoose.connect(url || mongo_url);
    mongoose.connection.on("connected", () => {
        console.log("Connected to DB Successfully");
    });

    mongoose.connection.on("error", () => {
        console.log("Connection error")
    });

}

module.exports = { mongoConnect, redisConnect };