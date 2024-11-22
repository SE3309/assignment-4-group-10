const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'sqluser',  
  password: 'password',  
  database: 'the_box_office'  
});

const loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'please input both username and password' });
  }

  const query = 'SELECT * FROM user WHERE username = ? AND password = ?';
  
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Internal server error' }); 
    }
    
    if (results.length > 0) {
      return res.status(200).json({ message: 'Login successful', user: results[0] });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  });
};

module.exports = {
  loginUser,
};
