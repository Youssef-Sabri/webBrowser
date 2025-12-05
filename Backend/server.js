const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001; // Runs on a different port than React (3000)

app.use(cors());
app.use(express.json());

// Example API Endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: 'Online', message: 'Backend is running!' });
});

app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});