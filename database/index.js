const mongoose = require('mongoose');



const redisConnect = async(redisClient) => {

    await redisClient.connect().then(() => {
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