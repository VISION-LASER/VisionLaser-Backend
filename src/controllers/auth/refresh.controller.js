const jwt = require('jsonwebtoken');
const { generateAccessToken } = require('../../middleware/auth.middleware');

const refresh = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token manquant" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const newAccessToken = generateAccessToken({ 
            id: decoded.id, 
            email: decoded.email, 
            role: decoded.role 
        });
        
        res.json({ 
            accessToken: newAccessToken,
            message: "Nouveau token généré avec succès"
        });
    } catch (error) {
        res.status(403).json({ message: "Refresh token invalide ou expiré" });
    }
};

module.exports = refresh;