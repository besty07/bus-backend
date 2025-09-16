// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());
// Serve static files (driver.html, user.html, any client assets)
app.use(express.static(__dirname));

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ driver: null }, null, 2));
}

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return { driver: null };
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Endpoint driver calls to update location
app.post('/location', (req, res) => {
  const { lat, lng, heading, speed } = req.body;
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: 'lat and lng must be numbers' });
  }

  const data = readData();
  data.driver = {
    lat,
    lng,
    heading: heading || null,
    speed: speed || null,
    updatedAt: new Date().toISOString(),
  };
  writeData(data);
  return res.json({ ok: true });
});

// Endpoint user calls to get latest driver location
app.get('/location', (req, res) => {
  const data = readData();
  res.json(data.driver || null);
});

// Optional: health
app.get('/health', (req, res) => res.send('ok'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
