# Indian Pharmacopoeia Commission — Website Redesign

This repository contains a redesigned frontend for [www.ipc.gov.in](https://www.ipc.gov.in/), the website of the Indian Pharmacopoeia Commission (Ministry of Health & Family Welfare, Government of India).

Every English page of the official site, more than 950 in all, is rebuilt here as its own route. All pages share one design system, navigation and set of page templates. The design is a colourful light theme with a *mixed rhythm*: vivid colour-field sections (teal, saffron, sky, coral, violet, with film grain) alternate with pearl "aurora" sections. One motif runs through it: the medicine capsule, which shapes image masks, buttons, the navigation pill and the hero's giant art panel.

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
  - A homepage hero carousel with a separately composed slide for each subject: the Prime Minister (the ALRC inauguration), the Union Health Minister (his message to IPC), the Minister of State (the release of NFI 2026), Indian Pharmacopoeia 2026 and IP Reference Substances. Each slide has its own colour field, generated art in a giant capsule panel, an outlined display word on a depth layer, HTML headline and call to action. A live three.js layer of glass molecules and two-tone capsules floats behind the art and follows the pointer; it is lazy-loaded, pauses offscreen, and is skipped on small screens and for reduced motion.
  - A card-stack "How a standard is made" story: six colour cards that stick and stack on wide screens (earlier cards recede, their title bars stay visible), with a stage rail that tracks progress. On phones and with reduced motion it is a plain vertical list.
  - A two-tier header. A 40px animated colour strip keeps text size, high contrast, the language switcher, "Powered by Anuvadini", login and cart always visible. Below it, a 68px bar holds the emblem, wordmark, icon pill navigation (mega menus stay open while the pointer travels into them) and Ctrl/⌘ K search with live results. The header hides on scroll down and returns on scroll up, but never while a menu is open or the pointer is over it. There is also a full-screen mobile menu and a compact colour-field footer with icons.
  - The hero fits in one screen, controls included. Autoplay pauses only with the pause button, keyboard focus, a hidden tab or when scrolled away; it does not pause on hover.
  - Every section and interior page has an animated background texture (aurora, molecule lattice, floating capsules, hexagon grid or DNA strand), paused offscreen. Interior pages put their content on a white sheet, reveal official content as you scroll, and end with an "Explore" band of related pages.
  - Pointer layer on fine pointers only: a trailing cursor halo (the native cursor is kept), section spotlights, 3D tilt with moving glare on cards, magnetic buttons, image zoom with a colour wash.
  - Gentle pointer depth, magnetic primary buttons and animated underlines on fine-pointer devices only.
  - An animated molecular loader on the first visit only, which waits for real readiness (fonts and the first hero image) and has a failure screen.
  - Display type in Bricolage Grotesque; body text in Public Sans.
  - Each area of the site has its own accent colour family, also used on interior page headers.
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
- **Anuvadini translation:** the language switcher and adapter are built (`src/lib/translate.ts`, `src/components/layout/LanguageSwitcher.tsx`) but **not connected**. To connect, set `VITE_ANUVADINI_API_URL` to a server-side proxy that accepts `POST { source, target, texts[] }` and returns `{ translations[] }`; keep any API key in that proxy, never in the browser. Until then, choosing a language shows a "not connected" notice, and हिन्दी opens the official Hindi pages.
- Canva's image-generation quota is exhausted (checked again on 23 October 2026), so these slots have no generated picture yet: story stages 3 and 5, news, overview, training, contact, programme tiles and interior headers. They currently use official photographs, typographic panels or the live 3D layer.
- Canva's image-generation quota ran out after eight images. Story stages 3 and 5 therefore use a typographic panel over a live 3D scene, and sections without a generated picture use official photographs or the 3D layer.
- The leader banners are generated likenesses made from the official portraits. They are always captioned "Digital illustration" on the site; the gallery shows only official photographs.
- The Union Health Minister's portrait comes from a low-resolution official slide, so it is displayed at 560px wide at most.
- The shop, cart and login stay on the official IPC online store, because they handle transactions.
- PDFs and gallery photos load from `www.ipc.gov.in`.

## Asset provenance

| Asset | Source |
|---|---|
| Leader banners: Shri Narendra Modi, Shri Jagat Prakash Nadda, Smt. Anupriya Patel | **Generated** with Canva's AI image generator, using the official portraits from the IPC homepage carousel as likeness references. Captioned "Digital illustration" on the site. Titles come from the official carousel slides. |
| IP 2026 release photograph | The photograph area of the official "IP 2026 Launch" carousel slide, without its text banner |
| IP 2026 volumes, headquarters, NFI, IPRS and training photographs | Official IPC images (see `assets/official`) |
| IP volumes, IPRS vials, story stages 1, 2 and 4 | Generated with Canva's AI image generator. No text or logos; illustrative only; they do not show IPC premises. Sources are in `assets/gen2`. |
| 3D molecules and capsules | Rendered live in the browser with three.js (`src/components/three/LabScene.tsx`). |
| Anuvadini logo | Supplied file from anuvadini.aicte.gov.in, served locally. Only its uniform white margin is trimmed. |

Hero and story text is quoted or paraphrased from the official pages noted in `src/config/hero.ts` and `src/sections/home/StandardsStory.tsx`. The only quotation is taken word for word from the Minister's published message.

## Design workflow

The redesign used five UI skills, installed in `~/.claude/skills`:
- **Frontend Design** (anthropics/skills): typography and composition rules.
- **TasteSkill**: the "one motif" direction and its blueprints (giant cropped shape, coupon contact, the mark built large), plus `inspect.mjs` before and after (`.taste-skill/`).
- **UI UX Pro Max**: `--design-system` with variance, motion and density dials; its motion presets.
- **Impeccable**: `context`, `PRODUCT.md`, and `detect` (clean on the final code).
- **Bencium Controlled UX Designer**: spacing, motion timing, touch-target and accessibility rules.

Where a skill's house rule conflicted with the brief (for example TasteSkill bans gradients, glows and violet), the brief won.

## Disclaimer

All content, names, emblems and documents belong to the Indian Pharmacopoeia Commission and the Government of India. This repository is a frontend redesign; it does not replace the official website.
