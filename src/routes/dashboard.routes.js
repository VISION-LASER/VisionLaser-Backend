const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboard.controller');

// Route publique : enregistrer une visite (appelée par le frontend)
router.post('/visit', DashboardController.recordVisit);

// Route protégée : lire les stats (réservée à l'admin)
router.get('/stats', DashboardController.getStats);

router.get('/test-db', async (req, res) => {
  let conn = null;
  try {
    const db = require('../config/connectDatabase');
    conn = await db();
    const [result] = await conn.execute('SELECT 1 as test');
    res.json({ success: true, message: 'Base de données connectée' });
  } catch (error) {
    console.error('DB Test error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (conn) await conn.end();
  }
});

module.exports = router;