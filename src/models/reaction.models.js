const { db } = require('../config/connectDatabase');

const reactionModel = {
    // Récupérer toutes les réactions
    findAll: async () => {
        const [rows] = await db.query(`
            SELECT r.*, 
                   p.nom as patient_nom, 
                   p.prenoms as patient_prenoms 
            FROM reactions r
            LEFT JOIN patients p ON r.patient_id = p.id
            ORDER BY r.date_reaction DESC
        `);
        return rows;
    },

    // Récupérer une réaction par ID
    findById: async (id) => {
        const [rows] = await db.query(`
            SELECT r.*, 
                   p.nom as patient_nom, 
                   p.prenoms as patient_prenoms 
            FROM reactions r
            LEFT JOIN patients p ON r.patient_id = p.id
            WHERE r.id = ?
        `, [id]);
        return rows[0];
    },

    // Créer une réaction
    create: async (data) => {
        console.log('Données reçues dans create reaction:', data);
        
        const { type_reaction, actualite_id, patient_id, date_reaction } = data;
        
        // Validation
        if (!actualite_id) {
            throw new Error('actualite_id est requis');
        }
        if (!patient_id) {
            throw new Error('patient_id est requis');
        }
        
        const [result] = await db.query(
            `INSERT INTO reactions (type_reaction, actualite_id, patient_id, date_reaction) 
             VALUES (?, ?, ?, ?)`,
            [type_reaction || 'like', actualite_id, patient_id, date_reaction || new Date()]
        );
        
        return reactionModel.findById(result.insertId);
    },

    // Mettre à jour une réaction
    update: async (id, data) => {
        const { type_reaction } = data;
        await db.query(
            `UPDATE reactions SET type_reaction = ?, updated_at = NOW() WHERE id = ?`,
            [type_reaction, id]
        );
        return reactionModel.findById(id);
    },

    // Supprimer une réaction
    remove: async (id) => {
        const [result] = await db.query(`DELETE FROM reactions WHERE id = ?`, [id]);
        return result.affectedRows > 0;
    },

    // Récupérer les réactions d'une actualité avec infos patient
    getReactionsWithPatients: async (req, res) => {
        try {
            const { actualite_id } = req.query;
            
            if (!actualite_id) {
                return res.status(400).json({ message: 'actualite_id est requis' });
            }
            
            const query = `
                SELECT r.*, 
                       p.nom as patient_nom, 
                       p.prenoms as patient_prenoms 
                FROM reactions r
                LEFT JOIN patients p ON r.patient_id = p.id
                WHERE r.actualite_id = ?
                ORDER BY r.date_reaction DESC
            `;
            
            const [rows] = await db.query(query, [actualite_id]);
            res.json({ data: rows });
        } catch (error) {
            console.error('Erreur getReactionsWithPatients:', error);
            res.status(500).json({ message: error.message });
        }
    },

    // Compter les réactions
    countReactions: async (req, res) => {
        try {
            const { actualite_id } = req.query;
            
            if (!actualite_id) {
                return res.status(400).json({ message: 'actualite_id est requis' });
            }
            
            const [rows] = await db.query(
                'SELECT COUNT(*) as count FROM reactions WHERE actualite_id = ?',
                [actualite_id]
            );
            res.json({ count: rows[0].count });
        } catch (error) {
            console.error('Erreur countReactions:', error);
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = reactionModel;
