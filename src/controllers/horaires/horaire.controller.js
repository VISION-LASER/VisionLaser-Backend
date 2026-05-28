const buildController = require('../crud.controller');
const horaireModel = require('../../models/horaire.models');

module.exports = buildController(horaireModel, 'horaire');
