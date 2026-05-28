// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();
// const jwt = require("jsonwebtoken");

// async function authenticateToken(req, res, next) {
//   const authHeader = req.headers.authorization;
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ success: false, error: "Token requis" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
//     let user = null;
//     let userType = null;
//     let userRole = null;
//     let id_agence = null; // AJOUTÉ

//     // Vérifier si l'utilisateur est un client
//     if (decoded.type === 'client') {
//       user = await prisma.client.findUnique({
//         where: { id: parseInt(decoded.userId) },
//         select: {
//           id: true,
//           nom_complet: true,
//           email: true,
//           telephone: true,
//           created_at: true,
//           updated_at: true
//         }
//       });
//       userType = 'client';
//       userRole = 'client';
//     } 
//     // Vérifier si l'utilisateur est un user (admin, chauffeur, etc.)
//     else if (decoded.type === 'user') {
//       user = await prisma.users.findUnique({
//         where: { id: parseInt(decoded.userId) },
//         select: {
//           id: true,
//           nom: true,
//           email: true,
//           role: true,
//           id_agence: true, // IMPORTANT: récupérer l'agence
//           created_at: true,
//           updated_at: true
//         }
//       });
//       userType = 'user';
//       userRole = user ? user.role.toLowerCase() : null;
//       id_agence = user ? user.id_agence : null; // RÉCUPÉRER L'AGENCE
//     }

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         error: "Utilisateur introuvable"
//       });
//     }

//     req.user = {
//       ...user,
//       type: userType,
//       role: userRole,
//       id_agence: id_agence // AJOUTÉ
//     };
    
//     next();
//   } catch (error) {
//     console.error("Token verification error:", error);
//     return res.status(403).json({
//       success: false,
//       error: "Token invalide ou expiré"
//     });
//   }
// }

// function requireRole(allowedRoles) {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         error: 'Authentification requise'
//       });
//     }

//     const userRole = req.user.role;
//     const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

//     // Convertir les rôles en minuscules pour la comparaison
//     const normalizedRoles = rolesArray.map(role => role.toLowerCase());
//     const normalizedUserRole = userRole.toLowerCase();

//     // Admin a accès à tout
//     if (normalizedUserRole === 'admin') {
//       return next();
//     }

//     // Vérifier si le rôle de l'utilisateur est autorisé
//     if (normalizedRoles.includes(normalizedUserRole)) {
//       return next();
//     }

//     res.status(403).json({
//       success: false,
//       error: 'Accès non autorisé'
//     });
//   };
// }

// module.exports = { authenticateToken, requireRole };

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

// Générer access token (expire dans 15 minutes)
const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
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