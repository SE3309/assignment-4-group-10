const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/userwatchlist/:username', (req, res) => {
  const { username } = req.params;
  console.log(`Fetching watchlist for user: ${username}`);  // Add logging for debugging

  const query = 'SELECT movieTitle, releaseDate FROM userwatchlist WHERE username = ?';

  db.query(query, [username], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error occurred while fetching watchlist' });
    }

    if (result.length > 0) {
      // Return the user's watchlist data if found
      res.status(200).json(result);
    } else {
      // If no results found for the username
      res.status(404).json({ message: 'No movies found in your watchlist' });
    }
  });
});


// Add movie to the watchlist
router.post('/add', async (req, res) => {
    const { username, movieTitle, releaseDate } = req.body; // Getting movie data and username from request body
  
    try {
      // Inserting the movie into the user's watchlist
      const result = await pool.query(
        'INSERT INTO userwatchlist (username, movieTitle, releaseDate) VALUES (?, ?, ?, NOW())',
        [username, movieTitle, releaseDate] // Including the current date for watchlist update
      );
      res.json({ success: true, message: 'Movie added to watchlist' });
    } catch (err) {
      console.error('Error adding movie to watchlist:', err);
      res.status(500).json({ success: false, message: 'Error adding movie to watchlist' });
    }
  });
  

// Remove movie from the watchlist
router.delete('/remove', async (req, res) => {
    const { username, movieTitle } = req.body; // Getting movie data and username from request body
  
    try {
      const result = await pool.query(
        'DELETE FROM userwatchlist WHERE username = ? AND movieTitle = ?',
        [username, movieTitle] // Deleting the movie for the specified user
      );
      res.json({ success: true, message: 'Movie removed from watchlist' });
    } catch (err) {
      console.error('Error removing movie from watchlist:', err);
      res.status(500).json({ success: false, message: 'Error removing movie from watchlist' });
    }
  });

module.exports = router;
