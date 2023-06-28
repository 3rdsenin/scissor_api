const router = require('express').Router();
const urls = require('../../controllers/url.controllers')
const ShortUrl = require('../../models/url.models')
const requestip = require('../../middleware/requestip.middleware')
const date_time = require('../../middleware/requestdatetime.middleware')
const { isAuthorized, getUserIdFromToken } = require('../../utils/functions')
const redis = require('redis');
const { redisConnect } = require('../../database/index')


const redisClient = redis.createClient({
    url: process.env.REDIS_URL
});

redisConnect(redisClient);


router.get('/:shortId', requestip.ipMiddleware, async(req, res) => {


    const shortUrl = await ShortUrl.findOne({ domain: req.params.shortId })

    if (shortUrl == null) { return res.status(404).json({ message: "Invalid Short URL" }); } else {

        let historyObj = { ip: req.clientIp, time: date_time.dateNow() }
            //console.log(historyObj);
        shortUrl.history.push(historyObj)
            //console.log(shortUrl.history)
        shortUrl.clicks++;
        shortUrl.save();

        return res.status(201).json({ shortenedUrl: shortUrl.domain, fullUrl: shortUrl.full });
    }
})



router.post('/', isAuthorized, async(req, res) => {
    const token = req.headers.token
    const userID = getUserIdFromToken(token);
    const value = await redisClient.get(`urls?userID=${userID}`);
    if (value) {
        console.log("hit");
        res.json({ shortUrls: JSON.parse(value) });
    } else {
        console.log("miss");
        const userID = getUserIdFromToken(req.headers.token);
        const shortUrls = await urls.getAllUrls(userID);
        await redisClient.setEx(`urls?userID=${userID}`, 60, JSON.stringify(shortUrls));
        res.json({ shortUrls: shortUrls });
    }
})

router.get('/', isAuthorized, async(req, res) => {
    const token = req.headers.token
    const userID = getUserIdFromToken(token);
    const value = await redisClient.get(`urls?userID=${userID}`);
    if (value) {
        console.log("hit");
        res.json({ shortUrls: JSON.parse(value) });
    } else {
        console.log("miss");
        const userID = getUserIdFromToken(req.headers.token);
        const shortUrls = await urls.getAllUrls(userID);
        await redisClient.setEx(`urls?userID=${userID}`, 60, JSON.stringify(shortUrls));
        res.json({ shortUrls: shortUrls });
    }
})


module.exports = router;