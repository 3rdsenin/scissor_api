const router = require('express').Router();
const authrouter = require("./v1/auth.routes");
const urlrouter = require("./v1/url.routes");
const historyrouter = require("./v1/history.routes");
const homerouter = require("./v1/home.routes");
const customrouter = require('./v1/custom.routes');

router.use('/auth', authrouter);
router.use('/url', urlrouter);
router.use('/custom', customrouter);
router.use('/history', historyrouter);
router.use('/', homerouter);


module.exports = router;