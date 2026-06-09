# Future Builders

Mobile-first camp management app for the **USM Construction & Design** summer camp. Staff and Chaperones log in, award/deduct points from students, run headcounts, and view a live leaderboard.

## Stack

- **Next.js 14** App Router · TypeScript · Tailwind CSS
- **TypeORM** + **PostgreSQL** (`pg`)
- **NextAuth.js v5** (JWT sessions, credentials provider)
- **bcryptjs** for password hashing

---

## Quick Start

### 1. Prerequisites

- Node.js 18+
- PostgreSQL running locally (or any hosted Postgres)

### 2. Create the database

```bash
createdb futurebuilders
```

### 3. Configure environment

Copy `.env.local` and update values:

```bash
cp .env.local .env.local
```

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/futurebuilders
NEXTAUTH_SECRET=generate-a-random-secret-here
NEXTAUTH_URL=http://localhost:3000
DB_SSL=false   # set true for hosted Postgres (Railway, Render, Supabase, etc.)
```

Generate a secret: `openssl rand -base64 32`

### 4. Install dependencies

```bash
npm install
```

### 5. Seed the database

```bash
npm run seed
```

This creates:
- **Staff:** `staff1`, `staff2` (password: `password123`)
- **Chaperones:** `mike`, `sarah`, `james` (password: `password123`)
- 20 students with group assignments and initial point transactions

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login`.

---

## Features

| Route | Description |
|-------|-------------|
| `/login` | Credentials sign-in |
| `/dashboard` | Give/take points (+1 +2 +5 / −1 −2 −5), 3 transactions/user/day |
| `/headcount` | Tap-to-toggle attendance counter (in-memory, no persistence) |
| `/leaderboard` | Ranked student list, revalidates every 60 s |

### Tab strip (Dashboard & Headcount)
Filter by **All · Girls · Boys · [Chaperone]'s Group**

### Bottom sheet (Dashboard)
Tap any student card → slide-up sheet with point buttons and daily limit indicator.

---

## Project Structure

```
app/
  (auth)/login/         Login page
  (app)/
    layout.tsx          Shell: TopNav + TabStrip
    dashboard/          Give/Take Points (Server + DashboardGrid client)
    headcount/          Headcount tool (HeadcountGrid client)
    leaderboard/        Ranked leaderboard (Server Component)
  api/
    auth/[...nextauth]/ NextAuth handlers
    points/             POST award points, GET remaining transactions
components/
  TopNav.tsx            Fixed top navigation
  TabStripWrapper.tsx   Client wrapper (hides strip on leaderboard)
  TabStrip.tsx          Scrollable filter tabs
  StudentCard.tsx       Card with points badge
  DashboardGrid.tsx     Client grid + sheet state
  PointsSheet.tsx       Bottom sheet modal
  HeadcountGrid.tsx     Toggle grid with live counter
  Toast.tsx             Auto-dismiss toast
lib/
  auth.config.ts        Edge-safe NextAuth config (middleware)
  auth.ts               Full NextAuth config (Node runtime)
  db/
    data-source.ts      TypeORM singleton DataSource
    entities/           User, Student, Point, Group
scripts/
  seed.ts               Database seeder
middleware.ts           Route protection (Edge Runtime)
```

---

## Design System

USM-inspired institutional minimalism — Swiss modular grid, sharp geometry, muted base palette, single warm accent.

| Token | Value |
|-------|-------|
| `--color-bg` | `#F5F4F0` warm off-white |
| `--color-accent` | `#E8562A` USM signal orange |
| `--color-positive` | `#1A6633` points green |
| `--color-negative` | `#842029` points red |
| `--color-gold` | `#D4A017` leaderboard gold |

---

## Production Deployment

1. Set `DB_SSL=true` if your Postgres host requires SSL
2. Set `NEXTAUTH_SECRET` to a strong random value
3. Update `NEXTAUTH_URL` to your production domain
4. Run `npm run build && npm start`
