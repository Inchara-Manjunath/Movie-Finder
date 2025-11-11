import dotenv from "dotenv";
dotenv.config();

import express, { json } from "express";
import cors from "cors";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

// ✅ CORS setup
const envOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
];
const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));
const permissiveDomainSuffixes = ['.netlify.app'];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (mobile apps, curl) or whitelisted origins
    const isExplicitlyAllowed = origin && allowedOrigins.includes(origin);
    const isPermissiveDomain = origin && permissiveDomainSuffixes.some(sfx => origin.endsWith(sfx));
    if (!origin || isExplicitlyAllowed || isPermissiveDomain) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: false,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(json());

// ✅ Environment variables
const PORT = process.env.PORT || 4000;
const TMDB_KEY = process.env.TMDB_API_KEY;

if (!TMDB_KEY) {
  console.error('❌ Missing TMDB_API_KEY in environment');
  process.exit(1);
}

// ✅ Simple in-memory data store
const DATA_FILE = join(__dirname, 'data.json');
let store = { zipCodes: {} };
try {
  if (existsSync(DATA_FILE)) {
    store = JSON.parse(readFileSync(DATA_FILE));
  }
} catch (err) {
  console.warn('⚠️ Could not read data file', err);
}

function saveStore() {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
  } catch (err) {
    console.warn('⚠️ Could not write data file', err);
  }
}

// ✅ Helper: fetch TMDb
async function tmdbFetch(pathSuffix) {
  // If pathSuffix already has ?, add &api_key=, else ?api_key=
  const connector = pathSuffix.includes('?') ? '&' : '?';
  const url = `https://api.themoviedb.org/3${pathSuffix}${connector}api_key=${TMDB_KEY}`;
  const r = await fetch(url);
  return r.json();
}

// ✅ Endpoints
// rows: trending, popular, top_rated, now_playing
async function handleRow(req, res) {
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
}

app.get('/api/row/:type', handleRow);

// ✅ Search endpoint
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

// ✅ Movie details
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

// ✅ Zip code endpoints
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

// ✅ Server start
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 TMDb proxy & prefs server running on http://localhost:${PORT}`);
});
