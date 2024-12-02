import React, { useEffect, useState } from 'react';
import "../styles/profile.css";

const BASE_URL = "http://localhost:5000/api/";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: 'John Doe', // Replace with actual user fetching logic if available
    reviews: null,
    watchlist: null,
    collections: null,
    followers: null,
    recommendations: null,
  });
  const [errorMessages, setErrorMessages] = useState({});

  const username = localStorage.getItem("username"); //Retrieves the logged-in username

  useEffect(() => {
    const fetchUserData = async () => {
        const errors = {};

        try {
            // Fetch reviews
            const reviewsResponse = await fetch(`${BASE_URL}reviews/user/${username}`);
            const reviewsData = await reviewsResponse.json();
            if (reviewsResponse.ok && reviewsData.length > 0) {
                userData.reviews = reviewsData;
            } else {
                errors.reviews = "No reviews were found for this user.";
            }

            // Fetch watchlist
            const watchlistResponse = await fetch(`${BASE_URL}watchlist/userwatchlist/${username}`);
            const watchlistData = await watchlistResponse.json();
            if (watchlistResponse.ok && watchlistData.length > 0) {
                userData.watchlist = watchlistData;
            } else {
                errors.watchlist = "No watchlist items were found.";
            }

            // Fetch recommendations
            const recommendationsResponse = await fetch(`${BASE_URL}recommendations/${username}`);
            const recommendationsData = await recommendationsResponse.json();
            if (recommendationsResponse.ok && recommendationsData.length > 0) {
                userData.recommendations = recommendationsData;
            } else {
                errors.recommendations = "No recommendations were found.";
            }

            // Fetch collections
            const collectionsResponse = await fetch(`${BASE_URL}collections/user/${username}`);
            const collectionsData = await collectionsResponse.json();
            if (collectionsResponse.ok && collectionsData.length > 0) {
                userData.collections = collectionsData;
            } else {
                errors.collections = "No collections were found.";
            }

            // Fetch followers
            const followersResponse = await fetch(`${BASE_URL}users/${username}/followers`);
            const followersData = await followersResponse.json();
            if (followersResponse.ok && followersData.length > 0) {
                userData.followers = followersData; // Update followers in state
            } else {
                errors.followers = "No followers were found.";
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            errors.general = "An unexpected error occurred. Please try again later.";
        }

        setUserData({ ...userData });
        setErrorMessages(errors);
    };

    fetchUserData();
}, [username]);


  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>{username}'s Profile</h1>

      {/* Reviews */}
      <section className="reviews-section">
        <h2>Reviews</h2>
        {errorMessages.reviews ? (
          <p className="error-message">{errorMessages.reviews}</p>
        ) : (
          <ul>
            {userData.reviews &&
              userData.reviews.map((review, index) => (
                <li key={index}>
                  <strong>{review.movieTitle}</strong>: {review.reviewText} ({review.rating}/5)
                </li>
              ))}
          </ul>
        )}
      </section>

      {/* Watchlist */}
      <section className="watchlist-section">
        <h2>Watchlist</h2>
        {errorMessages.watchlist ? (
          <p className="error-message">{errorMessages.watchlist}</p>
        ) : (
          <ul>
            {userData.watchlist &&
              userData.watchlist.map((movie, index) => (
                <li key={index}>{movie.movieTitle} ({movie.releaseDate})</li>
              ))}
          </ul>
        )}
      </section>

      {/* Collections */}
      <section className="collections-section">
        <h2>Collections</h2>
        {errorMessages.collections ? (
          <p className="error-message">{errorMessages.collections}</p>
        ) : (
          <ul>
            {userData.collections &&
              userData.collections.map((collection, index) => (
                <li key={index}>{collection.collectionName}</li>
              ))}
          </ul>
        )}
      </section>

      {/* Followers */}
      <section className="followers-section">
    <h2>Followers</h2>
    {errorMessages.followers ? (
        <p className="error-message">{errorMessages.followers}</p>
    ) : (
        <ul>
            {userData.followers &&
                userData.followers.map((follower, index) => (
                    <li key={index}>{follower.followerUsername}</li>
                ))}
        </ul>
    )}
</section>


      {/* Recommendations */}
      <section className="recommendations-section">
        <h2>Recommendations</h2>
        {errorMessages.recommendations ? (
          <p className="error-message">{errorMessages.recommendations}</p>
        ) : (
          <ul>
            {userData.recommendations &&
              userData.recommendations.map((movie, index) => (
                <li key={index}>
                  {movie.title} ({movie.releaseDate})
                  <p>{movie.synopsis}</p>
                </li>
              ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Profile;
