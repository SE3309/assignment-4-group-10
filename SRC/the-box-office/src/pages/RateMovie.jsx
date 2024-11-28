import React, { useState } from "react";
import "../styles/rateMovie.css";

const RateMovie = ({ username }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movieResults, setMovieResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [rating, setRating] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/movies?query=${searchQuery}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const movies = await response.json();
      setMovieResults(movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleSelectMovie = async (movie) => {
    try {
      const formattedDate = new Date(movie.releaseDate).toISOString().split("T")[0];
      const response = await fetch(
        `http://localhost:5000/api/movies/details?title=${encodeURIComponent(
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

  const handleSubmitReview = async () => {
    const username = localStorage.getItem("username"); //Retrieves the logged-in username

    if (!username) {
      setErrorMessage("You must be logged in to submit a review.");
      setConfirmationMessage("");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          datePosted: reviewDate,
          movieTitle: selectedMovie.title,
          releaseDate: selectedMovie.releaseDate,
          rating,
          reviewText,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit the review");
      }

      const result = await response.json();
      setConfirmationMessage("Review submitted successfully!");
      setErrorMessage("");
      console.log(result.message);
    } catch (error) {
      console.error("Error submitting review:", error.message);
      setErrorMessage(`Error: ${error.message}`);
      setConfirmationMessage(""); 
    }
  };

  return (
    <div className="rate-movie-container">
      <h1>RATE A MOVIE</h1>
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Movie Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className="results-section">
        {movieResults.map((movie, index) => (
          <div
            key={index}
            className="movie-result-item"
            onClick={() => handleSelectMovie(movie)}
          >
            {movie.title} ({movie.releaseDate})
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
          <div className="review-section">
            <label>
              Rate Movie:
              <select
                className="rating-dropdown"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="">Select</option>
                {[1, 2, 3, 4, 5].map((ratingValue) => (
                  <option key={ratingValue} value={ratingValue}>
                    {ratingValue}
                  </option>
                ))}
              </select>
            </label>
            <textarea
              className="review-text"
              placeholder="Write your review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            ></textarea>
            <input
              type="date"
              className="review-date"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
            />
            <button className="submit-review-btn" onClick={handleSubmitReview}>
              Submit Rating
            </button>
            {confirmationMessage && (
              <p className="status-message success">{confirmationMessage}</p>
            )}
            {errorMessage && (
              <p className="status-message error">{errorMessage}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RateMovie;
