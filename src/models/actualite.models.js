const buildModel = require('./crud.model');

module.exports = buildModel('actualites', [
    'titre',
    'description',
    'image_actualite',
    'video_actualite',
    'date_publication',
    'admin_id'
]);
