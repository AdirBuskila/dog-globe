# 🐕 WORLD DOG GLOBE — CLAUDE CODE MASTER PROMPT
# Paste this entire prompt into Claude Code to plan and build the full project.
# ─────────────────────────────────────────────────────────────────────────────

You are a senior full-stack engineer and creative director. Your job is to
fully plan, scaffold, and build a stunning interactive 3D globe that maps
every dog breed in the world to its country of origin — inspired by the
ohmo.ai butterfly globe. This must be production-quality, visually
breathtaking, and fully functional.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PHASE 0 — READ THIS FIRST, PLAN EVERYTHING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before writing a single line of code:

1. Print a full project plan with phases, file structure, and tech decisions.
2. List every external dependency you will use and WHY.
3. Identify every data source and how you will fetch/clean it.
4. Confirm the folder structure you will create.
5. Then ask me: "Ready to start Phase 1?" — and wait for my go-ahead.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PROJECT VISION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A dark, cinematic, interactive 3D globe where:
- Every dog breed is represented as a small circular photo thumbnail
- Thumbnails are pinned to the breed's country of origin on the globe
- The globe auto-rotates slowly on load, then the user can drag to spin it
- Hovering a breed thumbnail pauses rotation and shows a rich tooltip card
- Clicking a breed opens a full side panel with details
- A search bar lets users find any breed instantly
- Filter buttons let users filter by group, size, and temperament
- The visual style is: DARK CINEMATIC — deep black background, glowing
  teal/green grid lines on the globe, soft golden light on continents,
  breed photos with a subtle glow and drop shadow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## TECH STACK (NON-NEGOTIABLE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Frontend:
  - Vite + React + TypeScript
  - Three.js (globe rendering, r3f / react-three-fiber preferred)
  - @react-three/drei (OrbitControls, Sphere, etc.)
  - D3.js (geo projections: lat/lng → 3D sphere coordinates)
  - Framer Motion (UI animations, panel transitions)
  - Tailwind CSS (utility styling)
  - Zustand (global state: selected breed, filters, search)

Backend / Data Pipeline (Python):
  - Python 3.11+
  - requests + BeautifulSoup (scraping)
  - pandas (data cleaning)
  - Pillow (image resizing → 80x80px circular thumbnails)
  - FastAPI (serves cleaned JSON data + images, optional)

Deployment:
  - Vercel (frontend)
  - The Python pipeline runs locally and outputs static JSON + images
    that get committed to /public/data/ for the frontend to consume

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## FOLDER STRUCTURE TO CREATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

dog-globe/
├── data-pipeline/
│   ├── 01_fetch_breeds.py        # Download breed list + metadata
│   ├── 02_fetch_images.py        # Download one image per breed
│   ├── 03_process_images.py      # Resize + crop to 80x80 circular PNGs
│   ├── 04_build_dataset.py       # Merge everything → breeds.json
│   ├── requirements.txt
│   └── output/
│       ├── breeds.json           # Final data file
│       └── images/               # breed-slug.png files
│
├── frontend/
│   ├── public/
│   │   └── data/
│   │       ├── breeds.json       # Copied from pipeline output
│   │       └── images/           # Copied from pipeline output
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── store/
│   │   │   └── useGlobeStore.ts  # Zustand store
│   │   ├── components/
│   │   │   ├── Globe/
│   │   │   │   ├── Globe.tsx         # Main Three.js globe
│   │   │   │   ├── GlobeGrid.tsx     # Glowing lat/lng grid lines
│   │   │   │   ├── BreedPin.tsx      # Individual breed thumbnail on globe
│   │   │   │   └── useLatLngTo3D.ts  # D3 geo → Three.js coords
│   │   │   ├── UI/
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── FilterPanel.tsx
│   │   │   │   ├── BreedTooltip.tsx
│   │   │   │   ├── BreedDetailPanel.tsx
│   │   │   │   └── LoadingScreen.tsx
│   │   │   └── Layout/
│   │   │       └── AppShell.tsx
│   │   ├── hooks/
│   │   │   ├── useBreedData.ts
│   │   │   └── useGlobeRotation.ts
│   │   ├── types/
│   │   │   └── breed.ts
│   │   └── styles/
│   │       └── globals.css
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
└── README.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## DATA SCHEMA  (breeds.json)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each breed entry must have:

