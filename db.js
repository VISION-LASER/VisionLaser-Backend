const mysql = require('mysql2');
require('dotenv').config();

// Créer le pool de connexions avec vos paramètres
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Tester la connexion
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Erreur de connexion à MySQL:', err.message);
    } else {
        console.log('✅ Connecté à MySQL database:', process.env.DB_NAME);
        connection.release();
    }
});

module.exports = pool.promise();