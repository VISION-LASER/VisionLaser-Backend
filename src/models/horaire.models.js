const buildModel = require('./crud.model');

module.exports = buildModel('horaires', [
    'jour',
    'ouverture',
    'fermeture',
    'ferme',
    'admin_id'
]);
