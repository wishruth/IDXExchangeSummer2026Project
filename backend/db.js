require('dotenv').config();
// loads vars from .env to process.env
const mysql = require('mysql2/promise');
// use promise wrapper to allow async/await instead of older callback chains

// make all connections reusable instead of making it on a specific request basis
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// export the pool so other files can import it to the query the database
module.exports = pool;

