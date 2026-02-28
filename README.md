# sam-com

Fullstack e-commerce starter built with React (Vite), Node/Express, PostgreSQL, and Google OAuth.

## Stack
- Frontend: React + React Router
- Backend: Node.js + Express + Passport (Google OAuth)
- Database: PostgreSQL
- Auth: Google OAuth + JWT

## Project Structure
- `client`: React app
- `server`: Express API + SQL migrations/seeds

## 1) Setup PostgreSQL
Create a database, for example:

```sql
CREATE DATABASE sam_com;
```

## 2) Backend setup
```bash
cd server
cp .env.example .env
npm install
npm run migrate
npm run seed
npm run dev
```

## 3) Frontend setup
```bash
cd ../client
cp .env.example .env
npm install
npm run dev
```

## OAuth setup (Google)
1. Create OAuth credentials in Google Cloud Console.
2. Add these redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
3. Put values in `server/.env`:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

## Default API base URL
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## Core Features
- Register/login (email/password)
- Google OAuth login
- Product listing
- Cart management
- Checkout/order creation
- Order history
# sam-com
