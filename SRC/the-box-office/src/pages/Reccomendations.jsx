import React, { useEffect, useState } from 'react';
import '../styles/recommendations.css';

const Recommendations = ({ userId }) => {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/api/recommendations/${userId}`)
            .then(response => response.json())
            .then(data => setRecommendations(data))
            .catch(error => console.error('Error fetching recommendations:', error));
    }, [userId]);

    return (
        <div className="recommendations-container">
            <h2 className="recommendations-header">Personalized Recommendations</h2>
            <ul className="recommendations-list">
                {recommendations.map(movie => (
                    <li className="recommendation-item" key={movie.id}>
                        <div>
                            <div className="recommendation-title">{movie.title}</div>
                            <div className="recommendation-genre">Genre: {movie.genre}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Recommendations;
