require('dotenv').config();
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();  // ✅ Initialize app first

const PORT = process.env.PORT || 4000;
const TMDB_KEY = process.env.TMDB_API_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || '*';

// CORS setup
const corsOptions = { origin: FRONTEND_URL }
app.use(cors(corsOptions));
app.use(express.json());

// Simple in-memory user prefs (zip code) + optional file persistence
const DATA_FILE = path.join(__dirname, 'data.json');
let store = { zipCodes: {} };
try {
  if (fs.existsSync(DATA_FILE)) {
    store = JSON.parse(fs.readFileSync(DATA_FILE));
  }
} catch (err) { console.warn('Could not read data file', err); }

function saveStore() {
  try { fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2)); } catch (err) { console.warn('Could not write data file', err); }
}

// Helper: fetch TMDb
async function tmdbFetch(pathSuffix) {
  const url = `https://api.themoviedb.org/3${pathSuffix}&api_key=${TMDB_KEY}`;
  const r = await fetch(url);
  return r.json();
}

// Endpoints
// rows: trending, popular, top_rated, now_playing
app.get('/api/row/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const page = req.query.page || 1;
    let suffix = '';
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
        suffix = `/movie/now_playing?language=en-US&page=${page}`;
        break;
      default:
        return res.status(400).json({ error: 'Unknown row type' });
    }
    const data = await tmdbFetch(suffix);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search
app.get('/api/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const page = req.query.page || 1;
    if (!q) return res.json({ results: [] });
    const suffix = `/search/movie?language=en-US&query=${encodeURIComponent(q)}&page=${page}&include_adult=false`;
    const data = await tmdbFetch(suffix);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Movie details
app.get('/api/movie/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const suffix = `/movie/${id}?language=en-US&append_to_response=videos,credits`;
    const data = await tmdbFetch(suffix);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Zip code endpoints: store user's zip by a client-provided id (e.g., simple session id)
app.post('/api/zipcode', (req, res) => {
  try {
    const { clientId, zip } = req.body;
    if (!clientId || !zip) return res.status(400).json({ error: 'clientId and zip required' });
    store.zipCodes[clientId] = { zip, updatedAt: new Date().toISOString() };
    saveStore();
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/zipcode/:clientId', (req, res) => {
  const { clientId } = req.params;
  const entry = store.zipCodes[clientId] || null;
  res.json({ entry });
});

app.listen(PORT, '0.0.0.0', () => console.log(`TMDb proxy & prefs server running on http://localhost:${PORT}`));
