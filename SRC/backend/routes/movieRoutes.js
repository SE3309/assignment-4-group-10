const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust path to your database config

// Route to search for movies
router.get('/api/movies', (req, res) => {
    const query = req.query.query; // Get the movie name from the query string

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    const sql = 'SELECT title, releaseDate FROM Movie WHERE title LIKE ?';
    db.query(sql, [`%${query}%`], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: 'Database query failed' });
        }
        res.status(200).json(results);
    });
});

// Route to fetch movie details
router.get('/api/movies/details', (req, res) => {
    const { title, releaseDate } = req.query; // Get title and release date from query string

    if (!title || !releaseDate) {
        return res.status(400).json({ message: 'Title and release date are required' });
    }

    const sql = 'SELECT * FROM Movie WHERE title = ? AND releaseDate = ?';
    db.query(sql, [title, releaseDate], (err, results) => {
        if (err) {
            console.error('Error fetching movie details:', err);
            return res.status(500).json({ message: 'Database query failed' });
        }
    
        if (results.length === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        }
    
        res.status(200).json(results[0]);
    });
});
  
module.exports = router;