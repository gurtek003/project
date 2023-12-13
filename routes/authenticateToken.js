const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const token = req.cookies ? req.cookies.token || '' : '';

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.redirect('/login'); // Redirect to login if token is invalid or not present
        }
        
        req.user = decoded;
        next();
    });
}

module.exports = authenticateToken;
