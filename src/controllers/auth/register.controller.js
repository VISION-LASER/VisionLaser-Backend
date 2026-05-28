const { db } = require('../../config/connectDatabase');
const bcrypt = require('bcryptjs');
const { generateAccessToken, generateRefreshToken } = require('../../middleware/auth.middleware');

const register = async (req, res) => {
    const { role, nom, prenoms, email, password, confirm_password, telephone } = req.body;

    // Vérifier que les mots de passe correspondent
    if (password !== confirm_password) {
        return res.status(400).json({ message: "Les mots de passe ne correspondent pas" });
    }

    // Vérifier le rôle
    if (!['admin', 'patient'].includes(role)) {
        return res.status(400).json({ message: "Rôle invalide. Utilisez 'admin' ou 'patient'" });
    }

    const table = role === 'admin' ? 'admins' : 'patients';
    
    try {
        // Vérifier si l'email existe déjà
        const [existing] = await db.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);
        
        if (existing.length > 0) {
            return res.status(400).json({ message: "Cet email est déjà utilisé" });
        }

        // Crypter les mots de passe
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedConfirmPassword = await bcrypt.hash(confirm_password, 10);

        let result;
        if (role === 'admin') {
            [result] = await db.query(
                `INSERT INTO admins (nom, prenoms, email, password, confirm_password) 
                 VALUES (?, ?, ?, ?, ?)`,
                [nom, prenoms, email, hashedPassword, hashedConfirmPassword]
            );
        } else {
            [result] = await db.query(
                `INSERT INTO patients (nom, prenoms, email, password, confirm_password, telephone) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [nom, prenoms, email, hashedPassword, hashedConfirmPassword, telephone]
            );
        }

        // Créer les tokens
        const user = { id: result.insertId, email, role };
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.status(201).json({
            message: "Inscription réussie",
            accessToken,
            refreshToken,
            user: { id: user.id, nom, prenoms, email, role }
        });

    } catch (error) {
        console.error('Erreur inscription:', error);
        res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
};

module.exports = register;