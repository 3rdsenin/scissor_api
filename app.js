const app = require('./index');
const { mongoConnect, redisConnect } = require('./database/index')
require("dotenv").config();
const port = process.env.PORT || 5000

const mongo_url = process.env.MONGODB_URL;

//redisConnect();
mongoConnect(mongo_url);





app.listen(port, () => {
    console.log("Server Started on Port " + port);
})