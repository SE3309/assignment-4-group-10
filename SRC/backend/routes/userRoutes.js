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

router.get('/search', (req, res) => {
  const { username } = req.query;

  // Validate the input
  if (!username) {
    return res.status(400).json({ error: 'Username query parameter is required' });
  }

  // SQL query to search for users with similar usernames
  const query = 'SELECT username, email FROM user WHERE username LIKE ?';
  const searchParam = `%${username}%`;

  db.query(query, [searchParam], (err, results) => {
    if (err) {
      console.error('Error searching for users:', err);
      return res.status(500).json({ error: 'Internal server error while searching for users' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No users found matching the search term' });
    }

    res.status(200).json(results);
  });
});

router.post('/follow', (req, res) => {
  const { username, followerUsername } = req.body;

  // Validate input
  if (!username || !followerUsername) {
    return res.status(400).json({ error: 'Both username and followerUsername are required' });
  }

  if (username === followerUsername) {
    return res.status(400).json({ error: 'Users cannot follow themselves' });
  }

  const query = `
    INSERT INTO userfollowers (username, followerUsername)
    VALUES (?, ?)
  `;

  db.query(query, [username, followerUsername], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'You are already following this user' });
      }

      console.error('Error inserting into userfollowers:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(201).json({ message: 'Followed user successfully' });
  });
});

// Unfollow a user
router.delete('/unfollow', (req, res) => {
  const { username, followerUsername } = req.body;

  // Validate input
  if (!username || !followerUsername) {
    return res.status(400).json({ error: 'Both username and followerUsername are required' });
  }

  const query = `
    DELETE FROM userfollowers
    WHERE username = ? AND followerUsername = ?
  `;

  db.query(query, [username, followerUsername], (err, result) => {
    if (err) {
      console.error('Error deleting from userfollowers:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'You are not following this user' });
    }

    res.status(200).json({ message: 'Unfollowed user successfully' });
  });
});

// Get a user's followers
router.get('/:username/followers', (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const query = `
    SELECT followerUsername
    FROM userfollowers
    WHERE username = ?
  `;

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error fetching followers:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json(results);
  });
});

// Get a user's following list
router.get('/:username/following', (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const query = `
    SELECT username
    FROM userfollowers
    WHERE followerUsername = ?
  `;

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error fetching following list:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.status(200).json(results);
  });
});


module.exports = router;
