const buildController = require('../crud.controller');
const equipementModel = require('../../models/equipement.models');

module.exports = buildController(equipementModel, 'equipement');
