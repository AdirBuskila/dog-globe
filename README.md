# World Dog Globe

An interactive 3D globe that maps every dog breed in the world to its country of origin. Dark cinematic aesthetic with glowing teal grid lines, golden continental lighting, and breed photo thumbnails pinned to the globe.

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### Data Pipeline (optional — data is pre-built)
```bash
cd data-pipeline
pip install -r requirements.txt
python 01_fetch_breeds.py     # Export breed list to CSV
python 02_fetch_images.py     # Download breed images from Dog CEO API
python 03_process_images.py   # Resize to 80x80 circular PNGs with glow border
python 04_build_dataset.py    # Build final breeds.json with lat/lng coordinates
```

Then copy output to frontend:
```bash
cp data-pipeline/output/breeds.json frontend/public/data/breeds.json
cp -r data-pipeline/output/images/ frontend/public/data/images/
```

## Features

- **218 dog breeds** from 55 countries
- **3D interactive globe** with auto-rotation and drag controls
- **Search bar** (Ctrl+K) with real-time filtering
- **Filter panel** by AKC group, size, and temperament
- **Hover tooltips** with breed preview
- **Detail panel** with full breed info, stats bars, and temperament tags
- **Starfield background** and atmospheric glow
- **Dark cinematic design** — #050A0E background, #00FFB3 teal accents, #F5A623 gold

## Tech Stack

- Vite + React + TypeScript
- Three.js (react-three-fiber + drei)
- Framer Motion
- Tailwind CSS v4
- Zustand
- Python (Pillow, pandas, requests)
