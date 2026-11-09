# Incodet website

Source for [incodet.com](https://incodet.com): booking websites, AI chatbots, 24/7 AI calling agents and custom software for local businesses.

## Stack

- TanStack Start (SSR and server functions), React 19, TypeScript
- Tailwind CSS 4 and shadcn/ui
- Vite 8 and Nitro (config in `vite.config.ts`)
- Supabase: Postgres, magic link login, row level security. Schema in `drizzle/migrations/`
- GSAP ScrollTrigger and Lenis for motion (off on touch screens and with reduced motion)
- bun for packages and scripts, vitest for tests

## Local development

Requirements: [bun](https://bun.sh) and Node.js 20.19+ or 22.12+ (needed by Vite 8).

```sh
git clone https://github.com/Asiff-k/incodet-local-ai-studio.git
cd incodet-local-ai-studio
bun install
bun run dev
```

The dev server runs on http://localhost:8080.

### Environment variables

| File         | Holds                                                                                                                                                              | In git           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| `.env`       | Public values: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`, `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_PROJECT_ID` | Yes              |
| `.env.local` | Secrets: `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, optional `RESEND_API_KEY`                                                                                    | No (git-ignored) |

Never commit secret keys. Without `RESEND_API_KEY`, booking and contact messages are still saved, and the email step is skipped.

### Scripts

| Command           | What it does                       |
| ----------------- | ---------------------------------- |
| `bun run dev`     | Start the dev server               |
| `bun run build`   | Production build into `.output/`   |
| `bun run preview` | Serve the production build locally |
| `bun run test`    | Run the tests once                 |
| `bun run lint`    | ESLint and Prettier checks         |
| `bun run format`  | Format all files with Prettier     |

## Project structure

| Path                         | Contents                                                               |
| ---------------------------- | ---------------------------------------------------------------------- |
| `src/config/site.ts`         | Contact details, socials, team locations. The only place these live    |
| `src/config/booking.ts`      | Booking rules (Perth time zone, 30 minute slots, notice and horizon)   |
| `src/config/payments.ts`     | Payment details shown in the client portal                             |
| `src/content/`               | Services, case studies, industries, plans, FAQ, process, deck, reviews |
| `src/routes/`                | Pages. Portal dashboard and admin live under `_authenticated/`         |
| `src/lib/*.functions.ts`     | Server functions (booking, contact, portal)                            |
| `src/integrations/supabase/` | Supabase browser, server and auth clients                              |
| `drizzle/migrations/`        | Database schema, applied in order                                      |
| `docs/`                      | Launch guide and build status                                          |

## Database changes

Add a new numbered SQL file in `drizzle/migrations/` and apply it to Supabase. Never edit a migration that has already been applied.

## Git workflow

- Work on a branch, never directly on `main`
- Run `bun run test` and `bun run build` before committing
- Open a pull request into `main` on GitHub. Vercel deploys `main` to production

## Deploy on Vercel

1. Import the GitHub repository in Vercel. Framework preset: Other
2. Install command `bun install`, build command `bun run build`
3. Add environment variables for Production and Preview:
   - `NITRO_PRESET=vercel` (the build targets Cloudflare by default; this switches it to Vercel)
   - All values from `.env` and `.env.local` above
4. Deploy. To test the Vercel build locally first: `NITRO_PRESET=vercel bun run build` creates `.vercel/output`

Full launch steps, including the domain switch, are in [docs/launch-guide.md](docs/launch-guide.md).
