# MyAstroReader

Website for MyAstroReader &mdash; astrology consultation booking, live chat, and content
site for consultant Amit Joshi. UI styled after astromanch.com's marketplace look;
content (packages, bio, testimonials, FAQ) sourced from myastroreader.com.

## Stack

- `client/`: React 19 + Vite 6 + Tailwind CSS v4 + React Router 7 + Socket.io client
- `server/`: Express + MySQL (`mysql2`) + JWT auth + Socket.io + Razorpay

## First-time setup

1. Create the database and tables (also seeds real packages/testimonials/FAQ content):

   ```
   mysql -u root -p < server/schema.sql
   ```

2. Copy `server/.env.example` to `server/.env` and fill in:
   - `DB_PASSWORD` for your local MySQL root user
   - `JWT_SECRET` / `ADMIN_PASSWORD` &mdash; any values for local dev
   - `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` &mdash; **required for payments to work**.
     Get free TEST MODE keys at https://dashboard.razorpay.com/app/keys. Without real
     keys, booking checkout and wallet top-up will show a clear "not configured" error
     instead of crashing.

3. Install dependencies:

   ```
   cd server && npm install
   cd client && npm install
   ```

## Running locally

Two terminals:

```
cd server && npm run dev   # http://localhost:5000
cd client && npm run dev   # http://localhost:5173
```

The Vite dev server proxies `/api` and `/socket.io` to the backend, so just open
http://localhost:5173.

## Admin panel

Visit `/admin`, log in with `ADMIN_PASSWORD` from `server/.env`. From there you can
manage bookings, chart/kundli requests, callback requests, enquiries, and edit
testimonials, FAQs, horoscopes, blog posts, packages and the astrologer profile.

## Standalone demo build (for sharing, e.g. with a client)

`client/npm run build:demo` produces a single self-contained HTML file
(`client/dist-demo/index.html`) that runs the **entire app client-side with mock data**
&mdash; no server, no database, no internet required. Just double-click it to open in a
browser. Every page, form, the wallet, live chat and the admin panel all work; booking
payments and wallet top-ups simulate success instead of hitting Razorpay, and chat
replies are scripted (billing still ticks down the wallet, sped up so it's visible in a
short walkthrough). Data resets on refresh since it only lives in memory. A copy is kept
at the project root as `myastroreader-live-demo.html` &mdash; regenerate it with:

```
cd client && npm run build:demo
cp dist-demo/index.html ../myastroreader-live-demo.html
```

## Notes

- Kundli / Kundli Matching / Numerology are **lead-capture forms**, not automated chart
  calculators &mdash; submissions go to the admin panel for Amit to review manually,
  matching how the real business operates.
- Live chat is real (Socket.io) and billed per minute from the logged-in user's wallet.
  "Request Callback" is a phone callback request rather than in-browser voice/video.
- Daily horoscope copy is seeded with placeholder text per zodiac sign &mdash; replace
  it via the admin panel.
- No blog posts are seeded; add some via the admin panel.
