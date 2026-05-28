const buildController = require('../crud.controller');
const actualiteModel = require('../../models/actualite.models');

module.exports = buildController(actualiteModel, 'actualite');
