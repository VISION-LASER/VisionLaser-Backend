// require('dotenv').config(); 
// const corsMiddleware = require('./src/middleware/cors.middleware');
// const connectDatabase = require('./src/config/connectDatabase');

// const express = require('express');

// const app = express();

// // CORS
// app.use(corsMiddleware);

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Connexion BDD
// connectDatabase()
//     .then((res) => {
//         console.log('MYSQL :', res.status);
//     })
//     .catch((err) => {
//         console.error(err);
//     });

// // Route test
// app.get('/', (req, res) => {
//     res.json({
//         message: 'Serveur actif'
//     });
// });

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//     console.log(`Serveur lancé sur le port ${PORT}`);
// });

require('dotenv').config();
const corsMiddleware = require('./src/middleware/cors.middleware');
const connectDatabase = require('./src/config/connectDatabase');
const path = require('path'); // pour upload image

const express = require('express');

// ✅ AJOUTEZ CETTE LIGNE
const userRoutes = require('./src/routes/user.routes');
const uploadRoutes = require('./src/routes/upload.routes');  // pour upload image
const dashboardRoutes = require('./src/routes/dashboard.routes');

const app = express();

// CORS
app.use(corsMiddleware);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // pour upload image

// Connexion BDD
connectDatabase()
    .then((res) => {
        console.log('MYSQL :', res.status);
    })
    .catch((err) => {
        console.error(err);
    });

// ✅ AJOUTEZ CES LIGNES (routes d'authentification)
app.use('/api/users', userRoutes);
app.use('/api/users', uploadRoutes); // pour upload image
app.use('/api/dashboard', dashboardRoutes);

// Route test
app.get('/', (req, res) => {
    res.json({
        message: 'Serveur actif'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
    console.log(`📝 Routes d'authentification disponibles:`);
    console.log(`   POST   http://localhost:${PORT}/api/users/register`);
    console.log(`   POST   http://localhost:${PORT}/api/users/login`);
    console.log(`   POST   http://localhost:${PORT}/api/users/refresh`);
    console.log(`   GET    http://localhost:${PORT}/api/users/profile (protégée)`);
    console.log(`Routes d'upload disponibles:`);
    console.log(`   POST   http://localhost:${PORT}/api/users/upload`);
});