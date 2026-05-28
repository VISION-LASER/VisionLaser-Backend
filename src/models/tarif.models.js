const buildModel = require('./crud.model');

module.exports = buildModel('tarifs', [
    'technique',
    'prix',
    'note',
    'admin_id'
]);
