import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import MovieRow from './components/MovieRow'
import MovieModal from './components/MovieModal'

const ROWS = [
  { key: 'trending', title: 'Trending Now' },
  { key: 'popular', title: 'Popular' },
  { key: 'top_rated', title: 'Top Rated' },
  { key: 'now_playing', title: 'Now Playing' },
]

export default function App() {
  const [selected, setSelected] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [view, setView] = useState('home')

  const [wishlistMovies, setWishlistMovies] = useState([])
  const [likedMovies, setLikedMovies] = useState([])

  const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:4000/api'
    : 'https://movie-finder-xinf.onrender.com/api')


  // Load wishlist and liked IDs from localStorage
  useEffect(() => {
    const wishlistIds = JSON.parse(localStorage.getItem('wishlistMovies') || '[]')
    const likedIds = JSON.parse(localStorage.getItem('likedMovies') || '[]')

    // Fetch full movie data for wishlist
Promise.all(wishlistIds.map(id => fetch(`${API_BASE}/movie/${id}`).then(r => r.json())))
      .then(data => setWishlistMovies(data))
    // Fetch full movie data for liked
Promise.all(likedIds.map(id => fetch(`${API_BASE}/movie/${id}`).then(r => r.json())))
      .then(data => setLikedMovies(data))
  }, [view]) // refresh when view changes

  async function handleSearch(query) {
    if (!query) return
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`)
    const j = await res.json()
    setSearchResults(j.results || [])
    setView('search')
  }

  function showWishlist() { setView('wishlist') }
  function showLiked() { setView('liked') }

  return (
    <div className="app-dark">
      <Header 
        onSearch={handleSearch} 
        onWishlist={showWishlist} 
        onLiked={showLiked} 
      />

      <main>
        {view === 'home' && ROWS.map(r => (
          <MovieRow key={r.key} type={r.key} title={r.title} onSelect={setSelected} />
        ))}

        {view === 'search' && <MovieRow movies={searchResults} title="Search Results" onSelect={setSelected} />}

        {view === 'wishlist' && <MovieRow movies={wishlistMovies} title="Wishlist" onSelect={setSelected} />}

        {view === 'liked' && <MovieRow movies={likedMovies} title="Liked Movies" onSelect={setSelected} />}
      </main>

      {selected && <MovieModal movieId={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
