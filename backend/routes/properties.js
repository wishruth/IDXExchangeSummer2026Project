const express = require('express');
const router = express.Router();
const pool = require('../db'); // importing the MySQL connection pool to db we configured earlier

// helper func that validates Listing ID
const isValidListingId = (id) => {
    if (!id || typeof id !== 'string') return false;

    // incorrect ids have to return 400 error
    if (id.length > 50) return false;

    // fix the regex if IDs have specific formats
    return /^[a-zA-Z0-9_-]+$/.test(id);
};

// GET api/properties
// purpose of this block is to get a paged and filterable list of properties
router.get('/', async (req, res) => {
    try {
        // pending, add dynamic sql query here
        // 1 - extract & default params; pull filter values from URL query
        // set default vals for limit (20) and offset(0) so pagination works even if
        // frontend doesn't specify that yet
        const {city, zipcode, minPrice, maxPrice, beds, baths, limit = 20, offset = 0} = req.query;


        // VALIDATION CHECKS
        if (minPrice && isNaN(Number(minPrice))) return res.status(400).json({error: "minPrice must be a valid number"});
        if (maxPrice && isNaN(Number(maxPrice))) return res.status(400).json({error: "maxPrice must be a valid number"});
        if (beds && isNaN(Number(beds))) return res.status(400).json({error: "beds must be a valid number"});
        if (baths && isNaN(Number(baths))) return res.status(400).json({error: "baths must be a valid number"});
        const parsedLimit = Number(limit);
        const parsedOffset = Number(offset);
        if (isNaN(parsedLimit) || parsedLimit <= 0 || parsedLimit > 100) {
            return res.status(400).json({ error: "limit must be a number between 1 and 100" });
        }
        if (isNaN(parsedOffset) || parsedOffset < 0) {
            return res.status(400).json({ error: "offset must be a positive number" });
        }

        // 2 - initializing the query builders
        // start string w/ WHERE 1=1 b/c its always true, that being the first arg 
        // b/c it lets us safely append new filters like 'AND price > 100' w/o complex logic
        // to pick betwen where and and for first filter
        let conditions = ' FROM rets_property WHERE 1=1';
        // array will hold actual filter values in order they get added
        // prevents sql injection attacks
        const queryValues = [];

        // 3 - dynamically create WHERE clause
        // check if user actually sent it in the request, if they did then append 
        // SQL condition using older RETS column names, push user values into our arr

        if (minPrice){
            conditions += ' AND L_SystemPrice >= ?';
            queryValues.push(Number(minPrice)); // converting to Number for db safety
        }

        if (maxPrice){
            conditions += ' AND L_SystemPrice <= ?';
            queryValues.push(Number(maxPrice));
        }

        if (beds){
            conditions += ' AND L_Keyword2 >= ?'; 
            queryValues.push(Number(beds));
        }

        if (baths){
            conditions += ' AND LM_Dec3 >= ?';
            queryValues.push(Number(baths));
        }

        if (city){
            // city has edge case issues, db has portland and PORTLAND
            // can use lower(trim()) to make db and user input exact same each time
            conditions += ' AND LOWER(TRIM(L_City)) = LOWER(TRIM(?))';
            queryValues.push(city); 
        }

        if (zipcode){
            conditions += ' AND L_Zip = ?';
            queryValues.push(zipcode);
        }

        // 4 - final SQL strings 
        // A - Count Query
        // needs to give total # of properties that match filters toggled, ignoring 
        // the 20-item limit. this way frontend knows how many pages are needed
        const countQuery = 'SELECT COUNT(*) as totalCount' + conditions;

        // B - Data Query 
        // needs to grab actual property rows but restrict using limit and offset 
        // for pagination
        const dataQuery = 'SELECT *' + conditions + 'LIMIT ? OFFSET ?';
        // create new arr for data query by spreading existing filter values and 
        // adding the pagination #s at the end
        const dataValues = [...queryValues, Number(limit), Number(offset)];

        // 5 - Execute Queries
        // run both queries against db simultaneously 
        const [countResult] = await pool.query(countQuery, queryValues);
        // countResult gets total number
        const [properties] = await pool.query(dataQuery, dataValues);
        // properties gets the 20 rows of data

        // 6 - Format & Send Responses
        res.status(200).json({
            total: countResult[0].totalCount,     //extracted from countQuery
            limit: Number(limit),
            offset: Number(offset),
            results: properties    // actual arr of property objects
        });

    } catch (error){
        console.error("Error fetching properties:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET/api/properties/:id/openhouses
router.get('/:id/openhouses', async (req, res) => {
    const { id } = req.params;

    // validate the param
    if (!isValidListingId(id)) {
        return res.status(400).json({ error: "Malformed or invalid listing ID." });
    }

    try {
        // Verify the property exists first
        const [propertyCheck] = await pool.query(
            'SELECT L_ListingID FROM rets_property WHERE L_ListingID = ?',
            [id]
        );

        // if the property dne return 404 error
        if (propertyCheck.length === 0) {
            return res.status(404).json({ error: "Property not found." });
        }

        // collect open houses and order them by date & start time
        const [openHouses] = await pool.query(
            `SELECT * FROM rets_openhouse 
             WHERE L_ListingID = ? 
             ORDER BY OpenHouse_Date ASC, OH_StartTime ASC`, 
            [id]
        );

        // return arr, empty one is fine not an err
        return res.json(openHouses);

        } catch (error) {
        console.error(`Error fetching open houses for property ${id}:`, error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

// GET /api/properties/:id
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    // validate param
    if (!isValidListingId(id)) {
        return res.status(400).json({ error: "Malformed or invalid listing ID." });
    }

    try {
        const [rows] = await pool.query(
            'SELECT * FROM rets_property WHERE L_ListingID = ?',
            [id]
        );

        // return personalized 404 
        if (rows.length === 0) {
            return res.status(404).json({ error: "Property not found." });
        }

        // return single full property object
        return res.json(rows[0]);

        } catch (error) {
        console.error(`Error fetching property ${id}:`, error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;