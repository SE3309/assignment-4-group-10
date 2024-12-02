const express = require('express');
const router = express.Router();
const db = require('../config/db');

// recommendations route based on username
router.get('/recommendations/:username', (req, res) => {
    const username = req.params.username; // Extract username from request params
    console.log('Username from request params:', req.params.username);
    // Check if username is provided
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // Query to fetch recommendations
    const recommendationsQuery = `
SELECT DISTINCT m2.title, m2.releaseDate, m2.duration, m2.synopsis, 
       SUBSTRING_INDEX(m2.genre, '|', 1) AS primaryGenre
FROM (
    SELECT ur.movieTitle, ur.datePosted, m1.genre
    FROM userreview ur
    JOIN movie m1 ON ur.movieTitle = m1.title
    WHERE ur.username = ?
    ORDER BY ur.datePosted DESC
    LIMIT 1
) AS last_movie
JOIN movie m2 ON SUBSTRING_INDEX(last_movie.genre, '|', 1) = SUBSTRING_INDEX(m2.genre, '|', 1)
WHERE m2.title != last_movie.movieTitle
ORDER BY m2.releaseDate DESC
LIMIT 10; `

    // Execute the query
    db.query(recommendationsQuery, [username], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }

        // Check if there are any recommendations
        if (results.length === 0) {
            console.log('No recommendations found for username:', username);
            return res.status(404).json({ error: 'No recommendations found' });
        }

        // Return the fetched recommendations
        console.log('Recommendations fetched successfully:', results);
        res.json(results);
    });
});

module.exports = router;
