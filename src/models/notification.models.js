const buildModel = require('./crud.model');

module.exports = buildModel('notifications', [
    'statut',
    'nom_patient',
    'email_patient',
    'telephone',
    'date_demande',
    'message',
    'patient_id'
]);
