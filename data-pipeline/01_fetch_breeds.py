"""
01_fetch_breeds.py
Loads the hardcoded breed dataset and outputs breeds_raw.csv.
Uses a curated list of 200 well-known breeds with accurate metadata.
"""

import json
import csv
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_FILE = os.path.join(SCRIPT_DIR, "breeds_hardcoded.json")
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "output")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "breeds_raw.csv")


def main() -> None:
    """Load hardcoded breed data and write to CSV."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        breeds = json.load(f)

    fieldnames = [
        "id", "name", "origin_country", "group", "size",
        "temperament", "life_expectancy", "weight_kg_min", "weight_kg_max",
        "height_cm_min", "height_cm_max", "description", "popularity_rank",
    ]

    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        for breed in breeds:
            writer.writerow({
                "id": breed["id"],
                "name": breed["name"],
                "origin_country": breed["origin_country"],
                "group": breed["group"],
                "size": breed["size"],
                "temperament": "|".join(breed["temperament"]),
                "life_expectancy": breed["life_expectancy"],
                "weight_kg_min": breed["weight_kg"]["min"],
                "weight_kg_max": breed["weight_kg"]["max"],
                "height_cm_min": breed["height_cm"]["min"],
                "height_cm_max": breed["height_cm"]["max"],
                "description": breed["description"],
                "popularity_rank": breed.get("popularity_rank", ""),
            })

    print(f"[OK] Wrote {len(breeds)} breeds to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
