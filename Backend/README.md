# CyberEscape Backend — MERN
Production-oriented Express/MongoDB API for a Digital Safety Escape Room.

## Features
JWT auth, bcrypt password hashing, Helmet, CORS, rate limiting, MongoDB/Mongoose, 5 levels, secure question delivery (answers hidden until submission), sessions, scoring, explanations, badges, weak-topic analytics, leaderboard, health endpoint.

## Run
1. `npm install`
2. Copy `.env.example` to `.env` and configure MongoDB/JWT secret.
3. `npm run seed`
4. `npm run dev`
5. API: `http://localhost:5000/api/health`

## Main endpoints
POST `/api/auth/register`, POST `/api/auth/login`, GET `/api/auth/me`
GET `/api/game/levels`, GET `/api/game/questions/:level`, POST `/api/game/sessions`, POST `/api/game/sessions/:id/submit`
GET `/api/analytics/me`, GET `/api/leaderboard`

The frontend sends `Authorization: Bearer <token>`.
