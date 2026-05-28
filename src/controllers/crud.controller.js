const buildController = (model, resourceName) => {
    const getAll = async (req, res) => {
        try {
            const data = await model.findAll();
            res.json({ data });
        } catch (error) {
            console.error(`Erreur liste ${resourceName}:`, error);
            res.status(500).json({ message: `Erreur lors de la recuperation des ${resourceName}` });
        }
    };

    const getById = async (req, res) => {
        try {
            const data = await model.findById(req.params.id);

            if (!data) {
                return res.status(404).json({ message: `${resourceName} introuvable` });
            }

            res.json({ data });
        } catch (error) {
            console.error(`Erreur detail ${resourceName}:`, error);
            res.status(500).json({ message: `Erreur lors de la recuperation du ${resourceName}` });
        }
    };

    const create = async (req, res) => {
        try {
            const data = await model.create(req.body);
            res.status(201).json({
                message: `${resourceName} cree avec succes`,
                data
            });
        } catch (error) {
            console.error(`Erreur creation ${resourceName}:`, error);
            res.status(500).json({
                message: `Erreur lors de la creation du ${resourceName}`,
                error: error.message
            });
        }
    };

    const update = async (req, res) => {
        try {
            const existing = await model.findById(req.params.id);

            if (!existing) {
                return res.status(404).json({ message: `${resourceName} introuvable` });
            }

            const data = await model.update(req.params.id, req.body);
            res.json({
                message: `${resourceName} modifie avec succes`,
                data
            });
        } catch (error) {
            console.error(`Erreur modification ${resourceName}:`, error);
            res.status(500).json({
                message: `Erreur lors de la modification du ${resourceName}`,
                error: error.message
            });
        }
    };

    const remove = async (req, res) => {
        try {
            const deleted = await model.remove(req.params.id);

            if (!deleted) {
                return res.status(404).json({ message: `${resourceName} introuvable` });
            }

            res.json({ message: `${resourceName} supprime avec succes` });
        } catch (error) {
            console.error(`Erreur suppression ${resourceName}:`, error);
            res.status(500).json({
                message: `Erreur lors de la suppression du ${resourceName}`,
                error: error.message
            });
        }
    };

    return {
        getAll,
        getById,
        create,
        update,
        remove
    };
};

module.exports = buildController;
