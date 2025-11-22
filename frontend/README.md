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

The Today page reads the most recent row from a `journal_entries` table and shows a green **DB Connected** badge when the `/api/db-check` route can connect to your database. To try the full flow locally:

1. Install dependencies (includes `pg` for PostgreSQL):

   ```bash
   npm install
   ```

2. Create a `.env.local` file at the project root with your database connection string:

   ```bash
   DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<database>
   ```

3. Create the table the Today page expects and seed a sample log entry:

   ```sql
   CREATE TABLE IF NOT EXISTS journal_entries (
     id SERIAL PRIMARY KEY,
     title TEXT,
     content TEXT NOT NULL,
     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
   );

   INSERT INTO journal_entries (title, content)
   VALUES ('First day with LogMe', 'Kicked the tires on the dashboard and DB connectivity.');
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000. You should see **DB Connected** in the top-right badge and the seeded log under **Latest work log**. If the table is empty you will see an empty-state message instead.

### What’s wired up today

- **DB connectivity check:** `/api/db-check` runs `SELECT 1` against the pool created from `DATABASE_URL`.
- **Latest work log:** `/api/today` returns the newest row from `journal_entries` for the Today page.
- **UI interactions:** Mood selection, schedule, highlights, and the quick-note textarea are front-end only; saving notes or moods would require adding new API routes and tables similar to `journal_entries`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
