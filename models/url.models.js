const { config } = require('dotenv');
const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const ObjectId = Schema.ObjectId;
const shortId = require('shortid');
const uuid = require('uuid');
require('dotenv').config();
const { generateQRCode } = require('../utils/functions')


const urlSchema = new Schema({
    id: ObjectId,
    linkId: {
        type: String,
        default: uuid.v4(),
        required: true
    },
    userID: {
        type: String,
        required: [true, 'Please provide userid'],
    },
    full: {
        type: String,
        required: [true, 'Please enter full url'],
    },

    short: {
        type: String,


    },
    shortUrl: {
        type: String,


    },
    qrcode: {
        type: String,

    },
    type: {
        type: String,

    },
    domain: {
        type: String,


    },
    history: [],

    clicks: {
        type: Number,
        required: true,
        default: 0

    }
})

urlSchema.post('save', (doc, next) => {

    next();
});

urlSchema.pre('save', async function(next) {
    const record = this;
    if (record.qrcode == undefined || record.qrcode == null) {
        const shortid = await shortId.generate()

        if (!record.domain == undefined || !record.domain == "" || !record.domain == null) {
            this.domain = record.domain;
            this.type = "custom";
            const shortUrl = process.env.domain + this.domain;
            this.shortUrl = shortUrl;
            this.short = shortid;
            const qrcodedata = await generateQRCode(this.shortUrl);
            this.qrcode = qrcodedata;
            next();

        } else {
            this.domain = shortid;
            this.type = "regular";
            const shortUrl = process.env.domain + shortid;
            this.shortUrl = shortUrl;
            this.short = shortid;

            const qrcodedata = await generateQRCode(this.shortUrl);
            this.qrcode = qrcodedata;
            next();
        }


    } else {
        next();
    }


    next();
})



module.exports = mongoose.model('urlSchema', urlSchema);