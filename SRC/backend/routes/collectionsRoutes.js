const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create a collection
router.post('/create', async (req, res) => {
  const { userId, collectionName } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO collection (user_id, collection_name) VALUES ($1, $2) RETURNING collection_id',
      [userId, collectionName]
    );
    res.json({ success: true, collectionId: result.rows[0].collection_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error creating collection' });
  }
});

// Update a collection
router.put('/update', async (req, res) => {
  const { collectionId, collectionName } = req.body;
  try {
    const result = await pool.query(
      'UPDATE collection SET collection_name = $1 WHERE collection_id = $2',
      [collectionName, collectionId]
    );
    res.json({ success: true, message: 'Collection updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error updating collection' });
  }
});

// Delete a collection
router.delete('/delete', async (req, res) => {
  const { collectionId } = req.body;
  try {
    await pool.query('DELETE FROM collectionmovies WHERE collection_id = $1', [collectionId]);
    const result = await pool.query('DELETE FROM collection WHERE collection_id = $1', [collectionId]);
    res.json({ success: true, message: 'Collection deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error deleting collection' });
  }
});

module.exports = router;
