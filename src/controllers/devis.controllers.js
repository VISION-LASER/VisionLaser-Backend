const devisModel = require('../models/devis.models');

const VALID_STATUSES = ['pending', 'treated', 'cancelled'];

// ========================
//  GET /api/devis (admin)
// ========================
const getAllDevis = async (req, res) => {
  try {
    const devis = await devisModel.getAllDevis();
    return res.status(200).json({
      success: true,
      data: devis,
    });
  } catch (error) {
    console.error('[devis.controller] getAllDevis error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des devis.',
    });
  }
};

// ========================
//  POST /api/devis (public)
// ========================
const createDevis = async (req, res) => {
  try {
    const { civilite, nomPrenom, email, telephone } = req.body;

    // ----- Validation des champs obligatoires -----
    const errors = [];

    if (!nomPrenom || typeof nomPrenom !== 'string' || nomPrenom.trim() === '') {
      errors.push('Le champ "Nom et prénom" est obligatoire.');
    }
    if (!email || typeof email !== 'string' || email.trim() === '') {
      errors.push('Le champ "Email" est obligatoire.');
    } else {
      // Validation basique du format d'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.push('Le format de l\'adresse e-mail est invalide.');
      }
    }
    if (!telephone || typeof telephone !== 'string' || telephone.trim() === '') {
      errors.push('Le champ "Téléphone" est obligatoire.');
    }

    // civilite est optionnel (M. | Mme), pas de validation supplémentaire

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation échouée.',
        errors,
      });
    }

    // ----- Insertion en base -----
    const nouveauDevis = await devisModel.createDevis({
      civilite:   civilite || null,
      nomPrenom:  nomPrenom.trim(),
      email:      email.trim().toLowerCase(),
      telephone:  telephone.trim(),
    });

    return res.status(201).json({
      success: true,
      data: nouveauDevis,
    });
  } catch (error) {
    console.error('[devis.controller] createDevis error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du devis.',
    });
  }
};

// ========================
//  PUT /api/devis/:id/status (admin)
// ========================
const updateDevisStatus = async (req, res) => {
  try {
    const { id }  = req.params;
    const { status } = req.body;

    // ----- Validation de l'ID -----
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'ID de devis invalide.',
      });
    }

    // ----- Validation du statut -----
    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Statut invalide. Valeurs autorisées : ${VALID_STATUSES.join(', ')}.`,
      });
    }

    // ----- Mise à jour -----
    const devisMisAJour = await devisModel.updateDevisStatus(Number(id), status);

    return res.status(200).json({
      success: true,
      data: devisMisAJour,
    });
  } catch (error) {
    console.error('[devis.controller] updateDevisStatus error:', error.message);

    if (error.message === 'Devis introuvable.') {
      return res.status(404).json({
        success: false,
        message: 'Devis introuvable.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut.',
    });
  }
};

// ========================
//  DELETE /api/devis/:id (admin)
// ========================
const deleteDevis = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'ID de devis invalide.',
      });
    }

    const deleted = await devisModel.deleteDevis(Number(id));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Devis introuvable.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Devis supprimé avec succès.',
    });
  } catch (error) {
    console.error('[devis.controller] deleteDevis error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du devis.',
    });
  }
};

module.exports = {
  getAllDevis,
  createDevis,
  updateDevisStatus,
  deleteDevis,
};
