require('dotenv').config();
const corsMiddleware = require('./src/middleware/cors.middleware');
const connectDatabase = require('./src/config/connectDatabase');

const express = require('express');

const app = express();

// CORS
app.use(corsMiddleware);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion BDD
connectDatabase()
    .then((res) => {
        console.log('MYSQL :', res.status);
    })
    .catch((err) => {
        console.error(err);
    });

// Route test
app.get('/', (req, res) => {
    res.json({
        message: 'Serveur actif'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});