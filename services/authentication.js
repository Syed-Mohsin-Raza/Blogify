// setup jsonwebtoken  
const jwt = require("jsonwebtoken");

// secret key for signing JWTs
const JWT_SECRET = "$uperMan@51214";
// function to generate a JWT for a user
function generateToken(user) {
    const payload = {
        id: user._id,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
}


module.exports = {
    generateToken,
    verifyToken
};
