const buildModel = require('./crud.model');

module.exports = buildModel('equipements', [
    'nom',
    'desc_equipement',
    'image_equipement',
    'admin_id'
]);
