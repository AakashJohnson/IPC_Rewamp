# Indian Pharmacopoeia Commission — Website Redesign

This repository contains a redesigned frontend for [www.ipc.gov.in](https://www.ipc.gov.in/), the website of the Indian Pharmacopoeia Commission (Ministry of Health & Family Welfare, Government of India).

Every English page of the official site, more than 950 in all, is rebuilt here as its own route. All pages share one design system, navigation and set of page templates. The design direction, called *Institutional Precision*, aims for an authoritative, calm and accessible site with purposeful motion.

This is a frontend-only redesign. All content comes from the official website, and nothing has been invented.

## Highlights

- **Every page is rebuilt.** This covers About IPC, divisions, Indian Pharmacopoeia, NFI, IPRS, PvPI, MvPI, skill development, harmonization, orders and circulars, careers, tenders, RTI, policies and the library.
- **News & Highlights:** more than 600 dated announcements. You can search by headline and filter by topic and year. There is also an archive and a page for each article.
- **Navigation:**
  - Mega menus that work fully from the keyboard.
  - A mobile menu that keeps keyboard focus inside it while open.
  - Breadcrumbs and section side navigation.
  - Site-wide search.
  - A site map generated from the menus.
- **Galleries and documents:**
  - Photo galleries with an accessible image viewer.
  - Document lists you can filter and sort.
  - FAQ and online forms.
- **Visual design:**
  - Custom animated line illustrations.
  - Drifting molecule backgrounds.
  - Scroll-linked parallax.
  - Official figures that count up as they appear.
  - A scroll-driven "how standards are made" timeline based on IPC's official monograph development process.
- **Accessibility (aiming at WCAG 2.2 AA and GIGW 3.0):**
  - A skip link.
  - Text-size controls.
  - A high-contrast mode.
  - Support for reduced motion.
  - Correct language marking on Hindi text.
  - A हिन्दी link that opens each page's official Hindi version.

## Tech stack

| Area | Tools |
|---|---|
| App | Vite 7, React 19, TypeScript, React Router 7 |
| Styling | Tailwind CSS 4, with design tokens in `src/styles/index.css` |
| Motion | [Motion](https://motion.dev) (`motion/react`) |
| Icons and fonts | lucide-react; Public Sans, Noto Sans Devanagari and Source Serif 4 (all self-hosted) |
| Content pipeline | Node.js, node-html-parser, sanitize-html |

## Getting started

You need Node.js 20 or later.

```bash
npm install
npm run dev        # development server at http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the production build at http://localhost:4173
npm run lint
```

The generated content is committed (`public/content/`, `src/content/`), so the site builds without network access.

## Content pipeline

The official site does not allow its pages to be fetched from a browser (it sends no CORS headers). Content is therefore captured at build time and stored as JSON.

```bash
npm run content:sync     # crawl → build → verify
npm run content:crawl    # crawl www.ipc.gov.in into .cache/raw (cached)
npm run content:build    # turn the crawled pages into JSON
npm run content:verify   # check that no menu destination is missing and every internal link resolves
```

### What the build step does

- Sanitises page HTML.
- Rewrites old `.html` links to clean routes.
- Points PDFs and images at their official URLs.
- Decodes protected email addresses.
- Builds the news index, the search index and the curated navigation.

### Images

```bash
npm run images           # create optimised official images in public/images/official
```

## Project structure

```text
scripts/
  content/        crawl, build and verify the content snapshot
  optimize-images.mjs
  postbuild.mjs   copies index.html to 404.html for static hosting
assets/official/  original official images (logo, IP 2026, headquarters)
public/content/   one JSON file per page, plus the news, search and page indexes
src/
  config/         verified institutional content, form definitions, menu descriptions
  content/        generated navigation, homepage data and route aliases
  components/
    layout/       utility bar, header, mega menu, mobile menu, footer
    ui/           shared UI parts (links, buttons, rows, badges, lightbox, accordion…)
    illustrations/  animated line illustrations
    effects/      animated backgrounds, count-up, spotlight and tilt, scroll progress
  sections/home/  homepage sections
  templates/      page templates and route handling
  lib/            content loading, navigation, accessibility, motion, icons, forms
```

### Page templates

`src/templates/ContentRoute.tsx` chooses a template for each page based on its type:

- **Article:** the standard page, with section side navigation.
- **News:** news index, news archive and individual articles.
- **Register:** document lists such as careers, tenders, and orders and circulars.
- **Gallery:** the album index and individual albums.
- **Others:** FAQ, related links, contact, forms, library pages and the site map.

Old URLs ending in `.html` redirect to their clean route, so existing links keep working.

## Forms

The Feedback, Training Application and Monograph Inclusion forms are defined in `src/config/forms.ts` and checked in the browser.

Submissions go through `src/lib/forms/submit-adapter.ts`. By default it opens a pre-filled email to the official address that IPC publishes for that form. To use a real submission API instead, replace `submitAdapter`; no other code needs to change.

## Deployment

`npm run build` produces a static site in `dist/`. Any static host works if it serves `index.html` for unknown paths. The build also writes `dist/404.html` for hosts such as GitHub Pages.

## Known limitations

- Content is a dated snapshot of the official site; the date is shown in the footer. Run `npm run content:sync` to refresh it.
- Hindi pages are served by the official `/hi/` site.
- The shop, cart and login stay on the official IPC online store, because they handle transactions.
- PDFs and gallery photos load from `www.ipc.gov.in`.

## Disclaimer

All content, names, emblems and documents belong to the Indian Pharmacopoeia Commission and the Government of India. This repository is a frontend redesign; it does not replace the official website.
