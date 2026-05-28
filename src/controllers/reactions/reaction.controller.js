const buildController = require('../crud.controller');
const reactionModel = require('../../models/reaction.models');

module.exports = buildController(reactionModel, 'reaction');
