const buildModel = require('./crud.model');

module.exports = buildModel('rendez_vous', [
    'Nom',
    'Prenom',
    'Email',
    'Telephone',
    'Date_naissance',
    'Motif_consultation',
    'info_supplementaire',
    'date_creneau',
    'heure_creneau',
    'status'
]);