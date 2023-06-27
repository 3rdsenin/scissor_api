const qrCode = require('qrcode');
const jwt = require('jsonwebtoken');
const redis = require('redis');

const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});



const generateQRCode = async(url) => {
    try {
        const qr = await qrCode.toDataURL(url);
        return qr;
    } catch (err) {
        console.error(err)
    }
}

const isAuthorized = (req, res, next) => {
    const token = req.headers.token
    try {
        jwt.verify(token, process.env.jwt_secret);

        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token" })
    }
}

const getUserIdFromToken = (token) => {
    const decodedToken = jwt.decode(token);
    const userId = decodedToken.userid;
    return userId;
}


const cache = (key, cb) => {
    return new Promise((resolve, reject) => {
        redisClient.get(key, async(error, data) => {
            if (error) { return reject(error) }
            if (data != null) { console.log(hit); return resolve(JSON.parse(data)) }
            console.log("miss");
            const freshData = await cb();

            redisClient.set(key, 60, JSON.stringify(freshData))
            resolve(freshData);
        })
    })
}

module.exports = { generateQRCode, isAuthorized, getUserIdFromToken, cache };