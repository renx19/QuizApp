const express = require('express');
const path = require('path');
const https = require('https');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ===== Environment variables =====
const FRONTEND_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:5173',
];
const KEEP_ALIVE_URL = process.env.KEEP_ALIVE_URL || '';
const PORT = process.env.PORT || 3000;

// ===== Enable CORS =====
app.use(
  cors({
    origin: FRONTEND_ORIGINS,
    credentials: true,
  })
);

// ===== Keep-alive ping to prevent idling =====
if (KEEP_ALIVE_URL) {
  const keepAlive = () => {
    https
      .get(KEEP_ALIVE_URL, (res) => {
        console.log('Keep-alive ping successful', res.statusCode);
      })
      .on('error', (e) => {
        console.error('Keep-alive ping failed', e);
      });
  };

  setInterval(keepAlive, 5 * 60 * 1000);
}

// ===== API root =====
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Quiz App API!',
    status: 'API is running',
  });
});

// ===== Serve static JSON files =====
const JSON_DIR = process.env.JSON_DIR || path.join(__dirname, 'json');
app.use('/data', express.static(JSON_DIR));

// ===== Questions endpoint =====
app.get('/questions', (req, res) => {
  const subject = req.query.subject;

  const subjects = {
    'Clinical Chemistry': 'ClinicalChemistry.json',
    'Clinical Microscopy': 'ClinicalMicroscopy.json',
    IBSS: 'IBSS.json',
    Hematology: 'Hematology.json',
    'Medtech Laws': 'MedtechLaws.json',
    Microbiology: 'Microbiology.json',
  };

  const fileName = subjects[subject];

  if (!fileName) {
    return res.status(404).json({ error: 'Subject not found' });
  }

  const filePath = path.join(JSON_DIR, fileName);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to load questions' });
    }
  });
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
