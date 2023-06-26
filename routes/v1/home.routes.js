const router = require('express').Router();
const urls = require('../../controllers/url.controllers')
const ShortUrl = require('../../models/url.models')
const requestip = require('../../middleware/requestip.middleware')
const date_time = require('../../middleware/requestdatetime.middleware')
const { isAuthorized, getUserIdFromToken, } = require('../../utils/functions')




const cache = async(key, cb) => {
    const value = await redisClient.get(key);

    if (value !== null) {
        console.log("cache hit");

    } else {
        const newvalue = cb();
        await redisClient.setEx(key, 60, JSON.stringify(newvalue));

    }

}
router.get('/404', async(req, res) => {
    res.render('404')
})

router.get('/:shortId', requestip.ipMiddleware, async(req, res) => {


    const shortUrl = await ShortUrl.findOne({ domain: req.params.shortId })

    if (shortUrl == null) { return res.render('404'); } else {

        let historyObj = { ip: req.clientIp, time: date_time.dateNow() }
            //console.log(historyObj);
        shortUrl.history.push(historyObj)
            //console.log(shortUrl.history)
        shortUrl.clicks++;
        shortUrl.save();


        res.redirect(shortUrl.full);
    }
})



router.post('/', isAuthorized, async(req, res) => {
    const userID = getUserIdFromToken(req.session.token);
    const value = await redisClient.get(`urls?userID=${userID}`);
    if (value) {
        console.log("hit");
        res.render('index', { shortUrls: JSON.parse(value) });
    } else {
        console.log("miss");
        const userID = getUserIdFromToken(req.session.token);
        const shortUrls = await urls.getAllUrls(userID);
        await redisClient.setEx(`urls?userID=${userID}`, 120, JSON.stringify(shortUrls));
        res.render('index', { shortUrls: shortUrls });
    }
})

router.get('/', isAuthorized, async(req, res) => {
    const userID = getUserIdFromToken(req.session.token);
    const value = await redisClient.get(`urls?userID=${userID}`);
    if (value) {
        console.log("hit");
        res.render('index', { shortUrls: JSON.parse(value) });
    } else {
        console.log("miss");
        const userID = getUserIdFromToken(req.session.token);
        const shortUrls = await urls.getAllUrls(userID);
        await redisClient.setEx(`urls?userID=${userID}`, 120, JSON.stringify(shortUrls));
        res.render('index', { shortUrls: shortUrls });
    }

})


module.exports = router;