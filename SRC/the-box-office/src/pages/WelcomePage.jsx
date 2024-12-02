import React, { useEffect, useState } from "react";
import "../styles/welcome.css";

const WelcomePage = () => {
  const [recentMovies, setRecentMovies] = useState([]);

  useEffect(() => {
    // Fetch recently released movies from the backend
    const fetchRecentMovies = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/movies/recent");
        if (!response.ok) {
          throw new Error(`Error fetching recent movies: ${response.statusText}`);
        }
        const data = await response.json();
        setRecentMovies(data);
      } catch (error) {
        console.error("Error fetching recent movies:", error.message);
      }
    };

    fetchRecentMovies();
  }, []);

  return (
    <div className="welcome-container">
      {/* Welcome Section */}
      <section className="welcome-section">
        <h1>Discover New Movies</h1>
        <p>
        Stay updated with the latest releases, trending films, and timeless classics. Discover a world of movies! Rate your favorites, explore personalized recommendations, and keep track of what you've watched. From classics to the latest releases, your movie journey starts here.
        </p>
      </section>

    

      {/* Recent Movies Section */}
      <section className="recent-movies-section">
        <h2>Checkout the Movies Just Released</h2>
        <div className="recent-movies-list">
          {recentMovies.length > 0 ? (
            recentMovies.map((movie, index) => (
              <div key={index} className="movie-card">
                <h3>{movie.title}</h3>
                <p><strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p>
                <p><strong>Duration:</strong> {movie.duration} minutes</p>
                <p>{movie.synopsis}</p>
              </div>
            ))
          ) : (
            <p>No recent movies available at the moment. Check back later!</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default WelcomePage;