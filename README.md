# eduanmoldeep.github.io

Personal portfolio of **Anmoldeep Singh Arora**, a Salesforce solution engineer working on Agentforce AI agents,
enterprise integrations and FinTech lending journeys.

Live site: https://eduanmoldeep.github.io

## Stack

- [Astro](https://astro.build) static site, deployed to GitHub Pages via `.github/workflows/deploy.yml`
- Self-hosted fonts (Fraunces, Space Grotesk), light/dark theme
- Blog posts in `src/content/blog/` (Markdown/MDX) with RSS and sitemap
- Contact form posts JSON to the Cloudflare Worker in `worker/` (URL in `PUBLIC_CONTACT_ENDPOINT`), which sends mail via Resend. Deploy: set `RESEND_API_KEY`, `TO_EMAIL`, `FROM_EMAIL`, `ALLOWED_ORIGIN` via `npx wrangler secret put` in `worker/`, then `npx wrangler deploy`; blog comments use Cusdis (`PUBLIC_CUSDIS_*`)

## Editing content

Most homepage content lives in data arrays at the top of `src/pages/index.astro`:

| Array            | Section                                   |
| :--------------- | :---------------------------------------- |
| `proofStats`     | Hero "Results in production" card         |
| `services`       | "Problems I solve"                        |
| `caseStudies`    | Case studies (challenge → approach → result) |
| `process`        | "How I work"                              |
| `skillGroups`    | Skills by capability                      |
| `certifications` | Certifications grid (counts update automatically) |

Profile links (LinkedIn, Trailblazer) and the site description are in `src/consts.ts`.

## Commands

| Command           | Action                                  |
| :---------------- | :-------------------------------------- |
| `npm install`     | Install dependencies                    |
| `npm run dev`     | Start the dev server at `localhost:4321` |
| `npm run build`   | Build the production site to `./dist/`  |
| `npm run preview` | Preview the build locally               |
