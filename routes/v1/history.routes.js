const Router = require('express').Router();
const urls = require('../../models/url.models');
const { isAuthorized, getUserIdFromToken, } = require('../../utils/functions')

Router.get('/', isAuthorized, async(req, res) => {
    const userID = getUserIdFromToken(req.session.token);
    const allUrls = await urls.find({ userID: userID });
    //const aurls = JSON.parse(allUrls)
    // const history = allUrls.history
    // history.forEach((element, index) => {
    //     console.log(element.x); // 100, 200, 300
    //     console.log(index); // 0, 1, 2 
    // console.log(allUrls[1].history[0])
    // allUrls.forEach((shortUrl) => {
    //     console.log(shortUrl.domain + ' ' + "clicks = " + shortUrl.clicks)
    //     shortUrl.history.forEach((element, index) => {
    //         console.log(element.ip + ' ' + element.time)
    //     })
    // })
    res.status(200).render('history', { shortUrls: allUrls })
        //res.send({ allUrls })
})

Router.get('/:domain', async(req, res) => {
    const domain = req.params.domain;
    const allUrls = await urls.find({ domain });
    res.status(200).render('history2', { shortUrls: allUrls })
        //res.send({ allUrls })
})


module.exports = Router;