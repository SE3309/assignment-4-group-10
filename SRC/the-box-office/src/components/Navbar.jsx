import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-brand">The Box Office</Link>
      <ul>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Signup</Link></li>

      </ul>
    </nav>
  );
};

export default Navbar;
