import React, { useEffect, useState } from 'react';
import '../styles/recommendations.css';

const Recommendations = ({ currentUsername }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('Current Username:', currentUsername);

        if (!currentUsername) {
            setError('Username is not defined');
            return;
        }

        fetch(`http://localhost:5000/api/recommendations/${currentUsername}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error fetching recommendations: ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                setRecommendations(data);
            })
            .catch((err) => {
                console.error('Fetch error:', err.message);
                setError(err.message);
            });
    }, [currentUsername]);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="recommendations-container">
            <h2 className="recommendations-header">Personalized Recommendations</h2>
            {recommendations.length > 0 ? (
                <ul className="recommendations-list">
                    {recommendations.map((movie, index) => (
                        <li className="recommendation-item" key={index}>
                            <div>
                                <div className="recommendation-title">{movie.title}</div>
                                <div className="recommendation-genre">Release Date: {movie.releaseDate}</div>
                                <div className="recommendation-duration">Duration: {movie.duration} minutes</div>
                                <div className="recommendation-synopsis">{movie.synopsis}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No recommendations available.</p>
            )}
        </div>
    );
};

export default Recommendations;
