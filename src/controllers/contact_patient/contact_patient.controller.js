const buildController = require('../crud.controller');
const contactPatientModel = require('../../models/contact_patient.models');

// Personnalisation pour ajouter une réponse sans authentification
const controller = buildController(contactPatientModel, 'contact_patient');

// Créer une version publique (sans auth)
const createPublic = async (req, res) => {
    try {
        const data = {
            Nom: req.body.firstName,      // correspond au champ firstName du formulaire
            Prenom: req.body.lastName,     // correspond au champ lastName du formulaire
            Telephone: req.body.phone,
            Email: req.body.email,
            Message: req.body.message || null
        };

        const result = await contactPatientModel.create(data);
        res.status(201).json({ 
            success: true, 
            message: 'Demande envoyée avec succès',
            data: result 
        });
    } catch (error) {
        console.error('Erreur insertion contact patient:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erreur lors de l\'envoi de la demande' 
        });
    }
};

module.exports = {
    ...controller,
    createPublic  // Exporter la version publique
};