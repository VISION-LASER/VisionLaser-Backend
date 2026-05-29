const buildController = require('../crud.controller');
const commentaireModel = require('../../models/commentaire.models');

module.exports = buildController(commentaireModel, 'commentaire');

module.exports = {
    getAll: commentaireModel.findAll ? commentaireModel.findAll.bind(commentaireModel) : null,
    getById: commentaireModel.findById ? commentaireModel.findById.bind(commentaireModel) : null,
    create: commentaireModel.create ? commentaireModel.create.bind(commentaireModel) : null,
    update: commentaireModel.update ? commentaireModel.update.bind(commentaireModel) : null,
    remove: commentaireModel.remove ? commentaireModel.remove.bind(commentaireModel) : null,
    getCommentairesWithPatients: commentaireModel.getCommentairesWithPatients || null,
    countCommentaires: commentaireModel.countCommentaires || null
};