const faqModel = require('../../models/faq.models');

const parseAnswers = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;

    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
        return [value];
    }
};

const normalizeAnswersForDb = (value) => {
    const answers = parseAnswers(value)
        .map((answer) => String(answer).trim())
        .filter(Boolean);

    return JSON.stringify(answers);
};

const formatFaq = (faq) => {
    if (!faq) return faq;

    return {
        ...faq,
        reponse_faq: parseAnswers(faq.reponse_faq)
    };
};

const getAll = async (req, res) => {
    try {
        const data = await faqModel.findAll();
        res.json({ data: data.map(formatFaq) });
    } catch (error) {
        console.error('Erreur liste faq:', error);
        res.status(500).json({ message: 'Erreur lors de la recuperation des faq' });
    }
};

const getById = async (req, res) => {
    try {
        const data = await faqModel.findById(req.params.id);

        if (!data) {
            return res.status(404).json({ message: 'faq introuvable' });
        }

        res.json({ data: formatFaq(data) });
    } catch (error) {
        console.error('Erreur detail faq:', error);
        res.status(500).json({ message: 'Erreur lors de la recuperation du faq' });
    }
};

const create = async (req, res) => {
    try {
        const { question, reponse_faq, admin_id } = req.body;

        if (!question || !String(question).trim()) {
            return res.status(400).json({ message: 'La question est requise' });
        }

        const answersForDb = normalizeAnswersForDb(reponse_faq);
        if (parseAnswers(answersForDb).length === 0) {
            return res.status(400).json({ message: 'Au moins une reponse est requise' });
        }

        const data = await faqModel.create({
            question: String(question).trim(),
            reponse_faq: answersForDb,
            admin_id: admin_id ?? req.user?.id
        });

        res.status(201).json({
            message: 'faq cree avec succes',
            data: formatFaq(data)
        });
    } catch (error) {
        console.error('Erreur creation faq:', error);
        res.status(500).json({
            message: 'Erreur lors de la creation du faq',
            error: error.message
        });
    }
};

const update = async (req, res) => {
    try {
        const existing = await faqModel.findById(req.params.id);

        if (!existing) {
            return res.status(404).json({ message: 'faq introuvable' });
        }

        const dataToUpdate = {};

        if (req.body.question !== undefined) {
            if (!String(req.body.question).trim()) {
                return res.status(400).json({ message: 'La question est requise' });
            }

            dataToUpdate.question = String(req.body.question).trim();
        }

        if (req.body.reponse_faq !== undefined) {
            const answersForDb = normalizeAnswersForDb(req.body.reponse_faq);
            if (parseAnswers(answersForDb).length === 0) {
                return res.status(400).json({ message: 'Au moins une reponse est requise' });
            }

            dataToUpdate.reponse_faq = answersForDb;
        }

        if (req.body.admin_id !== undefined) {
            dataToUpdate.admin_id = req.body.admin_id;
        }

        const data = await faqModel.update(req.params.id, dataToUpdate);

        res.json({
            message: 'faq modifie avec succes',
            data: formatFaq(data)
        });
    } catch (error) {
        console.error('Erreur modification faq:', error);
        res.status(500).json({
            message: 'Erreur lors de la modification du faq',
            error: error.message
        });
    }
};

const remove = async (req, res) => {
    try {
        const deleted = await faqModel.remove(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'faq introuvable' });
        }

        res.json({ message: 'faq supprime avec succes' });
    } catch (error) {
        console.error('Erreur suppression faq:', error);
        res.status(500).json({
            message: 'Erreur lors de la suppression du faq',
            error: error.message
        });
    }
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
