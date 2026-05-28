const buildModel = require('./crud.model');

module.exports = buildModel('actualites', [
    'titre',
    'description',
    'date_publication',
    'admin_id'
]);
