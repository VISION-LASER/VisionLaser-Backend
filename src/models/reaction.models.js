const buildModel = require('./crud.model');

const reactionModel = buildModel('reactions', [
    'type_reaction',
    'date_reaction',
    'actualite_id',
    'patient_id'
]);

const create = (data) => {
    return reactionModel.create({
        ...data,
        date_reaction: data.date_reaction || new Date()
    });
};

module.exports = {
    ...reactionModel,
    create
};
