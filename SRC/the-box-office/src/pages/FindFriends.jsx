import React, { useState } from 'react';
import "../styles/findFriends.css";

const BASE_URL = "http://localhost:5000/api/";

const FindFriends = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a username to search.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}users/search?username=${searchTerm}`);
      const data = await response.json();

      if (response.ok) {
        // Initialize follow state for users
        const usersWithFollowState = data.map((user) => ({
          ...user,
          isFollowing: false, // Assume not following initially; update based on your backend logic
        }));
        setSearchResults(usersWithFollowState);
      } else {
        setError(data.error || "An error occurred while searching for users.");
      }
    } catch (err) {
      console.error("Error searching for users:", err);
      setError("Unable to perform the search. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async (username, isFollowing) => {
    try {
      const endpoint = isFollowing ? "unfollow" : "follow";
      const response = await fetch(`${BASE_URL}users/${endpoint}`, {
        method: isFollowing ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username, // User being followed/unfollowed
          followerUsername: localStorage.getItem("username"), // Current logged-in user
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSearchResults((prevResults) =>
          prevResults.map((user) =>
            user.username === username ? { ...user, isFollowing: !isFollowing } : user
          )
        );
      } else {
        setError(data.error || `Failed to ${isFollowing ? "unfollow" : "follow"} the user.`);
      }
    } catch (err) {
      console.error(`Error trying to ${isFollowing ? "unfollow" : "follow"} user:`, err);
      setError("Unable to complete the action. Please try again later.");
    }
  };

  return (
    <div className="find-friends-container">
      <h1>Find Friends</h1>

      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by username..."
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="search-results">
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((user) => (
              <li key={user.username} className="user-item">
                <span>{user.username}</span>
                <button
                  onClick={() => handleFollowToggle(user.username, user.isFollowing)}
                >
                  {user.isFollowing ? "Unfollow" : "Follow"}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>No users found. Try a different username.</p>
        )}
      </div>
    </div>
  );
};

export default FindFriends;
