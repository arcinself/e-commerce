const jwt = require('jsonwebtoken');
require('dotenv').config();


const checkToken = (req, res, next) => {
    try {
        const bearerHeader = req.headers.authorization;
        if (typeof bearerHeader === "undefined") {
            throw new Error('Invalid token.')
        } else {
            let bearerToken = bearerHeader.split(' ')[1];
            jwt.verify(bearerToken, process.env.mySalt, (err, user) => {
                if (err) {
                    throw new Error('Invalid access token.')
                } else {
                    req.user = user;
                    next();
                }
            });
        }
    } catch (err) {
        return res.json({
            data: null,
            err: {
                message: err.message
            }
        });
    }
}


module.exports = {
    checkToken
};