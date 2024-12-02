import React, { useState, useEffect } from 'react';
import '../styles/watchlist.css';

const Watchlist = () => {
  const [movies, setMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  // Fetch movies from the database
  useEffect(() => {
    fetch("/api/watchlist") // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  const addToWatchlist = (movie) => {
    setWatchlist([...watchlist, movie]);
  };

  return (
    <div>
      <h2>Your Watchlist</h2>
      <div>
        {watchlist.length === 0 ? (
          <p>No movies in your watchlist yet.</p>
        ) : (
          <ul>
            {watchlist.map((movie) => (
              <li key={movie.id}>{movie.title}</li>
            ))}
          </ul>
        )}
      </div>

      <h3>Movie List</h3>
      <div style={{ height: "300px", overflowY: "scroll" }}>
        {movies.map((movie) => (
          <div key={movie.id}>
            <span>{movie.title}</span>
            <button onClick={() => addToWatchlist(movie)}>Add</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
