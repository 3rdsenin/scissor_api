const qrCode = require('qrcode');
const jwt = require('jsonwebtoken');



const generateQRCode = async(url) => {
    try {
        const qr = await qrCode.toDataURL(url);
        return qr;
    } catch (err) {
        console.error(err)
    }
}

const isAuthorized = (req, res, next) => {
    if (!req.session.token) {
        res.render('login')
    } else {
        //console.log(req.session.token)
        next();
    }

    // try {
    //     jwt.verify(token, process.env.jwt_secret);

    //     next();
    // } catch (err) {
    //     
    // }
}

const getUserIdFromToken = (token) => {
    const decodedToken = jwt.decode(token);

    const userId = decodedToken.userid;
    return userId;
}

module.exports = { generateQRCode, isAuthorized, getUserIdFromToken, };