const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Recommendations route based on username
router.get('/recommendations/:username', (req, res) => {
    const username = req.params.username;

    console.log('Fetching recommendations for username:', username);

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // Query to fetch recommendations
    const recommendationsQuery = `
        SELECT m.title, m.releaseDate, m.duration, m.synopsis
        FROM movie m
        JOIN review r ON m.title = r.movieTitle
        JOIN user u ON r.username = u.username
        WHERE u.username = ?
        ORDER BY r.rating DESC
        LIMIT 10;
    `;

    db.query(recommendationsQuery, [username], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }

        if (results.length === 0) {
            console.log('No recommendations found for username:', username);
            return res.status(404).json({ error: 'No recommendations found' });
        }

        console.log('Recommendations fetched successfully:', results);
        res.json(results);
    });
});

module.exports = router;
