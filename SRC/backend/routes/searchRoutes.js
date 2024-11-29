const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust path to your database config

//new version
router.get('/api/search', (req, res) => {
    const { query, type} = req.query;

    console.log("query: ", query)
    console.log("type: ", type)

    if (!query || !type) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    let sql = '';
    params = [`%${query}%`];

    if (type === 'movie'){
        sql = 'SELECT Movie.title, Movie.releaseDate, Movie.genre, Review.rating FROM Movie JOIN Review ON Movie.title = Review.`movieTitle` WHERE Movie.title LIKE ?';

    } else if (type === 'director'){
        sql = 'SELECT Movie.title, Movie.releaseDate, Movie.genre, Review.rating, MovieDirector.directorName FROM Movie JOIN MovieDirector ON Movie.title = MovieDirector.title LEFT JOIN Review ON Movie.title = Review.movieTitle WHERE directorName LIKE ?';

    } else if (type === 'actor'){
        sql = 'SELECT Movie.title, Movie.releaseDate, Movie.genre, Review.rating, MovieCast.castName FROM Movie JOIN MovieCast ON Movie.title = MovieCast.title LEFT JOIN Review ON Movie.title = Review.movieTitle WHERE MovieCast.castName LIKE ?';

    } else if (type === 'genre'){
        sql = 'SELECT Movie.title, Movie.releaseDate, Movie.genre, Review.rating FROM Movie JOIN Review ON Movie.title = Review.movieTitle WHERE Movie.genre LIKE ?';

    } else {
        return res.status(400).json({ message: 'Invalid search type.'});
    }

    
    sql += ' LIMIT 30';
    

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ message: 'Database query failed' });
        }

        console.log("success executing query in NEW SEARCH");
        res.status(200).json(results);
    });
});

//details for movie!
router.get('/api/search/details', (req, res) => {
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