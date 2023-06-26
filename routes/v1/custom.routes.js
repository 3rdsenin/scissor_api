const router = require('express').Router();
const ShortUrl = require('../../controllers/url.controllers')
const { isAuthorized, getUserIdFromToken } = require('../../utils/functions')

router.post('/', isAuthorized, ShortUrl.createCustomShortUrl)

router.get('/', isAuthorized, async(req, res) => {
    const userID = getUserIdFromToken(req.session.token);
    const shortUrls = await ShortUrl.getCustomUrls(userID);
    res.render('custom', { shortUrls: shortUrls });
})

module.exports = router;