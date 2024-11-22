const express = require('express');
const cors = require('cors'); 
const app = express();
const userRoutes = require('./routes/userRoutes'); 

app.use(express.json()); 
app.use(cors()); 

// routes
app.use('/api/users', userRoutes); 

// start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
