const buildController = require('../crud.controller');
const commentaireModel = require('../../models/commentaire.models');

module.exports = buildController(commentaireModel, 'commentaire');
