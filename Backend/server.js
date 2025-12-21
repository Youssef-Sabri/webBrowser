const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

app.use(cors());
const helmet = require('helmet');
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.get('/api/suggestions', async (req, res) => {
  const { q, engine } = req.query;
  if (!q) return res.json([]);

  const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(q)}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Proxy Error:', err);
    res.json([]);
  }
});

app.use('/api', authRoutes);
app.use('/api/user', userRoutes);

app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});