import React, { useState } from 'react';
import '../styles/login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); 

    const userCredentials = { username, password };
  
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userCredentials),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);  
      }
  
      const data = await response.json();
  
      if (data) {
        console.log('Login successful:', data);
        localStorage.setItem('username', data.user.username);
        window.location.href = '/home';  //directs the page to home when succesfully logged in.
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'Something went wrong, please try again.');
    }
  };
  

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
        <button type="submit" className="login-btn">Login</button>
        <p className="signup-text">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
};




export default Login;
