// require('dotenv').config();
// const mysql = require('mysql2/promise');

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// module.exports = async () => {
//     try {
//         const connection = await pool.getConnection();
//         connection.release();

//         return { status: 'CONNECTE' };
//     } catch (error) {
//         console.error('BDD erreur :', error.message);

//         return { status: 'ERREUR' };
//     }
// };

const mysql = require('mysql2');
require('dotenv').config();

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

const promisePool = pool.promise();

const connectDatabase = async () => {
    try {
        // Tester la connexion
        const [result] = await promisePool.query('SELECT 1');
        return { status: '✅ Connecté à MySQL', database: process.env.DB_NAME };
    } catch (error) {
        throw new Error(`Erreur MySQL: ${error.message}`);
    }
};

module.exports = connectDatabase;
module.exports.db = promisePool;