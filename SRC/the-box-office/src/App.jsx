import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import WelcomePage from './pages/WelcomePage';
import Home from './pages/Home';
import RateMovie from './pages/RateMovie';
import Reviews from './pages/Reviews';
import Watchlist from './pages/Watchlist';
import Collections from './pages/Collections';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<WelcomePage />} />  
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ratemovie" element={<RateMovie username="currentUsername"/>} />
        <Route path="/reviews" element={<Reviews username="currentUsername"/>} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/collections" element={<Collections />} />
      </Routes>
    </Router>
  );
};

export default App;
