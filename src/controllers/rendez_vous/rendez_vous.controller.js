const rendezVousModel = require('../../models/rendez_vous.models');
const { sendAppointmentEmails } = require('../../services/SendEmail');
const { db } = require('../../config/connectDatabase');

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

module.exports = {
    createPublic,
    getTakenSlots
};