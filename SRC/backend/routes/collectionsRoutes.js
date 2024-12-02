const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Fetch all collections for a user
router.get("/:username", (req, res) => {
  const { username } = req.params;

  const query = "SELECT * FROM collections WHERE username = ?";
  db.query(query, [username], (err, result) => {
    if (err) {
      console.error("Error fetching collections:", err);
      return res.status(500).json({ message: "Error fetching collections" });
    }
    res.status(200).json(result);
  });
});

// Create a new collection
router.post("/create", (req, res) => {
  const { username, collectionName } = req.body;

  const query = "INSERT INTO collections (username, collectionName) VALUES (?, ?)";
  db.query(query, [username, collectionName], (err, result) => {
    if (err) {
      console.error("Error creating collection:", err);
      return res.status(500).json({ message: "Error creating collection" });
    }
    res.status(200).json({ message: "Collection created successfully" });
  });
});

// Add movie to a collection
router.post("/addMovie", (req, res) => {
  const { username, collectionName, movieTitle, releaseDate } = req.body;

  const query = "INSERT INTO collectionMovies (username, collectionName, movieTitle, releaseDate) VALUES (?, ?, ?, ?)";
  db.query(query, [username, collectionName, movieTitle, releaseDate], (err, result) => {
    if (err) {
      console.error("Error adding movie to collection:", err);
      return res.status(500).json({ message: "Error adding movie to collection" });
    }
    res.status(200).json({ message: "Movie added to collection successfully" });
  });
});

// Delete a collection
router.delete("/delete", (req, res) => {
  const { username, collectionName } = req.body;

  const query = "DELETE FROM collections WHERE username = ? AND collectionName = ?";
  db.query(query, [username, collectionName], (err, result) => {
    if (err) {
      console.error("Error deleting collection:", err);
      return res.status(500).json({ message: "Error deleting collection" });
    }
    res.status(200).json({ message: "Collection deleted successfully" });
  });
});

module.exports = router;
