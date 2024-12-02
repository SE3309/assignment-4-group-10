import React, { useState, useEffect } from "react";
import "../styles/collections.css";

const Collections = () => {
  const [collections, setCollections] = useState([]); // Stores all user collections
  const [movies, setMovies] = useState([]); // Stores movies fetched from the database
  const [newCollectionName, setNewCollectionName] = useState(""); // For creating new collections
  const [selectedCollection, setSelectedCollection] = useState(null); // Tracks which collection is selected for adding movies

  // Fetch movies from the database
  useEffect(() => {
    fetch("/api/collections") // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  // Add a new collection
  const addCollection = () => {
    if (newCollectionName.trim() === "") {
      alert("Collection name cannot be empty.");
      return;
    }
    if (collections.some((col) => col.name === newCollectionName)) {
      alert("Collection name already exists.");
      return;
    }
    const newCollection = { name: newCollectionName, movies: [] };
    setCollections([...collections, newCollection]);
    setNewCollectionName("");
  };

  // Add a movie to a selected collection
  const addMovieToCollection = (movie) => {
    const updatedCollections = collections.map((collection) =>
      collection.name === selectedCollection
        ? { ...collection, movies: [...collection.movies, movie] }
        : collection
    );
    setCollections(updatedCollections);
    setSelectedCollection(null); // Close the movie list after adding
  };

  // Delete a collection
  const deleteCollection = (collectionName) => {
    setCollections(collections.filter((collection) => collection.name !== collectionName));
  };

  return (
    <div>
      <h2>Your Collections</h2>
      {/* Form to Create a New Collection */}
      <div>
        <input
          type="text"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          placeholder="New Collection Name"
        />
        <button onClick={addCollection}>Create Collection</button>
      </div>

      {/* List of Collections */}
      {collections.map((collection) => (
        <div key={collection.name}>
          <h3>{collection.name}</h3>
          <p>
            {collection.movies.length === 0
              ? "No movies in this collection."
              : collection.movies.map((movie) => movie.title).join(", ")}
          </p>
          <button onClick={() => deleteCollection(collection.name)}>Delete Collection</button>
          <button onClick={() => setSelectedCollection(collection.name)}>Add Movie to Collection</button>
        </div>
      ))}

      {/* Modal/List to Add Movies to a Selected Collection */}
      {selectedCollection && (
        <div>
          <h3>Add Movies to {selectedCollection}</h3>
          <div style={{ height: "300px", overflowY: "scroll" }}>
            {movies.map((movie) => (
              <div key={movie.id}>
                <span>{movie.title}</span>
                <button onClick={() => addMovieToCollection(movie)}>Add</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Collections;
