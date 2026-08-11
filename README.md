# Shanta's Birthday

A single-page birthday surprise for Shanta — one continuous scroll experience with a maroon/rose theme, a countdown, memories, reasons, and a wish wall.

## Tech Stack

- **Client**: React + Vite + Tailwind CSS v4 + Framer Motion
- **Server**: Node.js + Express + MongoDB Atlas (wishes stored in MongoDB)
- **Monorepo**: npm workspaces (`client/`, `server/`)

## Prerequisites

- Node.js 18 or newer

## Setup

```bash
# 1. Install all workspace dependencies
npm install

# 2. Configure the environment (copy the example, then fill in the values — see sections below)
cp .env.example .env
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
│   │   ├── data/        # memories.js, reasons.js, birthday.js (edit the content here)
│   │   ├── assets/      # photos (shanta.jpg, memories/*.jpg)
│   │   ├── pages/       # Home, ComingSoon, AdminWishes (secret)
│   │   └── index.css    # theme tokens (Tailwind v4 @theme)
│   ├── public/          # favicon, media (voice note, video)
│   └── dist/            # production build (generated, gitignored)
└── server/              # Express server
    ├── src/index.js     # static serving + /api/wish + /api/admin/wishes + /api/settings/birthday + SPA fallback
    └── package.json     # deps: express, mongoose, dotenv, cors
```

## Editing Content

- **Memories**: `client/src/data/memories.js` — set `FEATURED_MEMORY.src` (put photos in `client/src/assets/memories/`) and `caption`.
- **Reasons**: `client/src/data/reasons.js` — exactly 4 cards, each with `icon` and `text`.
- **Birthday / countdown**: `client/src/data/birthday.js` is the *fallback* config (`month` is 0-indexed, `hour`/`minute` optional). The exact moment can be set from the admin page (`/admin-wishes`) — that value is stored in MongoDB and takes priority; the fallback is only used when nothing is saved yet or the DB is unreachable.
- **Theme colors**: `client/src/index.css` (maroon, rose, blush, gold, cream tokens).
- **Audio**: replace files in `client/public/media/` (keep the same filenames).

## Environment Variables

| Variable        | Default   | Description |
| --------------- | --------- | ----------- |
| `PORT`          | `5000`    | Port the server listens on. Render/Railway/Heroku set this automatically. |
| `MONGODB_URI`   | —         | MongoDB Atlas connection string. Required for the wish wall. |
| `ADMIN_PASSWORD`| —         | Password for the secret `/admin-wishes` page. |

### 1. MongoDB Atlas (free tier) — for the wish wall

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up (free).
2. Create a **free (M0) cluster** — picks the region/cloud, then click **Create**.
3. In **Database Access**, add a database user: choose a username + password, and grant **Read and write to any database**. Save these.
4. In **Network Access**, click **Add IP Address** → **Allow access from anywhere** (`0.0.0.0/0`). This is fine for a free-tier personal project.
5. In your cluster, click **Connect** → **Connect your application** → copy the connection string. It looks like:

   ```
   mongodb+srv://<dbUser>:<dbPassword>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   ```

6. Replace `<dbUser>`/`<dbPassword>` with your database user's credentials, and optionally add a database name after the host (e.g. `.../shanta?retryWrites=...`). Put the result in `MONGODB_URI`.

### 2. The secret `/admin-wishes` page

- Visit `https://<your-site>/admin-wishes` and enter `ADMIN_PASSWORD`.
- Once logged in, it shows every wish, newest first, with a Bengali-formatted timestamp and a **↻ রিফ্রেশ** button to reload the list without re-entering the password.
- The **জন্মদিনের সময় সেট করো** card lets you pick the exact moment the countdown gate opens (saved to MongoDB). If nothing is saved, the static `data/birthday.js` config is used.
- It is **not linked anywhere** in the site's UI — only accessible by typing the URL directly, so Shanta won't stumble on it.

## Deploying (Render)

1. Push this repo to GitHub.
2. Create a new **Web Service** on [render.com](https://render.com) and connect the repo.
3. Set:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: `22`
4. Open the **Environment** tab and add the variables: `MONGODB_URI` and `ADMIN_PASSWORD` (do **not** add `PORT` — Render sets it automatically).
5. Deploy and open the generated `*.onrender.com` URL.
6. Test the wish wall, then visit `https://<your-site>/admin-wishes` with your `ADMIN_PASSWORD` to confirm wishes appear.

## License

Private — personal gift, not for redistribution.
