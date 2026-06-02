const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware pour vérifier le token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Accès non autorisé - Token manquant" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token invalide ou expiré" });
    }
};

// Générer access token (expire dans 2 jours)
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '2d' }  // ← 2 jours
    );
};

// Générer refresh token (expire dans 7 jours)
const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
};

module.exports = {
    authenticateToken,
    generateAccessToken,
    generateRefreshToken
};