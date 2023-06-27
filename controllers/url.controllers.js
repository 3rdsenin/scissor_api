const urlSchema = require('../models/url.models');
const { isAuthorized, getUserIdFromToken } = require('../utils/functions')
const { handleErrors } = require('../services/auth.services');


const createShortUrl = async(req, res) => {

    try {
        let domain = !req.body.customdomain ? null : req.body.customdomain;
        const userID = getUserIdFromToken(req.headers.token);


        const url = await urlSchema.create({ full: req.body.fullUrl, domain: domain, userID: userID });
        if (url) {

            res.status(200).json({ message: "url shortened successfully", url: url });
        } else {

            res.status(401).json({ message: "something went wrong" })
        }

    } catch (error) {

        const errors = handleErrors(error);
        return res.status(400).json({ errors });
    }

}

const createCustomShortUrl = async(req, res) => {
    try {

        let domain = req.body.customdomain;
        let full = req.body.fullUrl;
        console.log(req.body)

        if (!domain == null && !domain === undefined && !full == null && !full === undefined) {

            res.status(401).json({ message: "please provide valid input" })

        } else {
            const userID = getUserIdFromToken(req.headers.token);

            const domainCheck = await urlSchema.find({ domain: domain });

            if (Object.keys(domainCheck).length === 0) {
                const url = await urlSchema.create({ full: req.body.fullUrl, domain: domain, userID: userID });
                if (url) { res.status(200).json({ message: "url shortened successfully", url: url }) } else { res.status(401).json({ message: "Something went wrong" }) }

            } else {
                const shortUrls = await getCustomUrls(userID)
                res.status(401).json({ message: "Custom keyword already in use" })
            }

        }


    } catch (error) {

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