# HackWithIndia — BVUDET-NM Chapter

The official website for the HackWithIndia student developer community at Bharati Vidyapeeth (Deemed to be University), Department of Engineering & Technology, Navi Mumbai.

The site introduces the chapter, showcases its events and community, and provides information for students who want to get involved.

## What’s on the site

- **Home** — an interactive, scroll-led introduction to the chapter, its activities, impact, and leadership.
- **About** — the chapter’s story, identity, and community.
- **Events** — event archive, details, and highlights.
- **Team** — chapter team and departments.
- **Faculty mentors** — faculty mentor profiles.
- **Gallery** — photos and moments from the community.
- **Join** — information and a form for prospective members.
- **Tenure pages** — team and chapter information for the 2025 and 2025–26 tenures.

## Built with

- [Next.js](https://nextjs.org/) 16 with the App Router
- [React](https://react.dev/) 19 and [TypeScript](https://www.typescriptlang.org/)
- Custom CSS, with GSAP, Anime.js, Lenis, and HLS.js supporting animation, smooth scrolling, and media experiences

## Getting started

### Prerequisites

Install Node.js and npm. Use a Node.js release supported by the Next.js version specified in `package.json`.

### Install and run

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The development server refreshes as you edit the source.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Serve the production build locally; run `npm run build` first. |
| `npm run lint` | Run ESLint. |

## Project structure

```text
src/
  app/          App Router pages and global styles
  components/   Reusable page sections and interactive UI
  data/         Event, team, mentor, statistics, and chapter content
  lib/          Shared state and animation utilities
public/         Images, logos, audio, and video served as static assets
scripts/        Media-related helper scripts
```

The main routes are defined in `src/app/`:

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | About the chapter |
| `/events` | Events |
| `/team` | Team |
| `/faculty-mentors` | Faculty mentors |
| `/gallery` | Gallery |
| `/join` | Join the community |
| `/tenure-2025` | 2025 tenure |
| `/tenure-2025-26` | 2025–26 tenure |

## Updating content and assets

- Event information and event gallery entries are maintained in [`src/data/events.ts`](src/data/events.ts).
- Team, department, mentor, statistics, and other page data live in the corresponding files in [`src/data/`](src/data/).
- Place assets intended to be served directly by the site in [`public/`](public/), then reference them by their path from the public root (for example, `/images/example.jpg`).

## Checks before submitting changes

```bash
npm run lint
npm run build
```

## Deployment

Deploy this as a Next.js application on a platform that supports the App Router. Configure the project to install dependencies with `npm ci`, build with `npm run build`, and start with `npm run start` when using a self-hosted Node.js deployment. Check that the deployed site can access the media files in `public/`.
