import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

const Home = ({ username }) => {
  const [searchBarQuery, setSearchBarQuery] = useState("");
  const [searchType, setSearchType] = useState("movie");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [filteredResults, setFilteredResults] = useState([]);
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [releaseStartDate, setReleaseStartDate] = useState(""); 
  const [releaseEndDate, setReleaseEndDate] = useState("");

  const handleSearchBar = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/search?query=${searchBarQuery}&type=${searchType}&genre=${genre}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const results = await response.json();
      setSearchResults(results);
      setFilteredResults(results);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleSearchDetails = async (movie) => {
    try {
      const formattedDate = new Date(movie.releaseDate)
        .toISOString()
        .split("T")[0];

      const response = await fetch(
        `http://localhost:5000/api/search/details?title=${encodeURIComponent(
          movie.title
        )}&releaseDate=${encodeURIComponent(formattedDate)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }

      const movieDetails = await response.json();
      setSelectedMovie(movieDetails);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    const currentGenre = name === "genre" ? value : genre;
    const currentRating = name === "rating" ? value : rating;
    const currentStartDate = name === "startDate" ? value : releaseStartDate;
    const currentEndDate = name === "endDate" ? value : releaseEndDate;

    if (name === "genre") setGenre(value);
    if (name === "rating") setRating(value);
    if (name === "startDate") setReleaseStartDate(value);
    if (name === "endDate") setReleaseEndDate(value);

    const filtered = searchResults.filter((movie) => {
      const genres = movie.genre.split("|");
      const matchesGenre = currentGenre === "" || genres.includes(currentGenre);
      const matchesRating =
        currentRating === "" || movie.rating >= parseInt(currentRating, 10);

      const matchesReleaseDate =
        (!currentStartDate ||
          new Date(movie.releaseDate) >= new Date(currentStartDate)) &&
        (!currentEndDate ||
          new Date(movie.releaseDate) <= new Date(currentEndDate));

      return matchesGenre && matchesRating && matchesReleaseDate;
    });

    setFilteredResults(filtered);
  };

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <div className="search-section">
        <div className="search-bar">
          <select
            className="search-by"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="movie">Movie</option>
            <option value="director">Director</option>
            <option value="genre">Genre</option>
            <option value="actor">Actor</option>
          </select>
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchBarQuery}
            onChange={(e) => setSearchBarQuery(e.target.value)}
          />
          <button className="search-btn" onClick={handleSearchBar}>
            Search
          </button>

          <div className="search-results-section">
            {filteredResults.map((movie, index) => (
              <div
                key={index}
                className="movie-result-item"
                onClick={() => handleSearchDetails(movie)}
              >
                {movie.title}

                {searchType === "director" && (
                  <p>Directed by: {movie.directorName}</p>
                )}
                {searchType === "actor" && <p>Actor: {movie.castName}</p>}
                {searchType === "genre" && <p>Genre: {movie.genre}</p>}
              </div>
            ))}
          </div>
          {selectedMovie && (
            <div className="movie-details">
              <h2>{selectedMovie.title}</h2>
              <p>
                <strong>Release Date:</strong> {selectedMovie.releaseDate}
              </p>
              <p>
                <strong>Duration:</strong> {selectedMovie.duration}
              </p>
              <p>
                <strong>Genre:</strong> {selectedMovie.genre}
              </p>
              <p>
                <strong>Synopsis:</strong> {selectedMovie.synopsis}
              </p>
            </div>
          )}
        </div>

        <div className="filters">
          <div id="genre-filter">
            <p>Select a Genre:</p>
            <label>
              <input
                type="radio"
                name="genre"
                value=""
                checked={genre === ""}
                onChange={handleFilterChange}
              />{" "}
              All
            </label>
            <label>
              <input
                type="radio"
                name="genre"
                value="Action"
                checked={genre === "Action"}
                onChange={handleFilterChange}
              />{" "}
              Action
            </label>
            <label>
              <input
                type="radio"
                name="genre"
                value="Comedy"
                checked={genre === "Comedy"}
                onChange={handleFilterChange}
              />{" "}
              Comedy
            </label>
            <label>
              <input
                type="radio"
                name="genre"
                value="Drama"
                checked={genre === "Drama"}
                onChange={handleFilterChange}
              />{" "}
              Drama
            </label>
          </div>
          <div id="rating-filter">
            <p>Select a Rating:</p>
            <label>
              <input
                type="radio"
                name="rating"
                value=""
                checked={rating === ""}
                onChange={handleFilterChange}
              />{" "}
              All
            </label>
            <label>
              <input
                type="radio"
                name="rating"
                value="1"
                checked={rating === "1"}
                onChange={handleFilterChange}
              />{" "}
              1+
            </label>
            <label>
              <input
                type="radio"
                name="rating"
                value="2"
                checked={rating === "2"}
                onChange={handleFilterChange}
              />{" "}
              2+
            </label>
            <label>
              <input
                type="radio"
                name="rating"
                value="3"
                checked={rating === "3"}
                onChange={handleFilterChange}
              />{" "}
              3+
            </label>
            <label>
              <input
                type="radio"
                name="rating"
                value="4"
                checked={rating === "4"}
                onChange={handleFilterChange}
              />{" "}
              4+
            </label>
            <label>
              <input
                type="radio"
                name="rating"
                value="5"
                checked={rating === "5"}
                onChange={handleFilterChange}
              />{" "}
              5
            </label>
          </div>

          <div id="release-date-filter">
            <p>Filter by Release Date:</p>
            <div className="filter-options">
              <label>
                Start Date:{" "}
                <input
                  type="date"
                  name="startDate"
                  value={releaseStartDate}
                  onChange={(e) => {
                    setReleaseStartDate(e.target.value);
                    handleFilterChange(e); 
                  }}
                />
              </label>
              <label>
                End Date:{" "}
                <input
                  type="date"
                  name="endDate"
                  value={releaseEndDate}
                  onChange={(e) => {
                    setReleaseEndDate(e.target.value);
                    handleFilterChange(e);
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content">
        {/* Left Panel */}
        <div className="left-panel">
          <div className="profile-section">
            <button className="profile-btn">Profile</button>
          </div>
          <nav className="nav-links">
            <Link to="/ratemovie" className="nav-item">
              Rate A Movie
            </Link>
            <Link to="/reviews" className="nav-item">
              Reviews
            </Link>
            <Link to="/watchlist" className="nav-item">
              Watchlist
            </Link>
            <Link to="/collections" className="nav-item">
              Collections
            </Link>
            <Link to="/findfriends" className="nav-item">
              Find Friends
            </Link>
            <Link to="/recommendations" className="nav-item">
              Personalized Recommendations
            </Link>
            
          </nav>
        </div>

        {/* Main Panel */}
        <div className="main-panel">
          <div className="recommendations">
            <h2>Personalized Recommendations</h2>
            <div className="recommendations-content">
              {/* Add dynamic content here */}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
