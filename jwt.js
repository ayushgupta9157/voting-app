const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {

    // Check authorization header
    const authorization = req.headers.authorization;

    console.log("Authorization Header:", authorization);

    if (!authorization) {
        return res.status(401).json({
            error: 'Token Not Found'
        });
    }

    // Extract token
    const token = authorization.split(' ')[1];

    console.log("Extracted Token:", token);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    if (!token) {
        return res.status(401).json({
            error: 'Unauthorized'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded Token:", decoded);

        req.user = decoded;
        next();

    } catch (err) {
        console.log("JWT ERROR:", err.message);

        return res.status(401).json({
            error: 'Invalid token'
        });
    }
};

// Generate JWT
const generateToken = (userData) => {

    return jwt.sign(
        userData,
        process.env.JWT_SECRET,
        {
            expiresIn: 30000
        }
    );
};

module.exports = {
    jwtAuthMiddleware,
    generateToken
};