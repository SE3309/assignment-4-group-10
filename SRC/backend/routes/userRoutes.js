const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'username and password are required' });
  }

  const query = 'SELECT * FROM user WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error occurred while logging in' });
    }

    if (result.length > 0) {
      // user found
      res.status(200).json({ message: 'Login successful', user: result[0] });
    } else {
      // invalid credentials
      res.status(401).json({ message: 'Invalid username or password' });
    }
  });
});

// route for signing up a new user
router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const checkQuery = 'SELECT * FROM user WHERE username = ? OR email = ?';
  db.query(checkQuery, [username, email], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error occurred during sign up' });
    }

    if (result.length > 0) {

      return res.status(409).json({ message: 'Username or email already exists' });
    }

    // if user doesnt exist create a new user
    const query = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, password], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error occurred during sign up' });
      }

      // created user
      res.status(201).json({ message: 'user signed up successfully' });
    });
  });
});

module.exports = router;
