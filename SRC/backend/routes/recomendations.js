const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/recommendations/:userId', (req, res) => {
  const userId = req.params.userId;

  // Fetch top-rated genres or directors by the user
  const query = `
    SELECT m.genre, m.director
    FROM Movies m
    JOIN Reviews r ON m.id = r.movieId
    WHERE r.userId = ?
    ORDER BY r.rating DESC
    LIMIT 10;
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database query error' });
    }

    // Use genres or directors to fetch recommended movies
    const genres = results.map(row => row.genre);
    const directors = results.map(row => row.director);

    const recommendationQuery = `
      SELECT * FROM Movies
      WHERE genre IN (?) OR director IN (?)
      LIMIT 10;
    `;

    db.query(recommendationQuery, [genres, directors], (err, recommendations) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database query error' });
      }

      res.json(recommendations);
    });
  });
});

module.exports = router;
