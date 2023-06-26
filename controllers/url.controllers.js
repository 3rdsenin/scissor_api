const urlSchema = require('../models/url.models');
const { isAuthorized, getUserIdFromToken } = require('../utils/functions')


const createShortUrl = async(req, res) => {
    let domain = !req.body.customdomain ? null : req.body.customdomain;
    const userID = getUserIdFromToken(req.session.token);


    await urlSchema.create({ full: req.body.fullUrl, domain: domain, userID: userID });
    res.redirect('/');
}

const createCustomShortUrl = async(req, res) => {
    let domain = !req.body.customdomain ? null : req.body.customdomain;
    const userID = getUserIdFromToken(req.session.token);

    const domainCheck = await urlSchema.find({ domain: domain })
    console.log(typeof domainCheck)
    if (Object.keys(domainCheck).length === 0) {
        await urlSchema.create({ full: req.body.fullUrl, domain: domain, userID: userID });
        res.redirect('/');
    } else {
        const shortUrls = await getCustomUrls(userID)
        res.render('custom', { message: "Custom keyword already in use", shortUrls: shortUrls })
    }

}

const getAllUrls = async(userID) => {

    const allUrls = await urlSchema.find({ userID: userID, });
    return allUrls;
}

const getCustomUrls = async(userID) => {

    const customUrls = await urlSchema.find({ userID: userID, type: "custom" });
    return customUrls
}


module.exports = { createShortUrl, createCustomShortUrl, getAllUrls, getCustomUrls }