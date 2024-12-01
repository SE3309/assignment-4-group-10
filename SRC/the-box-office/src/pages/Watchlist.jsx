import React, { useState, useEffect } from 'react';
import '../styles/watchlist.css';


const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);

  // Fetch the username from localStorage
  const username = localStorage.getItem('username'); // Fetch username from localStorage

  // Check if username is available
  useEffect(() => {
    if (!username) {
      console.error('Username is missing or not logged in');
      return;
    }

    // Fetch the watchlist for the specific user
    fetch(`http://localhost:5000/api/userwatchlist/${username}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setWatchlist(data); // Update the state with the fetched data
      })
      .catch((err) => console.error('Error fetching watchlist:', err));
  }, [username]); // Only refetch when the username changes

  // Add movie to watchlist function
  const addToWatchlist = (movieTitle) => {
    const releaseDate = '2023-01-01'; // Example release date, replace with actual
    fetch('http://localhost:5000/api/userwatchlist/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, movieTitle, releaseDate }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setWatchlist([...watchlist, { movieTitle, releaseDate }]); // Add the movie to the local watchlist
        } else {
          console.error('Failed to add movie:', data.message);
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div className="watchlist-container">
      <h1>Your Watchlist</h1>
      {watchlist.length > 0 ? (
        <ul className="movie-list">
          {watchlist.map((movie, index) => (
            <li key={index} className="movie-item">
              {movie.movieTitle} (Released on {movie.releaseDate})
              <button
                className="remove-button"
                onClick={() => removeFromWatchlist(movie.movieTitle)}
              >
                Remove from Watchlist
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No movies found in your watchlist.</p>
      )}
      <button
        className="add-movie-button"
        onClick={() => addToWatchlist('New Movie Title')} // Example movie title, replace with actual logic
      >
        Add a Movie
      </button>
    </div>
  );
};

export default Watchlist;
