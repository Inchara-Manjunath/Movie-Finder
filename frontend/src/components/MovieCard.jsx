import React, { useState, useEffect } from 'react'
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w342'

export default function MovieCard({ movie, onClick }) {
  const poster = movie.poster_path ? IMAGE_BASE + movie.poster_path : null

  const [liked, setLiked] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)

  useEffect(() => {
    const likes = JSON.parse(localStorage.getItem('likedMovies') || '[]')
    const wishlist = JSON.parse(localStorage.getItem('wishlistMovies') || '[]')
    setLiked(likes.includes(movie.id))
    setWishlisted(wishlist.includes(movie.id))
  }, [movie.id])

  function toggleLike() {
    const likes = JSON.parse(localStorage.getItem('likedMovies') || '[]')
    if (liked) localStorage.setItem('likedMovies', JSON.stringify(likes.filter(id => id !== movie.id)))
    else localStorage.setItem('likedMovies', JSON.stringify([...likes, movie.id]))
    setLiked(!liked)
  }

  function toggleWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlistMovies') || '[]')
    if (wishlisted) localStorage.setItem('wishlistMovies', JSON.stringify(wishlist.filter(id => id !== movie.id)))
    else localStorage.setItem('wishlistMovies', JSON.stringify([...wishlist, movie.id]))
    setWishlisted(!wishlisted)
  }

  return (
    <div className="card" onClick={onClick} title={movie.title}>
      {poster ? <img src={poster} alt={movie.title}/> : <div className="no-poster">No Image</div>}

      <div className="card-hover">
        <div className="title">{movie.title}</div>
        <div className="rating">⭐ {movie.vote_average}</div>
        <div className="card-buttons">
          <button onClick={e => { e.stopPropagation(); toggleWishlist() }}>
            {wishlisted ? '★' : '☆'}
          </button>
          <button onClick={e => { e.stopPropagation(); toggleLike() }}>
            {liked ? '👍' : '👎'}
          </button>
        </div>
      </div>
    </div>
  )
}
