This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Using LogMe with your PostgreSQL database

The app now isolates each user into their own directory under `/u/<username>/...`, with authentication handled via bcrypt-hashed passwords and JWTs stored in HttpOnly cookies. To run locally:

1. Install dependencies (includes `pg`, `bcrypt`, and `jsonwebtoken`). Installation may require VPN/registry access if your network blocks npm: `npm install`.
2. Create a `.env.local` file at the project root with:

   ```bash
   DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<database>
   JWT_SECRET=your-long-random-secret
   ```

3. Create the required tables:

   ```sql
   CREATE TABLE IF NOT EXISTS users (
     id SERIAL PRIMARY KEY,
     email TEXT UNIQUE NOT NULL,
     username TEXT UNIQUE NOT NULL,
     password_hash TEXT NOT NULL,
     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );

   CREATE TABLE IF NOT EXISTS journal_entries (
     id SERIAL PRIMARY KEY,
     user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     title TEXT,
     content TEXT NOT NULL,
     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 and sign up. On successful signup or login the API sets a JWT cookie and redirects you to `/u/<username>/today`, where `/api/today` returns only your latest `journal_entries` row.

### What’s wired up today

- **Authentication:** `/api/signup` and `/api/login` create bcrypt hashes, issue JWTs (`JWT_SECRET`), and set HttpOnly cookies.
- **Authorization:** `/u/[username]/*` routes check the JWT and redirect if the cookie is missing, invalid, or mismatched with the URL segment.
- **User-scoped data:** `/api/today` filters `journal_entries` by the authenticated `user_id`, ensuring isolation between users.
- **DB connectivity check:** `/api/db-check` still runs `SELECT 1` against the pool created from `DATABASE_URL`.
- **UI interactions:** Mood selection, schedule, highlights, and the quick-note textarea are front-end only; persist them by adding additional authenticated APIs.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
