# 🎬Movie Finder — Netflix-Style

A **Netflix-style movie web application** that uses **TMDb API** to fetch live movie data. Includes **search**, **wishlist**, and **liked movies** functionality. Built with **React + Vite** frontend and **Node.js + Express** backend.

---

## **Features**

- Netflix-style movie rows: **Trending, Popular, Top Rated, Now Playing**  
- Search movies by name  
- Add movies to **Wishlist** or **Liked** lists  
- Persistent wishlist/liked using **localStorage**  
- Movie detail modal with poster, overview, runtime, and rating  
- Responsive design and hover effects  

---

## **Tech Stack**

- **Frontend:** React.js, Vite, CSS  
- **Backend:** Node.js, Express, TMDb API  
- **Storage:** LocalStorage (wishlist & liked movies)  
- **Deployment:** Vercel (frontend), Render (backend)  



## **Setup Instructions (Development)**

```bash
#backend
cd backend
cp .env.example .env
# Add your TMDb API key in .env
npm install
npm run dev

#frontend
cd ../frontend
npm install
npm run dev

Environment Variables
Backend .env
TMDB_API_KEY=your_tmdb_api_key_here
PORT=4000
FRONTEND_URL= // your frontend url after deploying on netlify

Frontend .env
VITE_BACKEND_URL= // your backend code after deploying on render



