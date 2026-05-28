const buildModel = require('./crud.model');

const commentaireModel = buildModel('commentaires', [
    'commentaire',
    'date_commentaire',
    'actualite_id',
    'patient_id'
]);

const create = (data) => {
    return commentaireModel.create({
        ...data,
        date_commentaire: data.date_commentaire || new Date()
    });
};

module.exports = {
    ...commentaireModel,
    create
};
