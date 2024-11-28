import React, { useState } from "react";
import "../styles/reviews.css";

const Reviews = ({ username }) => {
    const [reviews, setReviews] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [message, setMessage] = useState("");

    const fetchUserReviews = async () => {
        const username = localStorage.getItem('username');

        if (!username) {
            setErrorMessage('You must log in to view your reviews.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/reviews/user/${username}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch user reviews: ${response.status}`);
            }
            const data = await response.json();
            setReviews(data);
            setMessage('Your reviews are displayed below.');
        } catch (error) {
            console.error('Error fetching user reviews:', error.message);
            setErrorMessage(error.message);
        }
};

    const fetchAllReviews = async () => {
        setErrorMessage("");
        setMessage("");

        try {
        const response = await fetch("http://localhost:5000/api/reviews/all");
        if (!response.ok) {
            throw new Error(`Failed to fetch all reviews: ${response.status}`);
        }
        const data = await response.json();
        setReviews(data);
        setMessage("All reviews are displayed below.");
        } catch (error) {
        console.error("Error fetching all reviews:", error.message);
        setErrorMessage(error.message);
        }
    };

    return (
        <div className="reviews-container">
        <h1>Reviews</h1>
        <div className="button-group">
            <button className="reviews-btn" onClick={fetchUserReviews}>
            View Your Reviews
            </button>
            <button className="reviews-btn" onClick={fetchAllReviews}>
            View All Reviews
            </button>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {message && <p className="success-message">{message}</p>}

        <div className="reviews-list">
        {reviews.length > 0 ? (
            reviews.map((review, index) => (
                <div key={index} className="review-item">
                <h3>{review.movieTitle}</h3>
                <p><strong>Release Date:</strong> {review.releaseDate}</p>
                <p><strong>Rating:</strong> {review.rating}/5</p>
                <p><strong>Review:</strong> {review.reviewText}</p>
                <p><strong>Posted By:</strong> {review.username}</p>
                <p><strong>Date Posted:</strong> {review.datePosted}</p>
                </div>
            ))
            ) : (
            <p>No reviews to display.</p>
            )}

        </div>
    </div>
  );
};

export default Reviews;
