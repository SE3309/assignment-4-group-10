const express = require('express');
const router = express.Router();
const db = require('../config/db');

//Reviews for a specific user
router.get('/user/:username', (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    const query = 'SELECT * FROM UserReview WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching user reviews:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No reviews found for this user' });
        }

        res.json(results);
    });
});

//Route to get all reviews
router.get('/all', (req, res) => {
    const query = 'SELECT * FROM UserReview';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching all reviews:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.json(results);
    });
});

module.exports = router;
