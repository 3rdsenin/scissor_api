const express = require('express');
const v1 = require('./routes/v1');
const v2 = require('./routes/v2');

const session = require('express-session');
require('dotenv').config();
const rateLimit = require("express-rate-limit");


const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.jwt_secret,
    cookie: {
        sameSite: 'none'
    }
}));

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 50,


})

app.use(limiter)
app.use('/scissor/api/v1', v1);
app.use('/scissor/api/v2', v2);










module.exports = app;