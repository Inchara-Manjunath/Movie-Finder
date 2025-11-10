import React, { useEffect, useState } from 'react'
import MovieCard from './MovieCard'

export default function MovieRow({ type, title, onSelect, movies: propsMovies }) {
  const [movies, setMovies] = useState([])

  // Set API base URL for development and production
  const API_BASE = import.meta.env.VITE_BACKEND_URL || '/api'

  useEffect(() => {
    if (propsMovies) {
      setMovies(propsMovies)
      return
    }

    let ignore = false

    fetch(`${API_BASE}/row/${type}?page=1`) // fetch from backend
      .then(r => r.json())
      .then(j => {
        if (!ignore) setMovies(j.results || [])
      })
      .catch(err => console.error('Failed to fetch movies:', err))

    return () => { ignore = true }
  }, [type, propsMovies, API_BASE])

  if (!movies || movies.length === 0) return null

  return (
    <section className="row">
      <h2>{title}</h2>
      <div className="row-posters">
        {movies.map(m => (
          <MovieCard key={m.id} movie={m} onClick={() => onSelect(m.id)} />
        ))}
      </div>
    </section>
  )
}
