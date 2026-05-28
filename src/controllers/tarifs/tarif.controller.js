const buildController = require('../crud.controller');
const tarifModel = require('../../models/tarif.models');

module.exports = buildController(tarifModel, 'tarif');
