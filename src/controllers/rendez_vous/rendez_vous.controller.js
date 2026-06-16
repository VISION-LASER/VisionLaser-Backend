// const rendezVousModel = require('../../models/rendez_vous.models');
// const { sendAppointmentEmails } = require('../../services/SendEmail');
// const { db } = require('../../config/connectDatabase');

// // Créer une version publique (sans auth)
// const createPublic = async (req, res) => {
//     try {
//         console.log('Données reçues rendez-vous:', req.body);

//         const data = {
//             Nom: req.body.lastName,
//             Prenom: req.body.firstName,
//             Email: req.body.email,
//             Telephone: req.body.phone,
//             Date_naissance: req.body.birthDate || null,
//             Motif_consultation: req.body.motif,
//             info_supplementaire: req.body.notes || null,
//             date_creneau: req.body.date,
//             heure_creneau: req.body.time
//         };

//         console.log('Données formatées:', data);

//         // 1. Enregistrer dans la base de données
//         const result = await rendezVousModel.create(data);

//         // 2. Envoyer les emails (admin + utilisateur)
//         const appointmentData = {
//             patient: {
//                 firstName: req.body.firstName,
//                 lastName: req.body.lastName,
//                 email: req.body.email,
//                 phone: req.body.phone,
//                 birthDate: req.body.birthDate,
//                 motif: req.body.motif,
//                 notes: req.body.notes || '',
//             },
//             date: req.body.date,
//             time: req.body.time,
//         };

//         // Envoi des emails (ne pas bloquer la réponse si erreur email)
//         try {
//             await sendAppointmentEmails(appointmentData);
//         } catch (emailError) {
//             console.error('Erreur envoi email:', emailError);
//         }

//         res.status(201).json({
//             success: true,
//             message: 'Rendez-vous confirmé avec succès',
//             data: result
//         });
//     } catch (error) {
//         console.error('Erreur insertion rendez-vous:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la confirmation du rendez-vous',
//             error: error.message
//         });
//     }
// };

// const getTakenSlots = async (req, res) => {
//     try {
//         const { date } = req.query;
        
//         // Utiliser DATE_FORMAT pour forcer le format YYYY-MM-DD sans timezone
//         let query = `
//             SELECT 
//                 DATE_FORMAT(date_creneau, '%Y-%m-%d') as date_creneau, 
//                 heure_creneau 
//             FROM rendez_vous
//         `;
//         let params = [];
        
//         if (date) {
//             query += ' WHERE DATE_FORMAT(date_creneau, "%Y-%m-%d") = ?';
//             params.push(date);
//         }
        
//         console.log('SQL Query:', query, params);
        
//         const [rows] = await db.query(query, params);
        
//         console.log('Rows from DB:', rows);
        
//         // Transformer les données
//         const takenSlots = {};
//         rows.forEach(row => {
//             const dateKey = row.date_creneau;
//             if (!takenSlots[dateKey]) {
//                 takenSlots[dateKey] = [];
//             }
//             takenSlots[dateKey].push(row.heure_creneau);
//         });
        
//         console.log('Taken slots formatés:', takenSlots);
        
//         res.status(200).json({
//             success: true,
//             data: takenSlots
//         });
//     } catch (error) {
//         console.error('Erreur récupération créneaux pris:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la récupération des créneaux',
//             error: error.message
//         });
//     }
// };

// module.exports = {
//     createPublic,
//     getTakenSlots
// };

const rendezVousModel = require('../../models/rendez_vous.models');
const { sendAppointmentEmails } = require('../../services/SendEmail');
const { db } = require('../../config/connectDatabase');

