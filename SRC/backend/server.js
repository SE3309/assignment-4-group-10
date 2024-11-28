const express = require('express');
const cors = require('cors'); 
const app = express();
const userRoutes = require('./routes/userRoutes'); 
const movieRoutes = require('./routes/movieRoutes');
const reviewsRoutes = require('./routes/reviewsRoutes');
const viewReviews = require('./routes/viewReviews');

app.use(express.json()); 
app.use(cors()); 

// routes
app.use('/api/users', userRoutes); 
app.use(movieRoutes);
app.use('/api', reviewsRoutes);
app.use('/api/reviews', viewReviews);

// start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

