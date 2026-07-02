const { authenticateToken } = require('../middleware/auth.middleware');

const express = require('express');
const router  = express.Router();

const devisController = require('../controllers/devis.controllers');

router.post('/', devisController.createDevis);

router.get('/', authenticateToken, devisController.getAllDevis);

router.put('/:id/status', authenticateToken, devisController.updateDevisStatus);

router.delete('/:id', authenticateToken, devisController.deleteDevis);

module.exports = router;