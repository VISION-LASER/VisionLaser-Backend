// const buildController = require('../crud.controller');
// const contactPatientModel = require('../../models/contact_patient.models');
// const { db } = require('../../config/connectDatabase');

// const controller = buildController(contactPatientModel, 'contact_patient');

// const createPublic = async (req, res) => {
//     try {
//         const data = {
//             Nom: req.body.Nom || req.body.lastName || req.body.nom,
//             Prenom: req.body.Prenom || req.body.firstName || req.body.prenom,
//             Telephone: req.body.Telephone || req.body.phone || req.body.telephone,
//             Email: req.body.Email || req.body.email,
//             Message: req.body.Message || req.body.message,
//             faq: req.body.faq || null,
//             is_read: req.body.is_read ?? 0
//         };

//         const result = await contactPatientModel.create(data);

//         res.status(201).json({
//             success: true,
//             message: 'Demande de contact envoyee avec succes',
//             data: result
//         });
//     } catch (error) {
//         console.error('Erreur creation contact patient:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de l_envoi de la demande de contact',
//             error: error.message
//         });
//     }
// };

// const getUnreadCount = async (req, res) => {
//     try {
//         const [rows] = await db.query(
//             'SELECT COUNT(*) AS count FROM contact_patient WHERE is_read = 0 OR is_read IS NULL'
//         );

//         res.json({
//             success: true,
//             count: rows[0].count
//         });
//     } catch (error) {
//         console.error('Erreur compteur contact non lus:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la recuperation du compteur',
//             error: error.message
//         });
//     }
// };

// const markAsRead = async (req, res) => {
//     try {
//         const existing = await contactPatientModel.findById(req.params.id);

//         if (!existing) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Contact patient introuvable'
//             });
//         }

//         const data = await contactPatientModel.update(req.params.id, { is_read: 1 });

//         res.json({
//             success: true,
//             message: 'Contact marque comme lu',
//             data
//         });
//     } catch (error) {
//         console.error('Erreur marquer contact comme lu:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la mise a jour du contact',
//             error: error.message
//         });
//     }
// };

// module.exports = {
//     ...controller,
//     createPublic,
//     getUnreadCount,
//     markAsRead
// };

const buildController = require('../crud.controller');
const contactPatientModel = require('../../models/contact_patient.models');
const { db } = require('../../config/connectDatabase');

const controller = buildController(contactPatientModel, 'contact_patient');

const createPublic = async (req, res) => {
    try {
        console.log('📥 Données reçues:', JSON.stringify(req.body, null, 2));
        
        // Transformer les réponses FAQ en JSON string
        let faqData = null;
        if (req.body.faq) {
            if (Array.isArray(req.body.faq)) {
                faqData = JSON.stringify(req.body.faq);
            } else if (typeof req.body.faq === 'object') {
                faqData = JSON.stringify([req.body.faq]);
            } else if (typeof req.body.faq === 'string') {
                try {
                    const parsed = JSON.parse(req.body.faq);
                    faqData = JSON.stringify(parsed);
                } catch {
                    faqData = JSON.stringify([req.body.faq]);
                }
            }
        }
        
        console.log('📦 FAQ après conversion:', faqData);
        
        const data = {
            Nom: req.body.firstName || req.body.Nom,
            Prenom: req.body.lastName || req.body.Prenom,
            Telephone: req.body.phone || req.body.Telephone,
            Email: req.body.email || req.body.Email,
            Message: req.body.message || req.body.Message || null,
            faq: faqData,
            is_read: 0
        };

        console.log('📝 Données à insérer:', data);

        const result = await contactPatientModel.create(data);

        res.status(201).json({
            success: true,
            message: 'Demande de contact envoyée avec succès',
            data: result
        });
    } catch (error) {
        console.error('❌ Erreur création contact patient:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'envoi de la demande de contact',
            error: error.message
        });
    }
};

const getUnreadCount = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT COUNT(*) AS count FROM contact_patient WHERE is_read = 0 OR is_read IS NULL'
        );

        res.json({
            success: true,
            count: rows[0].count
        });
    } catch (error) {
        console.error('Erreur compteur contact non lus:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du compteur',
            error: error.message
        });
    }
};

const markAsRead = async (req, res) => {
    try {
        const existing = await contactPatientModel.findById(req.params.id);

        if (!existing) {
            return res.status(404).json({
                success: false,
                message: 'Contact patient introuvable'
            });
        }

        const data = await contactPatientModel.update(req.params.id, { is_read: 1 });

        res.json({
            success: true,
            message: 'Contact marqué comme lu',
            data
        });
    } catch (error) {
        console.error('Erreur marquer contact comme lu:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du contact',
            error: error.message
        });
    }
};

module.exports = {
    ...controller,
    createPublic,
    getUnreadCount,
    markAsRead
};
