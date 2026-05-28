const buildModel = require('./crud.model');

module.exports = buildModel('faq', [
    'question',
    'reponse_faq',
    'admin_id'
]);
