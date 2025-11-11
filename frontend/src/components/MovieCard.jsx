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

  function toggleLike(e) {
    e.stopPropagation()
    const likes = JSON.parse(localStorage.getItem('likedMovies') || '[]')
    const updated = liked
      ? likes.filter(id => id !== movie.id)
      : [...likes, movie.id]
    localStorage.setItem('likedMovies', JSON.stringify(updated))
    setLiked(!liked)
  }

  function toggleWishlist(e) {
    e.stopPropagation()
    const wishlist = JSON.parse(localStorage.getItem('wishlistMovies') || '[]')
    const updated = wishlisted
      ? wishlist.filter(id => id !== movie.id)
      : [...wishlist, movie.id]
    localStorage.setItem('wishlistMovies', JSON.stringify(updated))
    setWishlisted(!wishlisted)
  }

  return (
    <div
      className="card"
      onClick={onClick}
      role="button"
      tabIndex="0"
      title={movie.title}
    >
      {poster ? (
        <img src={poster} alt={movie.title} />
      ) : (
        <div className="no-poster">No Image</div>
      )}

      <div className="card-hover">
        <div className="title">{movie.title}</div>
        <div className="rating">⭐ {movie.vote_average}</div>
        <div className="card-buttons">
          <button onClick={toggleWishlist}>
            {wishlisted ? '★' : '☆'}
          </button>
          <button onClick={toggleLike}>
            {liked ? '👍' : '👎'}
          </button>
        </div>
      </div>
    </div>
  )
}
