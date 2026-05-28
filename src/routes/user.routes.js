// // User routes
// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/user.controllers');

/**Nouveau route */

const express = require('express');
const router = express.Router();

// IMPORTS CORRIGES - maintenant on va chercher les fichiers dans le dossier auth
const register = require('../controllers/auth/register.controller');
const login = require('../controllers/auth/login.controller');
const refresh = require('../controllers/auth/refresh.controller');
const getProfile = require('../controllers/auth/profile.controller');

const actualiteController = require('../controllers/actualites/actualite.controller');
const bilanController = require('../controllers/bilans/bilan.controller');
const commentaireController = require('../controllers/commentaires/commentaire.controller');
const equipementController = require('../controllers/equipements/equipement.controller');
const faqController = require('../controllers/faq/faq.controller');
const horaireController = require('../controllers/horaires/horaire.controller');
const notificationController = require('../controllers/notifications/notification.controller');
const reactionController = require('../controllers/reactions/reaction.controller');
const tarifController = require('../controllers/tarifs/tarif.controller');

const { authenticateToken } = require('../middleware/auth.middleware');

const addCrudRoutes = (path, controller) => {
    router.get(path, controller.getAll);
    router.get(`${path}/:id`, controller.getById);
    router.post(path, controller.create);
    router.put(`${path}/:id`, controller.update);
    router.delete(`${path}/:id`, controller.remove);
};

// Routes publiques
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);

// Routes protegees
router.get('/profile', authenticateToken, getProfile);

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

module.exports = router;
