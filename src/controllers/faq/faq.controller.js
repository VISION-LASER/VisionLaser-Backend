const buildController = require('../crud.controller');
const faqModel = require('../../models/faq.models');

module.exports = buildController(faqModel, 'faq');
