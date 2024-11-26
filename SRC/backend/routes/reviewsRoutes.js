const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Ensure this is the correct path to your database configuration

// POST /api/reviews
router.post('/reviews', (req, res) => {
    const { username, datePosted, movieTitle, releaseDate, rating, reviewText } = req.body;

    if (!username || !datePosted || !movieTitle || !releaseDate || !rating || !reviewText) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const checkUserQuery = 'SELECT username FROM User WHERE username = ?';
    db.query(checkUserQuery, [username], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        if (result.length === 0) {
            return res.status(400).json({ message: 'Invalid username' });
        }

        const formattedReleaseDate = releaseDate.split('T')[0]; // Format date if needed

        const insertReviewQuery = `
            INSERT INTO UserReview (username, datePosted, movieTitle, releaseDate, rating, reviewText)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(
            insertReviewQuery,
            [username, datePosted, movieTitle, formattedReleaseDate, rating, reviewText],
            (err, result) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Failed to submit the review' });
                }

                res.status(201).json({ message: 'Review submitted successfully' });
            }
        );
    });
});




module.exports = router;
