const buildModel = require('./crud.model');

module.exports = buildModel('bilans', [
    'nom',
    'email',
    'telephone',
    'date_demande',
    'statut',
    'patient_id'
]);
