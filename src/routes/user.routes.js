const express = require('express');
const router = express.Router();

// IMPORTS AUTH
const register = require('../controllers/auth/register.controller');
const login = require('../controllers/auth/login.controller');
const refresh = require('../controllers/auth/refresh.controller');
const getProfile = require('../controllers/auth/profile.controller');

// IMPORTS CONTROLLERS
const actualiteController = require('../controllers/actualites/actualite.controller');
const bilanController = require('../controllers/bilans/bilan.controller');
const commentaireController = require('../controllers/commentaires/commentaire.controller');
const equipementController = require('../controllers/equipements/equipement.controller');
const faqController = require('../controllers/faq/faq.controller');
const horaireController = require('../controllers/horaires/horaire.controller');
const notificationController = require('../controllers/notifications/notification.controller');
const reactionController = require('../controllers/reactions/reaction.controller');
const tarifController = require('../controllers/tarifs/tarif.controller');
const contactPatientController = require('../controllers/contact_patient/contact_patient.controller');
const rendezVousController = require('../controllers/rendez_vous/rendez_vous.controller');

const { authenticateToken } = require('../middleware/auth.middleware');

const addCrudRoutes = (path, controller) => {
    // Vérifier que les fonctions existent avant d'ajouter les routes
    if (controller.getAll) router.get(path, authenticateToken, controller.getAll);
    if (controller.getById) router.get(`${path}/:id`, authenticateToken, controller.getById);
    if (controller.create) router.post(path, authenticateToken, controller.create);
    if (controller.update) router.put(`${path}/:id`, authenticateToken, controller.update);
    if (controller.remove) router.delete(`${path}/:id`, authenticateToken, controller.remove);
};

// Routes publiques (non protégées)
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);

// Routes publiques GET pour les actualités (accessibles sans token)***
router.get('/actualites', actualiteController.getAll);
router.get('/actualites/:id', actualiteController.getById);

// Routes publiques pour les réactions et commentaires (si besoin)***
router.get('/reactions/count', reactionController.countReactions);
router.get('/commentaires/count', commentaireController.countCommentaires);

// lignes pour les demandes de contact et ce qui prend un rendez-vous
router.post('/contact-patient', contactPatientController.createPublic);
router.post('/rendez-vous', rendezVousController.createPublic);
router.get('/rendez-vous/taken-slots', rendezVousController.getTakenSlots);

// Routes protégées
router.get('/profile', authenticateToken, getProfile);

// Routes spécifiques pour les réactions (avec vérification d'existence)
if (reactionController.getReactionsWithPatients) {
    router.get('/reactions', authenticateToken, reactionController.getReactionsWithPatients);
}
if (reactionController.countReactions) {
    router.get('/reactions/count', authenticateToken, reactionController.countReactions);
}

// Routes spécifiques pour les commentaires (avec vérification d'existence)
if (commentaireController.getCommentairesWithPatients) {
    router.get('/commentaires', authenticateToken, commentaireController.getCommentairesWithPatients);
}
if (commentaireController.countCommentaires) {
    router.get('/commentaires/count', authenticateToken, commentaireController.countCommentaires);
}

// Routes CRUD
addCrudRoutes('/actualites', actualiteController);
addCrudRoutes('/bilans', bilanController);
addCrudRoutes('/commentaires', commentaireController);
addCrudRoutes('/equipements', equipementController);
addCrudRoutes('/faq', faqController);
addCrudRoutes('/horaires', horaireController);
addCrudRoutes('/notifications', notificationController);
addCrudRoutes('/reactions', reactionController);
addCrudRoutes('/tarifs', tarifController);
addCrudRoutes('/rendez-vous', rendezVousController);

// Route spécifique pour mettre à jour le statut (AJOUTER CETTE LIGNE)
router.put('/rendez-vous/:id/status', authenticateToken, rendezVousController.updateStatus);

module.exports = router;


