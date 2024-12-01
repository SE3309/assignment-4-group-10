import React, { useState, useEffect } from "react";
import "../styles/collections.css";

const Collections = () => {
  // Simulated data for collections
  const [collections, setCollections] = useState([]);
  const [newCollectionName, setNewCollectionName] = useState('');

  const createCollection = () => {
    if (newCollectionName.trim()) {
      const newCollection = {
        id: collections.length + 1,
        name: newCollectionName,
        movies: [] // Initially no movies in the collection
      };
      setCollections([...collections, newCollection]);
      setNewCollectionName('');
    }
  };

  const deleteCollection = (collectionId) => {
    setCollections(collections.filter(collection => collection.id !== collectionId));
  };

  const addMovieToCollection = (collectionId, movieId) => {
    const updatedCollections = collections.map(collection => {
      if (collection.id === collectionId) {
        if (!collection.movies.includes(movieId)) {
          collection.movies.push(movieId);
        }
      }
      return collection;
    });
    setCollections(updatedCollections);
  };

  const removeMovieFromCollection = (collectionId, movieId) => {
    const updatedCollections = collections.map(collection => {
      if (collection.id === collectionId) {
        collection.movies = collection.movies.filter(id => id !== movieId);
      }
      return collection;
    });
    setCollections(updatedCollections);
  };

  return (
    <div className="collections-container">
      <h1>Your Collections</h1>
      <input
        type="text"
        placeholder="New Collection Name"
        value={newCollectionName}
        onChange={(e) => setNewCollectionName(e.target.value)}
        className="collection-input"
      />
      <button onClick={createCollection} className="create-button">
        Create Collection
      </button>
      <ul className="collection-list">
        {collections.map((collection) => (
          <li key={collection.id} className="collection-item">
            <h3>{collection.name}</h3>
            <ul>
              {collection.movies.length > 0 ? (
                collection.movies.map(movieId => (
                  <li key={movieId}>Movie {movieId}
                    <button
                      className="remove-movie-button"
                      onClick={() => removeMovieFromCollection(collection.id, movieId)}
                    >
                      Remove from Collection
                    </button>
                  </li>
                ))
              ) : (
                <li>No movies in this collection</li>
              )}
            </ul>
            <button
              className="delete-button"
              onClick={() => deleteCollection(collection.id)}
            >
              Delete Collection
            </button>
            {/* Example of adding a movie to the collection */}
            <button
              className="add-movie-button"
              onClick={() => addMovieToCollection(collection.id, 1)} // For demonstration, adding movie ID 1
            >
              Add Movie to Collection
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Collections;
