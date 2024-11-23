// import React from 'react';

// const RateMovie = () => {
//   return (
//     <div>
//       <h1>Welcome to Rating!</h1>
//       <p>yay!</p>
//     </div>
//   );
// };

// export default RateMovie;



// import React, { useState } from "react";
// import "../styles/rateMovie.css";

// const RateMovie = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [movieResults, setMovieResults] = useState([]);
//   const [selectedMovie, setSelectedMovie] = useState(null);

//   const handleSearch = () => {
//     // Mock movie search
//     const movies = [
//       { title: "Inception", releaseDate: "2010-07-16" },
//       { title: "Interstellar", releaseDate: "2014-11-07" },
//     ];
//     const filtered = movies.filter((movie) =>
//       movie.title.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     setMovieResults(filtered);
//   };

//   const handleSelectMovie = (movie) => {
//     setSelectedMovie({
//       title: movie.title,
//       releaseDate: movie.releaseDate,
//       duration: "148 mins",
//       genre: "Sci-Fi",
//       synopsis:
//         "A mind-bending thriller where dreams are explored and manipulated.",
//     });
//   };

//   return (
//     <div className="rate-movie-container">
//       <h1>RATE A MOVIE</h1>
//       <div className="search-section">
//         <input
//           type="text"
//           className="search-input"
//           placeholder="Movie Name"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <button className="search-btn" onClick={handleSearch}>
//           Search
//         </button>
//       </div>
//       <div className="results-section">
//         {movieResults.map((movie, index) => (
//           <div
//             key={index}
//             className="movie-result-item"
//             onClick={() => handleSelectMovie(movie)}
//           >
//             {movie.title} ({movie.releaseDate})
//           </div>
//         ))}
//       </div>
//       {selectedMovie && (
//         <div className="movie-details">
//           <h2>{selectedMovie.title}</h2>
//           <p>
//             <strong>Release Date:</strong> {selectedMovie.releaseDate}
//           </p>
//           <p>
//             <strong>Duration:</strong> {selectedMovie.duration}
//           </p>
//           <p>
//             <strong>Genre:</strong> {selectedMovie.genre}
//           </p>
//           <p>
//             <strong>Synopsis:</strong> {selectedMovie.synopsis}
//           </p>
//           <div className="review-section">
//             <label>
//               Rate Movie:
//               <select className="rating-dropdown">
//                 <option value="">Select</option>
//                 {[1, 2, 3, 4, 5].map((rating) => (
//                   <option key={rating} value={rating}>
//                     {rating}
//                   </option>
//                 ))}
//               </select>
//             </label>
//             <textarea
//               className="review-text"
//               placeholder="Write your review..."
//             ></textarea>
//             <input
//               type="date"
//               className="review-date"
//               placeholder="Enter date"
//             />
//             <button className="submit-review-btn">Submit Rating</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RateMovie;

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
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch movies from the database based on the search query
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
  

  // Select a movie and fetch its details
  const handleSelectMovie = async (movie) => {
    try {
        // Format releaseDate to 'YYYY-MM-DD'
        const formattedDate = new Date(movie.releaseDate).toISOString().split('T')[0];

        const response = await fetch(
            `http://localhost:5000/api/movies/details?title=${encodeURIComponent(
                movie.title
            )}&releaseDate=${encodeURIComponent(formattedDate)}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch movie details');
        }

        const movieDetails = await response.json();
        setSelectedMovie(movieDetails); // Update state with movie details
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
};


  // Submit a rating and review

  const handleSubmitReview = async () => {
    const username = localStorage.getItem('username'); // Retrieve the logged-in username

    if (!username) {
        alert('You must be logged in to submit a review.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
            throw new Error(errorData.message || 'Failed to submit the review');
        }

        const result = await response.json();
        console.log(result.message);
        alert('Review submitted successfully!');
    } catch (error) {
        console.error('Error submitting review:', error.message);
        alert('Failed to submit the review.');
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
            {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default RateMovie;
