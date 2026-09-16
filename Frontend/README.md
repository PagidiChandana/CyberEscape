# CyberEscape Web Client

The React and Vite single-page application for CyberEscape, a digital-safety escape room. It provides registration and login, mission play, answer reviews, badges, personal analytics, and a leaderboard.

## Requirements

- Node.js 18 or later
- A running [CyberEscape API](../Backend/README.md)

## Run locally

Start the backend first, then from the `Frontend` directory run:

```bash
npm install
copy .env.example .env
npm run dev
```

On macOS/Linux, use `cp .env.example .env` instead of `copy`. Open `http://localhost:5173` in your browser.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | Yes | Base URL of the API, including `/api`. |

For local development:

```env
VITE_API_URL=http://localhost:5000/api
```

For a deployment, replace this with the deployed API URL, for example `https://your-api.onrender.com/api`. Because Vite embeds `VITE_*` variables during the build, redeploy after changing this value. Do not put secrets in frontend environment variables.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server on port `5173`. |
| `npm run build` | Create an optimized production build in `dist`. |
| `npm run preview` | Serve the production build locally for verification. |

## API connection and authentication

The client uses Axios to connect to `VITE_API_URL`. After a successful sign-in, the JWT is stored in browser local storage and automatically sent as a Bearer token with protected API requests. A `401` response clears that token and returns the user to the login page.

## Deployment

The included `vercel.json` rewrites all paths to `index.html`, which lets React Router handle direct navigation and refreshes. To deploy on Vercel:

1. Import this repository and set the project root directory to `Frontend`.
2. Add `VITE_API_URL` in the Vercel environment variables.
3. Deploy using the default build command, `npm run build`.

Also add the Vercel site URL to the backend's `CLIENT_URL` environment variable so the API accepts browser requests from the deployed client.

## Troubleshooting: API 404 after deploy

`Failed to load resource: ... 404` with a body like `Route not found: /game/levels` means the app is calling the API host **without** the `/api` prefix. Fix:

1. Vercel → project → Settings → Environment Variables → set `VITE_API_URL` to `https://<your-render-app>.onrender.com/api` (must end with `/api`).
2. Redeploy (Vercel → Deployments → Redeploy) — env changes only apply on rebuild.
3. Render → service → Environment → set `CLIENT_URL` to `https://<your-vercel-app>.vercel.app`, then seed the production database once via Render Shell: `npm run seed`.
4. Open `https://<your-render-app>.onrender.com/api/health` — it must return `"db":"connected"`.
