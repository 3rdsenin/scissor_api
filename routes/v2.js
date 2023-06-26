const router = require('express').Router();

router.all('/', function(req, res) {
    res.json("v2");
})


module.exports = router;