// import React from 'react';

// const Home = () => {
//   return (
//     <div>
//       <h1>Succesfully Logged in</h1>
      
//     </div>
//   );
// };

// export default Home;

import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

const Home = ({ username }) => {
  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <div className="search-bar">
        <select className="search-by">
          <option value="movie">Movie</option>
          <option value="director">Director</option>
          <option value="actor">Actor</option>
        </select>
        <input type="text" className="search-input" placeholder="Search..." />
        <button className="search-btn">Search</button>
      </div>

      <div className="main-content">
        {/* Left Panel */}
        <div className="left-panel">
          <div className="profile-section">
            <button className="profile-btn">Profile</button>
          </div>
          <nav className="nav-links">
            <Link to="/ratemovie" className="nav-item">Rate A Movie</Link>
            <Link to="/watchlist" className="nav-item">Watchlist</Link>
            <Link to="/collections" className="nav-item">Collections</Link>
            <Link to="/findfriends" className="nav-item">Find Friends</Link>
          </nav>
        </div>

        {/* Main Panel */}
        <div className="main-panel">
          <div className="recommendations">
            <h2>Personalized Recommendations</h2>
            <div className="recommendations-content">
              {/* Add dynamic content here */}
              Recommendations will appear here.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
