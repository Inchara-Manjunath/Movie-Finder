import React, { useState } from 'react'

export default function Header({ onSearch, onWishlist, onLiked }) {
  const [query, setQuery] = useState('')

  function handleSearch(e){
    e.preventDefault()
    if(onSearch && query.trim() !== ''){
      onSearch(query.trim())
      setQuery('')
    }
  }
  

  return (
    <header className="site-header">
      <div className="brand">Movie Finder</div>

      <form onSubmit={handleSearch} className="search-form">
        <input 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
          placeholder="Search movies..." 
        />
        <button type="submit">Search</button>
      </form>

      <div className="header-buttons">
        <button onClick={onWishlist} className="wishlist-btn">★ Wishlist</button>
        <button onClick={onLiked} className="like-btn">👍 Liked</button>
      </div>
    </header>
  )
}
