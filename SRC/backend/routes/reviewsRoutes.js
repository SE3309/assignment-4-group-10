const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

router.post('/reviews', (req, res) => {
    const { username, datePosted, movieTitle, releaseDate, rating, reviewText } = req.body;

    if (!username || !datePosted || !movieTitle || !releaseDate || !rating || !reviewText) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const checkUserQuery = 'SELECT username FROM User WHERE username = ?';
    db.query(checkUserQuery, [username], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error while validating username' });
        }

        if (result.length === 0) {
            return res.status(400).json({ error: 'Invalid username. Please log in again.' });
        }

        const formattedReleaseDate = releaseDate.split('T')[0]; 

        const insertReviewQuery = `
            INSERT INTO UserReview (username, datePosted, movieTitle, releaseDate, rating, reviewText)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(
            insertReviewQuery,
            [username, datePosted, movieTitle, formattedReleaseDate, rating, reviewText],
            (err, result) => {
                if (err) {
                    console.error('Database error:', err.message);
                    return res.status(500).json({ error: `Database error: ${err.message}` });
                }

                res.status(201).json({ message: 'Review submitted successfully' });
            }
        );
    });
});

module.exports = router;
