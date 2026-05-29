// const buildModel = require('./crud.model');

// const commentaireModel = buildModel('commentaires', [
//     'commentaire',
//     'date_commentaire',
//     'actualite_id',
//     'patient_id'
// ]);

// const create = (data) => {
//     return commentaireModel.create({
//         ...data,
//         date_commentaire: data.date_commentaire || new Date()
//     });
// };

// // Ajouter une route GET /commentaires?actualite_id=X&withPatient=true
// const getCommentairesWithPatients = async (req, res) => {
//   const { actualite_id, withPatient } = req.query;
  
//   let query = `
//     SELECT c.*, 
//            p.nom as patient_nom, 
//            p.prenoms as patient_prenoms 
//     FROM commentaires c
//     LEFT JOIN patients p ON c.patient_id = p.id
//     WHERE c.actualite_id = ?
//     ORDER BY c.date_commentaire DESC
//   `;
  
//   const [rows] = await db.query(query, [actualite_id]);
//   res.json({ data: rows });
// };

// // Route pour compter les commentaires
// const countCommentaires = async (req, res) => {
//   const { actualite_id } = req.query;
//   const [rows] = await db.query(
//     'SELECT COUNT(*) as count FROM commentaires WHERE actualite_id = ?',
//     [actualite_id]
//   );
//   res.json({ count: rows[0].count });
// };

// module.exports = {
//     ...commentaireModel,
//     create
// };

const { db } = require('../config/connectDatabase');

const buildModel = require('./crud.model');

const commentaireModel = buildModel('commentaires', [
    'commentaire',
    'date_commentaire',
    'actualite_id',
    'patient_id'
]);

const create = (data) => {
    return commentaireModel.create({
        ...data,
        date_commentaire: data.date_commentaire || new Date()
    });
};

// Ajouter une route GET /commentaires?actualite_id=X&withPatient=true
const getCommentairesWithPatients = async (req, res) => {
    try {
        const { actualite_id } = req.query;
        
        let query = `
            SELECT c.*, 
                   p.nom as patient_nom, 
                   p.prenoms as patient_prenoms 
            FROM commentaires c
            LEFT JOIN patients p ON c.patient_id = p.id
            WHERE c.actualite_id = ?
            ORDER BY c.date_commentaire DESC
        `;
        
        const [rows] = await db.query(query, [actualite_id]);
        res.json({ data: rows });
    } catch (error) {
        console.error('Erreur getCommentairesWithPatients:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des commentaires' });
    }
};

// Route pour compter les commentaires
const countCommentaires = async (req, res) => {
    try {
        const { actualite_id } = req.query;
        const [rows] = await db.query(
            'SELECT COUNT(*) as count FROM commentaires WHERE actualite_id = ?',
            [actualite_id]
        );
        res.json({ count: rows[0].count });
    } catch (error) {
        console.error('Erreur countCommentaires:', error);
        res.status(500).json({ message: 'Erreur lors du comptage des commentaires' });
    }
};

module.exports = {
    ...commentaireModel,
    create,
    getCommentairesWithPatients,
    countCommentaires
};
