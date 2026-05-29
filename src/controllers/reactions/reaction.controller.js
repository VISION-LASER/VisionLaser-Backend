// const buildController = require('../crud.controller');
// const reactionModel = require('../../models/reaction.models');

// module.exports = buildController(reactionModel, 'reaction');

// module.exports = {
//     getAll: reactionModel.findAll ? reactionModel.findAll.bind(reactionModel) : null,
//     getById: reactionModel.findById ? reactionModel.findById.bind(reactionModel) : null,
//     create: reactionModel.create ? reactionModel.create.bind(reactionModel) : null,
//     update: reactionModel.update ? reactionModel.update.bind(reactionModel) : null,
//     remove: reactionModel.remove ? reactionModel.remove.bind(reactionModel) : null,
//     getReactionsWithPatients: reactionModel.getReactionsWithPatients || null,
//     countReactions: reactionModel.countReactions || null
// };

const buildController = require('../crud.controller');
const reactionModel = require('../../models/reaction.models');

// Récupérer le contrôleur de base du CRUD
const baseController = buildController(reactionModel, 'reaction');

// Exporter en ajoutant les fonctions spécifiques
module.exports = {
    // Fonctions CRUD de base
    getAll: baseController.getAll,
    getById: baseController.getById,
    create: baseController.create,
    update: baseController.update,
    remove: baseController.remove,
    
    // Fonctions spécifiques pour les réactions
    getReactionsWithPatients: reactionModel.getReactionsWithPatients || null,
    countReactions: reactionModel.countReactions || null
};
