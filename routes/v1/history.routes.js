const Router = require('express').Router();
const urls = require('../../models/url.models');
const { isAuthorized, getUserIdFromToken, } = require('../../utils/functions')

Router.get('/', isAuthorized, async(req, res) => {
    try {
        const userID = getUserIdFromToken(req.headers.token);
        const allUrls = await urls.find({ userID: userID });

        res.status(200).json({ shortUrls: allUrls })

    } catch (error) {
        res.status(200).json({ message: "something went wrong", error: error })
    }

})

Router.get('/:domain', isAuthorized, async(req, res) => {
    try {
        const domain = req.params.domain;
        const allUrls = await urls.find({ domain });
        res.status(200).json({ shortUrls: allUrls })

    } catch (error) {

        res.status(200).json({ message: "something went wrong", error: error })
    }

})


module.exports = Router;