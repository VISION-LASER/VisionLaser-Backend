// const buildController = require('../crud.controller');
// const horaireModel = require('../../models/horaire.models');

// module.exports = buildController(horaireModel, 'horaire');

const horaireModel = require('../../models/horaire.models');

// Récupérer tous les horaires
const getAll = async (req, res) => {
  try {
    const horaires = await horaireModel.findAll();
    res.status(200).json({ success: true, data: horaires });
  } catch (error) {
    console.error('Erreur getAll horaires:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Récupérer un horaire par ID
const getById = async (req, res) => {
  try {
    const horaire = await horaireModel.findById(req.params.id);
    if (!horaire) {
      return res.status(404).json({ success: false, message: 'Horaire non trouvé' });
    }
    res.status(200).json({ success: true, data: horaire });
  } catch (error) {
    console.error('Erreur getById horaire:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Créer un horaire
const create = async (req, res) => {
  try {
    // Récupérer l'admin_id du token ou du body
    const admin_id = req.user?.id || req.body.admin_id || null;
    
    const data = {
      jour: req.body.jour,
      ouverture: req.body.ouverture,
      fermeture: req.body.fermeture,
      ferme: req.body.ferme ? 1 : 0, // Convertir boolean en tinyint
      admin_id: admin_id
    };
    
    console.log('Création horaire - données:', data);
    
    const newHoraire = await horaireModel.create(data);
    res.status(201).json({ success: true, data: newHoraire });
  } catch (error) {
    console.error('Erreur create horaire:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mettre à jour un horaire
const update = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Vérifier si l'horaire existe
    const existingHoraire = await horaireModel.findById(id);
    if (!existingHoraire) {
      return res.status(404).json({ success: false, message: 'Horaire non trouvé' });
    }
    
    // Préparer les données de mise à jour
    const data = {};
    if (req.body.jour !== undefined) data.jour = req.body.jour;
    if (req.body.ouverture !== undefined) data.ouverture = req.body.ouverture;
    if (req.body.fermeture !== undefined) data.fermeture = req.body.fermeture;
    if (req.body.ferme !== undefined) data.ferme = req.body.ferme ? 1 : 0;
    
    console.log(`Mise à jour horaire ID ${id} - données:`, data);
    
    const updatedHoraire = await horaireModel.update(id, data);
    res.status(200).json({ success: true, data: updatedHoraire });
  } catch (error) {
    console.error('Erreur update horaire:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Supprimer un horaire
const remove = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await horaireModel.remove(id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Horaire non trouvé' });
    }
    
    res.status(200).json({ success: true, message: 'Horaire supprimé avec succès' });
  } catch (error) {
    console.error('Erreur remove horaire:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
