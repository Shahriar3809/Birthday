# Shanta's Birthday

A single-page birthday surprise for Shanta — one continuous scroll experience with a maroon/rose theme, a countdown, memories, reasons, and a wish wall.

## Tech Stack

- **Client**: React + Vite + Tailwind CSS v4 + Framer Motion
- **Server**: Node.js + Express (serves the built client and the `/api/wish` endpoint)
- **Monorepo**: npm workspaces (`client/`, `server/`)

## Prerequisites

- Node.js 18 or newer

## Setup

```bash
# 1. Install all workspace dependencies
npm install

# 2. Configure the environment (optional — PORT defaults to 5000)
cp .env.example .env   # then edit if you want a different port
```

## Running Locally

```bash
# Development mode (client on Vite dev server + API on Express, both with hot reload)
npm run dev

# Client only
npm run client

# Server only (serves API on http://localhost:5000)
npm run server
```

## Production

```bash
# Build the client (outputs to client/dist)
npm run build

# Start the server (serves the built client + API on the same port)
npm start
```

Open http://localhost:5000 — the production server serves both the app and the API.

## Project Structure

```
shanta-birthday/
├── client/              # React app (Vite)
│   ├── src/
│   │   ├── components/  # UI components (Hero, Countdown, Memories, Reasons, ...)
│   │   ├── data/        # memories.js, reasons.js (edit the content here)
│   │   ├── assets/      # photos (shanta.jpg, memories/*.jpg)
│   │   └── index.css    # theme tokens (Tailwind v4 @theme)
│   ├── public/          # favicon, media (music, voice note)
│   └── dist/            # production build (generated, gitignored)
└── server/              # Express server
    ├── src/index.js     # static serving + /api/wish + SPA fallback
    └── wishes.json      # saved wishes (runtime data, gitignored)
```

## Editing Content

- **Memories**: `client/src/data/memories.js` — set `FEATURED_MEMORY.src` (put photos in `client/src/assets/memories/`) and `caption`.
- **Reasons**: `client/src/data/reasons.js` — exactly 4 cards, each with `icon` and `text`.
- **Theme colors**: `client/src/index.css` (maroon, rose, blush, gold, cream tokens).
- **Audio**: replace files in `client/public/media/` (keep the same filenames).

## Environment Variables

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `PORT`   | `5000`  | Port the server listens on. Render/Railway/Heroku set this automatically. |

## Deploying (Render)

1. Push this repo to GitHub.
2. Create a new **Web Service** on [render.com](https://render.com) and connect the repo.
3. Set:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: `22`
4. Deploy and open the generated `*.onrender.com` URL.

## License

Private — personal gift, not for redistribution.
