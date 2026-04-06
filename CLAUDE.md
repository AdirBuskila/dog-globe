# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive 3D globe mapping every dog breed to its country of origin. Dark cinematic aesthetic with glowing teal grid lines, golden continental lighting, and breed photo thumbnails pinned to the globe. Inspired by the ohmo.ai butterfly globe.

## Tech Stack

- **Frontend:** Vite + React + TypeScript, Three.js (react-three-fiber + drei), D3.js (geo projections), Framer Motion, Tailwind CSS, Zustand
- **Data Pipeline:** Python 3.11+ with requests, BeautifulSoup, pandas, Pillow
- **Deployment:** Vercel (frontend); Python pipeline outputs static JSON + images to `public/data/`

## Project Structure

Two main directories:
- `data-pipeline/` — Python scripts (numbered 01-04) that scrape breed data, download/process images, and output `breeds.json` + circular thumbnails
- `frontend/` — Vite React app with the 3D globe, UI components, and Zustand state management

Pipeline output (`data-pipeline/output/`) gets copied to `frontend/public/data/` for the frontend to consume.

## Build & Run Commands

### Frontend (from `frontend/`)
```bash
npm install          # install dependencies
npm run dev          # dev server
npm run build        # production build
```

### Data Pipeline (from `data-pipeline/`)
```bash
pip install -r requirements.txt
python 01_fetch_breeds.py
python 02_fetch_images.py
python 03_process_images.py
python 04_build_dataset.py
```

### Deploy
```bash
# Copy pipeline output to frontend
cp data-pipeline/output/breeds.json frontend/public/data/breeds.json
cp -r data-pipeline/output/images/ frontend/public/data/images/
# Build and deploy
cd frontend && npm run build && vercel --prod
```

## Architecture

**Globe rendering:** `Globe.tsx` is a react-three-fiber Canvas containing the sphere with earth texture, `GlobeGrid.tsx` (lat/lng lines), and `BreedPin.tsx` (sprites pinned to globe surface). `useLatLngTo3D.ts` converts (lat, lng, radius) → THREE.Vector3.

**State management:** Single Zustand store (`useGlobeStore.ts`) holds selectedBreed, hoveredBreed, searchQuery, filters, and isRotating flag.

**UI overlay:** SearchBar (top-center, CMD/CTRL+K), FilterPanel (left side, collapsible), BreedTooltip (hover popup), BreedDetailPanel (right slide-in on click). All use Framer Motion for transitions.

**Data flow:** `breeds.json` is fetched at startup → loaded into store → BreedPin components render on globe at each breed's lat/lng coordinates.

## Data Schema (breeds.json)

Each breed entry has: id (slug), name, origin_country, origin_lat, origin_lng, group (AKC), size (Small/Medium/Large/Giant), temperament (string[]), life_expectancy, weight_kg {min, max}, height_cm {min, max}, image path, description, popularity_rank.

## Design Tokens

- Background: `#050A0E`
- Primary accent (teal glow): `#00FFB3`
- Secondary accent (warm gold): `#F5A623`
- Text: `#E8EDF0`

## Coding Standards

- TypeScript strict mode, no `any`
- Components max 150 lines — split if longer
- JSDoc on every function
- No inline styles — Tailwind or CSS modules only
- Magic numbers go in `constants.ts`
- Error boundaries around Globe component
- Loading + error states for all async operations
- Mobile responsive, accessible (aria labels on interactive elements)
