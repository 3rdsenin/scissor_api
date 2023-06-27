const router = require('express').Router();
const ShortUrl = require('../../controllers/url.controllers')
const { isAuthorized, getUserIdFromToken } = require('../../utils/functions')

router.post('/', isAuthorized, ShortUrl.createCustomShortUrl)

router.get('/', isAuthorized, async(req, res) => {
    try {
        const userID = getUserIdFromToken(req.headers.token);
        const shortUrls = await ShortUrl.getCustomUrls(userID);
        res.status(200).json({ shortUrls });
    } catch (error) {
        res.status(200).json({ error });
    }

})

module.exports = router;