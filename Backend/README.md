# CyberEscape API

The Express and MongoDB API for CyberEscape, a digital-safety escape room. It handles authentication, missions, scoring, badges, analytics, and the leaderboard.

## Requirements

- Node.js 18 or later
- MongoDB (local instance or MongoDB Atlas)

## Run locally

From the `Backend` directory:

```bash
npm install
copy .env.example .env
npm run seed
npm run dev
```

On macOS/Linux, use `cp .env.example .env` instead of `copy`. The API starts at `http://localhost:5000`; confirm it with `GET /api/health`.

`npm run seed` creates the five levels of questions. Run it after connecting to an empty database, or whenever you want to refresh the seeded questions.

## Environment variables

Set these values in `.env`. Never commit that file.

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | No | Use `development` locally and `production` when deployed. |
| `PORT` | No | API port; defaults to `5000`. |
| `MONGO_URI` | Yes | MongoDB connection string. |
| `JWT_SECRET` | Yes | Long, random secret used to sign access tokens. |
| `JWT_EXPIRES_IN` | No | Token lifetime; defaults to `7d`. |
| `CLIENT_URL` | Yes in production | Comma-separated list of allowed frontend origins. |

Example:

```env
MONGO_URI=mongodb://127.0.0.1:27017/cyberescape
JWT_SECRET=use_a_long_unique_random_value
CLIENT_URL=http://localhost:5173
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the API with automatic reloads. |
| `npm start` | Start the production server. |
| `npm run seed` | Seed the question collection. |

## API overview

All routes below are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

| Area | Routes |
| --- | --- |
| Health | `GET /health` |
| Authentication | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Game | `GET /game/levels`, `GET /game/questions/:level`, `POST /game/sessions`, `GET /game/sessions/:id`, `POST /game/sessions/:id/submit` |
| Analytics | `GET /analytics/me` |
| Leaderboard | `GET /leaderboard` |

Questions are served without their correct answers. Correct answers and explanations are returned only when a completed session is retrieved or submitted.

## Deployment

`render.yaml` provides a Render web-service configuration. Configure `MONGO_URI` and `CLIENT_URL` in Render, keep the generated `JWT_SECRET`, and set `CLIENT_URL` to the deployed frontend URL. Render runs `npm install`, then `npm start`, and checks `/api/health`.
