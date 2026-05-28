const buildController = require('../crud.controller');
const bilanModel = require('../../models/bilan.models');

module.exports = buildController(bilanModel, 'bilan');
