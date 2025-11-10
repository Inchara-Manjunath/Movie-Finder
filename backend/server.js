require('dotenv').config();
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const TMDB_KEY = process.env.TMDB_API_KEY;

// =======================
// CORS Configuration
// =======================
const FRONTEND_URLS = [
  'http://localhost:5173',
  'https://movie-finder-dnav-iozwq0v74-inchara-manjunaths-projects.vercel.app',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || FRONTEND_URLS.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());

// =======================
// Data Storage (ZIP codes)
// =======================
const DATA_FILE = path.join(__dirname, 'data.json');
let store = { zipCodes: {} };

try {
  if (fs.existsSync(DATA_FILE)) {
    store = JSON.parse(fs.readFileSync(DATA_FILE));
  }
} catch (err) {
  console.warn('Failed to read data file:', err);
}

function saveStore() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
  } catch (err) {
    console.warn('Failed to write data file:', err);
  }
}

// =======================
// Helper: TMDb Fetch
// =======================
async function tmdbFetch(pathSuffix) {
  const url = pathSuffix.includes('?')
    ? `https://api.themoviedb.org/3${pathSuffix}&api_key=${TMDB_KEY}`
    : `https://api.themoviedb.org/3${pathSuffix}?api_key=${TMDB_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDb fetch failed: ${res.status} ${res.statusText}`);
  return res.json();
}

// =======================
// Routes
// =======================

// Movie rows: trending, popular, top_rated, now_playing
app.get('/api/row/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const page = req.query.page || 1;
    let suffix;

    switch (type) {
      case 'trending':
        suffix = `/trending/movie/week?language=en-US&page=${page}`;
        break;
      case 'popular':
        suffix = `/movie/popular?language=en-US&page=${page}`;
        break;
      case 'top_rated':
        suffix = `/movie/top_rated?language=en-US&page=${page}`;
        break;
      case 'now_playing':
        suffix = `/movie/now_playing?language=en-US&page=${pa_