// Récupérer tous les rendez-vous (AJOUT)
const getAll = async (req, res) => {
    try {
        const rendezVous = await rendezVousModel.findAll();
        res.status(200).json({ success: true, data: rendezVous });
    } catch (error) {
        console.error('Erreur getAll rendez-vous:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Récupérer un rendez-vous par ID (AJOUT)
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const rendezVous = await rendezVousModel.findById(id);
        if (!rendezVous) {
            return res.status(404).json({ success: false, message: 'Rendez-vous non trouvé' });
        }
        res.status(200).json({ success: true, data: rendezVous });
    } catch (error) {
        console.error('Erreur getById rendez-vous:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mettre à jour un rendez-vous (AJOUT)
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        
        const existingRendezVous = await rendezVousModel.findById(id);
        if (!existingRendezVous) {
            return res.status(404).json({ success: false, message: 'Rendez-vous non trouvé' });
        }
        
        const updatedRendezVous = await rendezVousModel.update(id, data);
        res.status(200).json({ success: true, data: updatedRendezVous });
    } catch (error) {
        console.error('Erreur update rendez-vous:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Supprimer un rendez-vous (AJOUT)
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await rendezVousModel.remove(id);
        
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Rendez-vous non trouvé' });
        }
        
        res.status(200).json({ success: true, message: 'Rendez-vous supprimé avec succès' });
    } catch (error) {
        console.error('Erreur remove rendez-vous:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Créer une version publique (sans auth)
const createPublic = async (req, res) => {
    try {
        console.log('Données reçues rendez-vous:', req.body);

        const data = {
            Nom: req.body.lastName,
            Prenom: req.body.firstName,
            Email: req.body.email,
            Telephone: req.body.phone,
            Date_naissance: req.body.birthDate || null,
            Motif_consultation: req.body.motif,
            info_supplementaire: req.body.notes || null,
            date_creneau: req.body.date,
            heure_creneau: req.body.time
        };

        console.log('Données formatées:', data);

        // 1. Enregistrer dans la base de données
        const result = await rendezVousModel.create(data);

        // 2. Envoyer les emails (admin + utilisateur)
        const appointmentData = {
            patient: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                birthDate: req.body.birthDate,
                motif: req.body.motif,
                notes: req.body.notes || '',
            },
            date: req.body.date,
            time: req.body.time,
        };

        // Envoi des emails (ne pas bloquer la réponse si erreur email)
        try {
            await sendAppointmentEmails(appointmentData);
        } catch (emailError) {
            console.error('Erreur envoi email:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Rendez-vous confirmé avec succès',
            data: result
        });
    } catch (error) {
        console.error('Erreur insertion rendez-vous:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la confirmation du rendez-vous',
            error: error.message
        });
    }
};

const getTakenSlots = async (req, res) => {
    try {
        const { date } = req.query;
        
        // Utiliser DATE_FORMAT pour forcer le format YYYY-MM-DD sans timezone
        let query = `
            SELECT 
                DATE_FORMAT(date_creneau, '%Y-%m-%d') as date_creneau, 
                heure_creneau 
            FROM rendez_vous
        `;
        let params = [];
        
        if (date) {
            query += ' WHERE DATE_FORMAT(date_creneau, "%Y-%m-%d") = ?';
            params.push(date);
        }
        
        console.log('SQL Query:', query, params);
        
        const [rows] = await db.query(query, params);
        
        console.log('Rows from DB:', rows);
        
        // Transformer les données
        const takenSlots = {};
        rows.forEach(row => {
            const dateKey = row.date_creneau;
            if (!takenSlots[dateKey]) {
                takenSlots[dateKey] = [];
            }
            takenSlots[dateKey].push(row.heure_creneau);
        });
        
        console.log('Taken slots formatés:', takenSlots);
        
        res.status(200).json({
            success: true,
            data: takenSlots
        });
    } catch (error) {
        console.error('Erreur récupération créneaux pris:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des créneaux',
            error: error.message
        });
    }
};

// Mettre à jour le statut d'un rendez-vous avec envoi d'email
const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Vérifier que le statut est valide
        const validStatus = ['pending', 'confirmed', 'refused', 'cancelled'];
        if (!validStatus.includes(status)) {
            return res.status(400).json({ success: false, message: 'Statut invalide' });
        }
        
        // Récupérer le rendez-vous avant mise à jour
        const rendezVous = await rendezVousModel.findById(id);
        if (!rendezVous) {
            return res.status(404).json({ success: false, message: 'Rendez-vous non trouvé' });
        }
        
        // Mettre à jour le statut
        const [result] = await db.query(
            'UPDATE rendez_vous SET status = ?, updated_at = NOW() WHERE id = ?',
            [status, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Rendez-vous non trouvé' });
        }
        
        // Récupérer le rendez-vous mis à jour
        const updatedRendezVous = await rendezVousModel.findById(id);
        
        // Envoyer un email au patient selon le statut
        try {
            const { sendStatusUpdateEmail } = require('../../services/SendEmail');
            const appointmentData = {
                patient: {
                    firstName: rendezVous.Prenom,
                    lastName: rendezVous.Nom,
                    email: rendezVous.Email,
                    phone: rendezVous.Telephone,
                    motif: rendezVous.Motif_consultation,
                },
                date: rendezVous.date_creneau,
                time: rendezVous.heure_creneau,
                status: status
            };
            await sendStatusUpdateEmail(appointmentData);
        } catch (emailError) {
            console.error('Erreur envoi email de statut:', emailError);
            // Ne pas bloquer la réponse si l'email échoue
        }
        
        res.status(200).json({ 
            success: true, 
            message: 'Statut mis à jour avec succès',
            data: updatedRendezVous 
        });
    } catch (error) {
        console.error('Erreur updateStatus:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAll,
    getById,
    createPublic,
    update,
    remove,
    getTakenSlots,
    updateStatus,
};