{
  "id": "golden-retriever",
  "name": "Golden Retriever",
  "origin_country": "United Kingdom",
  "origin_lat": 55.3781,
  "origin_lng": -3.4360,
  "group": "Sporting",           // AKC group
  "size": "Large",               // Small / Medium / Large / Giant
  "temperament": ["Friendly", "Reliable", "Trustworthy"],
  "life_expectancy": "10-12 years",
  "weight_kg": { "min": 25, "max": 34 },
  "height_cm": { "min": 51, "max": 61 },
  "image": "/data/images/golden-retriever.png",
  "description": "...",
  "popularity_rank": 3           // AKC rank if available, else null
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## DATA SOURCES (use in this order)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. PRIMARY breed list + metadata:
   - AKC breed list: https://www.akc.org/dog-breeds/
   - Wikipedia list of dog breeds (has origin country for each)
   - Fallback: hardcode a curated list of 200 well-known breeds

2. Images:
   - Dog CEO API: https://dog.ceo/api/breed/{breed}/images/random
     (free, no auth needed, returns one image URL)
   - Fallback: Wikimedia Commons breed images

3. Country → lat/lng:
   - Use a hardcoded countries.json (capitals lat/lng)
   - Map each breed's origin_country string to lat/lng

4. Popularity:
   - AKC popularity rankings page (scrape the table)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PHASE 1 — DATA PIPELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build all Python scripts in data-pipeline/.

01_fetch_breeds.py:
  - Scrape or load breed list with: name, origin country, group, size,
    temperament, lifespan, weight, height, description
  - Save to output/breeds_raw.csv

02_fetch_images.py:
  - For each breed, call Dog CEO API to get one image URL
  - Download the image to output/images_raw/{slug}.jpg
  - Log failures to output/image_errors.txt

03_process_images.py:
  - Resize each image to 80×80px
  - Apply a circular mask (alpha channel PNG)
  - Add a subtle 2px glow border (teal #00FFB3)
  - Save to output/images/{slug}.png

04_build_dataset.py:
  - Load breeds_raw.csv
  - Add lat/lng by matching origin_country to countries.json
  - Add image path for each breed
  - Output: output/breeds.json (validated against the schema above)
  - Print a summary: total breeds, countries covered, missing images

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PHASE 2 — FRONTEND SCAFFOLD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Init Vite + React + TypeScript project in /frontend
2. Install all dependencies
3. Configure Tailwind with a custom dark theme:
   - Background: #050A0E
   - Primary accent: #00FFB3 (teal glow)
   - Secondary accent: #F5A623 (warm gold for continent labels)
   - Text: #E8EDF0
4. Set up Zustand store with:
   - selectedBreed: Breed | null
   - hoveredBreed: Breed | null
   - searchQuery: string
   - filters: { group, size, temperament }
   - isRotating: boolean
5. Create breed.ts type that matches the JSON schema exactly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PHASE 3 — THE GLOBE  (most important)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Globe.tsx — react-three-fiber Canvas:
  - Dark sphere with a subtle land texture (use a free public-domain
    Earth texture, dark/desaturated version)
  - Glowing grid lines every 30° lat and 30° lng (GlobeGrid.tsx)
  - Continent labels as 3D text sprites (THREE.Sprite)
  - Ambient light (low) + directional light (golden, from top-right)
  - OrbitControls with autoRotate={isRotating} autoRotateSpeed={0.4}
  - Damping enabled for smooth drag

GlobeGrid.tsx:
  - Draw lat/lng lines using THREE.LineSegments
  - Color: rgba(0, 255, 179, 0.15) — very subtle teal
  - Equator and Prime Meridian slightly brighter

BreedPin.tsx:
  - Convert breed lat/lng to 3D sphere coordinates (radius = 1.02)
  - Render breed image as a THREE.Sprite (always faces camera)
  - On hover: scale up 1.4x + show BreedTooltip
  - On click: set selectedBreed in Zustand
  - Use instanced rendering if >150 breeds for performance

useLatLngTo3D.ts:
  - Pure function: (lat, lng, radius) => THREE.Vector3
  - Formula: standard spherical coordinates conversion

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PHASE 4 — UI COMPONENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LoadingScreen.tsx:
  - Full screen dark overlay
  - Animated paw print logo spinning
  - Progress bar showing data load %
  - Fades out when globe is ready

SearchBar.tsx:
  - Fixed top-center
  - Glass morphism style (backdrop-blur, border: 1px solid rgba teal)
  - Real-time filter: highlights matching breed pins on globe
  - Keyboard shortcut: CMD/CTRL+K to focus

FilterPanel.tsx:
  - Fixed left side, collapsible
  - Filter by: Group (AKC groups), Size, Temperament tags
  - Active filters shown as dismissible chips

BreedTooltip.tsx:
  - Appears near the hovered pin (DOM overlay, not 3D)
  - Shows: breed photo (larger), name, origin flag emoji, group, size
  - Framer Motion: scale in from 0.8, fade in

BreedDetailPanel.tsx:
  - Slides in from the right when a breed is clicked
  - Shows full breed info: all fields from schema
  - Sections: Overview, Physical Stats (bar charts), Temperament tags
  - Close button dismisses and resumes globe rotation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PHASE 5 — POLISH & PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Performance:
  - Lazy load breed images (IntersectionObserver or r3f's own LOD)
  - Use texture atlas if possible for breed thumbnails
  - Memoize BreedPin components (React.memo)
  - Target 60fps on mid-range hardware

Visual polish:
  - Subtle star field in the background (simple particle system)
  - Atmospheric glow on the globe edge (additive blending sphere)
  - Country highlight ring when a breed is selected (glowing circle)
  - Add a "How many breeds per country" heatmap toggle button

Audio (optional, implement last):
  - On breed click: play a short dog bark sound
  - Source from freesound.org (attribution in README)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## PHASE 6 — DEPLOY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Copy output/breeds.json → frontend/public/data/breeds.json
2. Copy output/images/ → frontend/public/data/images/
3. Run: npm run build
4. Deploy to Vercel: vercel --prod
5. Print the live URL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## CODING STANDARDS — FOLLOW STRICTLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- TypeScript strict mode: no `any`, full types everywhere
- Each component max 150 lines — split if longer
- Every function has a JSDoc comment
- No inline styles — Tailwind classes or CSS modules only
- All magic numbers extracted to a constants.ts file
- Error boundaries around the Globe component
- Loading + error states for every async operation
- Mobile responsive: globe scales, UI panels adapt to small screens
- Accessibility: all interactive elements have aria labels

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
## HOW TO PROCEED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Execute one phase at a time. After completing each phase:
  1. Print a summary of what was built
  2. List any decisions you made and why
  3. List any blockers or things that need my input
  4. Ask: "Phase X complete. Start Phase X+1?"

Never skip ahead without my confirmation.
If you hit an API that requires authentication or payment, stop and ask me.
Prefer free, open-source, and public-domain resources at every step.

Start now with Phase 0: print the full plan and wait for my go-ahead.
