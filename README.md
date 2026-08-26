# DowIT frontend

A dependency-free, responsive frontend for the Express API in the sibling project.

1. Start the API: `npm run dev` (it uses port 5000 by default).
2. Serve this folder with any static server, for example: `npx serve frontend`.
3. If the API runs elsewhere, change `API_BASE` in `js/api.js`.

The app stores the JWT only in `localStorage` and uses the documented `/api` routes for authentication, articles, profile, memberships, and post management.
