"""
04_build_dataset.py
Merges breed data with country lat/lng coordinates and image paths.
Outputs the final breeds.json for the frontend.
"""

import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BREEDS_FILE = os.path.join(SCRIPT_DIR, "breeds_hardcoded.json")
COUNTRIES_FILE = os.path.join(SCRIPT_DIR, "countries.json")
IMAGES_DIR = os.path.join(SCRIPT_DIR, "output", "images")
OUTPUT_FILE = os.path.join(SCRIPT_DIR, "output", "breeds.json")


def main() -> None:
    """Build the final breeds.json dataset."""
    with open(BREEDS_FILE, "r", encoding="utf-8") as f:
        breeds = json.load(f)

    with open(COUNTRIES_FILE, "r", encoding="utf-8") as f:
        countries = json.load(f)

    output: list[dict] = []
    missing_countries: set[str] = set()
    missing_images: int = 0
    country_counts: dict[str, int] = {}

    for breed in breeds:
        origin = breed["origin_country"]
        coords = countries.get(origin)

        if not coords:
            missing_countries.add(origin)
            lat, lng = 0.0, 0.0
        else:
            lat = coords["lat"]
            lng = coords["lng"]

        # Spread breeds from same country using Fibonacci spiral
        country_counts[origin] = country_counts.get(origin, 0) + 1
        count = country_counts[origin]
        if count > 1:
            import math
            golden_angle = math.pi * (3 - math.sqrt(5))
            angle = count * golden_angle
            # Large radius so pins spread well beyond the capital
            radius = 3.0 + math.sqrt(count) * 2.5
            lat += radius * math.cos(angle)
            lng += radius * math.sin(angle)
        # Even the first breed gets a small jitter to avoid exact overlap
        elif count == 1:
            import math
            # Deterministic jitter based on breed id hash
            h = hash(breed["id"]) % 360
            lat += 0.5 * math.cos(math.radians(h))
            lng += 0.5 * math.sin(math.radians(h))

        image_path = f"/data/images/{breed['id']}.png"
        image_exists = os.path.exists(
            os.path.join(IMAGES_DIR, f"{breed['id']}.png")
        )
        if not image_exists:
            missing_images += 1

        entry = {
            "id": breed["id"],
            "name": breed["name"],
            "origin_country": breed["origin_country"],
            "origin_lat": round(lat, 4),
            "origin_lng": round(lng, 4),
            "group": breed["group"],
            "size": breed["size"],
            "temperament": breed["temperament"],
            "life_expectancy": breed["life_expectancy"],
            "weight_kg": breed["weight_kg"],
            "height_cm": breed["height_cm"],
            "image": image_path,
            "description": breed["description"],
            "popularity_rank": breed.get("popularity_rank"),
        }
        output.append(entry)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\n{'='*50}")
    print(f"  DATASET BUILD SUMMARY")
    print(f"{'='*50}")
    print(f"  Total breeds:      {len(output)}")
    print(f"  Countries covered:  {len(country_counts)}")
    print(f"  Missing countries:  {len(missing_countries)}")
    if missing_countries:
        for c in sorted(missing_countries):
            print(f"    - {c}")
    print(f"  Missing images:    {missing_images}")
    print(f"  Output:            {OUTPUT_FILE}")
    print(f"{'='*50}\n")


if __name__ == "__main__":
    main()
