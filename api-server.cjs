const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/daily-passage', (req, res) => {
  res.json({ message: 'Daily passage endpoint' });
});

app.get('/api/posts', (req, res) => {
  res.json({ message: 'Posts endpoint' });
});

// Add a new route for /api/post
app.get('/api/post', (req, res) => {
  res.json({ message: 'Single post endpoint' });
});

// Add a default route for the root path
app.get('/', (req, res) => {
  res.send('API Server is running.');
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});