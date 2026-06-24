// to load env vars
require('dotenv').config();

// import necessary core libraries
const express = require('express');
const cors = require('cors');

// import db pool configured in db.js 
const pool = require('./db');

// initialize the express app
const app = express(); 

app.use(cors());
app.use(express.json());

// GET api/health - endpoint which verifies server and db status 
app.get('/api/health', async (req, res) => {
    try{
        await pool.query('SELECT 1');
        // lightweight query to prove we can reach db

        res.status(200).json({ status: "ok", database: "connected" });
        // if that's sucessful then return a 200 ok status w/ a success msg
    } catch (error) {
        // if it fails instead, log the error and return a 500 internal server error
        console.error("Database connection failed:", error);
        res.status(500).json({ status: "error", database: "disconnected", message: error.message });
    }
});

const PORT = process.env.PORT || 5001;
// set the port from .env to fallback to port 5000 if it isn't found

// start server, listen for incoming requests
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


