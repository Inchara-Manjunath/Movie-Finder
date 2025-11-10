import React, { useEffect, useState } from 'react'

const IMAGE_BASE = 'https://image.tmdb.org/t/p/original'

export default function MovieModal({ movieId, onClose }){
  const [movie, setMovie] = useState(null)
  useEffect(()=>{ if (!movieId) return; fetch(`/api/movie/${movieId}`).then(r=>r.json()).then(j=>setMovie(j)) }, [movieId])
  if (!movie) return null

  const backdrop = movie.backdrop_path ? IMAGE_BASE + movie.backdrop_path : null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        {backdrop && <div className="backdrop" style={{backgroundImage:`url(${backdrop})`}} />}
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-body">
          <img className="modal-poster" src={movie.poster_path ? 'https://image.tmdb.org/t/p/w342'+movie.poster_path : ''} alt="poster" />
          <div className="modal-info">
            <h2>{movie.title} <span>({movie.release_date?.slice(0,4)})</span></h2>
            <p className="tagline">{movie.tagline}</p>
            <p className="overview">{movie.overview}</p>
            <div className="meta">Runtime: {movie.runtime} min • Rating: {movie.vote_average}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
