# Challenge Portal (Frontend-only)

Playful wellness platform with challenges, progress, community, teams, and a fun steps arena. Local-first, no backend.

## Run locally

- npm install
- npm run dev

## Production build

- npm run build
- npm run preview

## Deploy options

- Netlify: uses `netlify.toml` (SPA redirects, cache headers). Set build command `npm run build`, publish `dist/`.
- Vercel: `vercel.json` rewrites all routes to `index.html`.
- GitHub Pages: run `npm run build` then serve `dist/`; `postbuild` copies `404.html` for SPA fallback.
- Docker (Nginx):
  - docker build -t challenge-portal .
  - docker run -p 8080:80 challenge-portal
  - open http://localhost:8080

## Features

- Challenges with categories
- Progress Playground with emoji calendar, badges, animations
- Community Board with emoji avatars, flair generator, reactions, search/sort, reset demo
- Teams Studio with silly name/chant generators, color themes, search/sort, invite links, auto-join
- Footsteps Arena with WebAudio blips and fanfare
- Leaderboard of Good Vibes
- Party Mode and onboarding flow
- PWA basics (manifest + service worker)

## Privacy

LocalStorage only; no server or account needed.
