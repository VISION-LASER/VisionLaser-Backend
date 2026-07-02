const { db } = require('../config/connectDatabase');

/**
 * Récupère toutes les demandes de devis, triées par date décroissante.
 */
const getAllDevis = async () => {
  const [results] = await db.query('SELECT * FROM `devis` ORDER BY `created_at` DESC');
  return results;
};

/**
 * Crée une nouvelle demande de devis.
 */
const createDevis = async (data) => {
  const { civilite, nomPrenom, email, telephone } = data;
  const query = 'INSERT INTO `devis`(`civilite`, `nomPrenom`, `email`, `telephone`) VALUES (?,?,?,?)';
  const [result] = await db.query(query, [civilite || null, nomPrenom, email, telephone || null]);
  return getDevisById(result.insertId);
};

/**
 * Récupère UN devis par son identifiant.
 */
const getDevisById = async (id) => {
  const [results] = await db.query('SELECT * FROM `devis` WHERE `id` = ?', [id]);
  return results.length > 0 ? results[0] : null;
};

/**
 * Met à jour le statut d'un devis.
 */
const updateDevisStatus = async (id, status) => {
  const [result] = await db.query('UPDATE `devis` SET `status` = ? WHERE `id` = ?', [status, id]);
  if (result.affectedRows === 0) throw new Error('Devis introuvable.');
  return getDevisById(id);
};

/**
 * Supprime une demande de devis.
 */
const deleteDevis = async (id) => {
  const [result] = await db.query('DELETE FROM `devis` WHERE `id` = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = {
  getAllDevis,
  createDevis,
  getDevisById,
  updateDevisStatus,
  deleteDevis,
};