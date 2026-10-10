# CareLoop: Doctor Appointment App (MERN)

React + Redux + Tailwind frontend, Node + Express + MongoDB backend.

## Features
- Sign up, log in, log out (JWT), validated forms, toast messages
- Light and dark theme (saved in the browser), fully responsive
- After login: dashboard with next appointment, doctor types and doctors
- Search doctors by name, type or illness (e.g. "migraine")
- Services page, hero animation, carousel, FAQ accordion, card hovers
- Book an appointment: doctor type, date, time slot (booked slots are disabled), comments, report upload
- My appointments: cards, filter by year and status, cancel with confirmation
- Profile with photo upload and left sidebar (hamburger menu)
- Unit test with React Testing Library (`npm test`)

## Run locally
Requires Node 18+ and MongoDB running locally (or an Atlas URI).

```bash
# 1. Backend
cd server
cp .env.example .env      # edit MONGO_URI and JWT_SECRET
npm install
npm run dev               # http://localhost:5000 (doctors and services seed automatically)

# 2. Frontend (new terminal)
cd client
npm install
npm run dev               # http://localhost:5173
```

## Deploy
- Backend: Render/Railway/Heroku. Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`. Note: uploaded files live on local disk, so use a persistent disk or cloud storage in production.
- Frontend: Vercel/Netlify, build `npm run build`, output `dist`. Set `VITE_API_URL` and `VITE_FILE_URL` to your backend URL.
- Connect both to your GitHub repo for automatic deploys.
