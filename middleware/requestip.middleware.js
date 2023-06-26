const requestIp = require('request-ip');

const ipMiddleware = async function(req, res, next) {
    const clientIp = requestIp.getClientIp(req);
    req.clientIp = clientIp
    next();
};



module.exports = { ipMiddleware }