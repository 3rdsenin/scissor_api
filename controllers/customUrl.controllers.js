const urlCSchema = require('../models/url.models')

const createCShortUrl = async(req, res) => {
    await urlCSchema.create({ full: req.body.fullUrl, domain: req.body.customdomain })
    res.redirect('/');
}

const getAllCUrls = async() => {
    const allUrls = await urlCSchema.find();
    return allUrls;
}



module.exports = { createCShortUrl, getAllCUrls }