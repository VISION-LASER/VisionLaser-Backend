const buildModel = require('./crud.model');

module.exports = buildModel('contact_patient', [
    'Nom',
    'Prenom',
    'Telephone',
    'Email',
    'Message'
]);