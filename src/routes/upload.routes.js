const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');

// ==================== CONFIGURATION POUR LES IMAGES DES ÉQUIPEMENTS ====================
const equipementImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/equipements');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'equipement-' + uniqueSuffix + ext);
  }
});

// ==================== CONFIGURATION POUR LES IMAGES DES ACTUALITÉS ====================
const actualiteImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/actualites/images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'actualite-' + uniqueSuffix + ext);
  }
});

// ==================== CONFIGURATION POUR LES VIDÉOS DES ACTUALITÉS ====================
const actualiteVideoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/actualites/videos');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'actualite-' + uniqueSuffix + ext);
  }
});

// ==================== FILTRES POUR LES FICHIERS ====================
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées (JPEG, PNG, GIF, WEBP)'));
  }
};

const videoFilter = (req, file, cb) => {
  const allowedTypes = /mp4|webm|ogg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Seules les vidéos sont autorisées (MP4, WEBM, OGG)'));
  }
};

// ==================== CONFIGURATION MULTER ====================
const uploadEquipementImage = multer({ 
  storage: equipementImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter
});

const uploadActualiteImage = multer({ 
  storage: actualiteImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter
});

const uploadActualiteVideo = multer({ 
  storage: actualiteVideoStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: videoFilter
});

// ==================== ROUTES ====================

// Route d'upload d'image pour les équipements
router.post('/upload/equipement', authenticateToken, uploadEquipementImage.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucune image fournie' });
    }
    
    const imageUrl = `/uploads/equipements/${req.file.filename}`;
    
    res.json({ 
      success: true,
      imageUrl: imageUrl,
      url: imageUrl,
      message: 'Image uploadée avec succès'
    });
  } catch (error) {
    console.error('Erreur upload image équipement:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload de l\'image' });
  }
});

// Route d'upload d'image pour les actualités
router.post('/upload/actualite/image', authenticateToken, uploadActualiteImage.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucune image fournie' });
    }
    
    const imageUrl = `/uploads/actualites/images/${req.file.filename}`;
    
    res.json({ 
      success: true,
      imageUrl: imageUrl,
      url: imageUrl,
      message: 'Image uploadée avec succès'
    });
  } catch (error) {
    console.error('Erreur upload image actualité:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload de l\'image' });
  }
});

// Route d'upload de vidéo pour les actualités
router.post('/upload/actualite/video', authenticateToken, uploadActualiteVideo.single('video'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucune vidéo fournie' });
    }
    
    const videoUrl = `/uploads/actualites/videos/${req.file.filename}`;
    
    res.json({ 
      success: true,
      videoUrl: videoUrl,
      url: videoUrl,
      message: 'Vidéo uploadée avec succès'
    });
  } catch (error) {
    console.error('Erreur upload vidéo actualité:', error);
    res.status(500).json({ message: 'Erreur lors de l\'upload de la vidéo' });
  }
});

// ==================== GESTION DES ERREURS ====================
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({ message: 'Le fichier est trop volumineux (max 5MB pour les images, 50MB pour les vidéos)' });
    }
    return res.status(400).json({ message: error.message });
  }
  if (error.message && error.message.includes('images')) {
    return res.status(400).json({ message: error.message });
  }
  if (error.message && error.message.includes('vidéos')) {
    return res.status(400).json({ message: error.message });
  }
  next(error);
});

module.exports = router;