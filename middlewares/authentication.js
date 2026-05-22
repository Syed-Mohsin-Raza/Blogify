// create a middleware function that user can logged in or not
const { verifyToken } = require('../services/authentication');

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
            return next();
        }

        try {
            const decoded = verifyToken(tokenCookieValue);
            req.user = decoded;
            next();
        } catch (error) {
            console.error("Authentication error:", error);
            next();
        }
    };
}


module.exports = checkForAuthenticationCookie;






