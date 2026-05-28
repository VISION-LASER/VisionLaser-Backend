const { db } = require('../../config/connectDatabase');
const bcrypt = require('bcryptjs');
const { generateAccessToken, generateRefreshToken } = require('../../middleware/auth.middleware');

const login = async (req, res) => {
    const { email, password, role } = req.body;

    if (!['admin', 'patient'].includes(role)) {
        return res.status(400).json({ message: "Rôle invalide. Utilisez 'admin' ou 'patient'" });
    }

    const table = role === 'admin' ? 'admins' : 'patients';
    
    try {
        const [users] = await db.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect" });
        }

        const tokenUser = { id: user.id, email: user.email, role };
        const accessToken = generateAccessToken(tokenUser);
        const refreshToken = generateRefreshToken(tokenUser);

        res.json({
            message: "Connexion réussie",
            accessToken,
            refreshToken,
            user: { 
                id: user.id, 
                nom: user.nom, 
                prenoms: user.prenoms, 
                email: user.email, 
                role 
            }
        });

    } catch (error) {
        console.error('Erreur connexion:', error);
        res.status(500).json({ message: "Erreur lors de la connexion" });
    }
};

module.exports = login;
