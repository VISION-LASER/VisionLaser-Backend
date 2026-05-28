const { db } = require('../../config/connectDatabase');

const getProfile = async (req, res) => {
    const { id, role } = req.user;
    const table = role === 'admin' ? 'admins' : 'patients';
    
    try {
        const [users] = await db.query(
            `SELECT id, nom, prenoms, email, created_at FROM ${table} WHERE id = ?`,
            [id]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        
        res.json({ user: users[0] });
    } catch (error) {
        console.error('Erreur profil:', error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = getProfile;