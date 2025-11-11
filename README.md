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

---
Output images:
**Home**
<img width="1875" height="909" alt="Screenshot 2025-11-10 195900" src="https://github.com/user-attachments/assets/4a6c2191-c2dd-4e58-bd91-a69d6841941a" />

**searched result**
<img width="1889" height="914" alt="Screenshot 2025-11-10 195832" src="https://github.com/user-attachments/assets/b00e9cc6-fd1c-4c5b-92d3-7eba2f446ffe" />

**liked**
<img width="1884" height="889" alt="Screenshot 2025-11-10 195942" src="https://github.com/user-attachments/assets/39cdafd6-d638-42cc-9a7b-65b1017fa13e" />

---

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



