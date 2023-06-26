const router = require('express').Router();
const authController = require('../../controllers/auth.controllers')

router.post('/signup', authController.signup);

router.all('/logout', (req, res) => {

    req.session.destroy()
    res.clearCookie('connect.sid') // clean up!
    res.redirect('/')

})


router.post('/login', authController.login);

module.exports = router;