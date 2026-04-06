"""
02_fetch_images.py
Downloads one image per breed from multiple sources:
1. Dog CEO API (primary)
2. Wikipedia API (fallback)
"""

import json
import os
import time
import requests
import urllib.parse

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_FILE = os.path.join(SCRIPT_DIR, "breeds_hardcoded.json")
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "output", "images_raw")
ERROR_LOG = os.path.join(SCRIPT_DIR, "output", "image_errors.txt")

DOG_CEO_BASE = "https://dog.ceo/api/breed"

WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php"

# Mapping from our breed slugs to Dog CEO API breed names
DOG_CEO_MAPPING: dict[str, str] = {
    "german-shepherd": "german/shepherd",
    "golden-retriever": "retriever/golden",
    "labrador-retriever": "labrador",
    "french-bulldog": "bulldog/french",
    "english-bulldog": "bulldog/english",
    "cocker-spaniel": "spaniel/cocker",
    "springer-spaniel": "spaniel/welsh",
    "cavalier-king-charles-spaniel": "spaniel/cocker",
    "siberian-husky": "husky",
    "australian-shepherd": "australian/shepherd",
    "yorkshire-terrier": "terrier/yorkshire",
    "scottish-terrier": "terrier/scottish",
    "jack-russell-terrier": "terrier/russell",
    "bull-terrier": "terrier/bull",
    "border-terrier": "terrier/border",
    "irish-terrier": "terrier/irish",
    "norwich-terrier": "terrier/norwich",
    "norfolk-terrier": "terrier/norfolk",
    "silky-terrier": "terrier/silky",
    "cairn-terrier": "terrier/cairn",
    "airedale-terrier": "terrier/airedale",
    "bedlington-terrier": "terrier/bedlington",
    "dandie-dinmont-terrier": "terrier/dandie",
    "fox-terrier-wire": "terrier/fox",
    "fox-terrier-smooth": "terrier/fox",
    "kerry-blue-terrier": "terrier/kerryblue",
    "lakeland-terrier": "terrier/lakeland",
    "sealyham-terrier": "terrier/sealyham",
    "tibetan-terrier": "terrier/tibetan",
    "welsh-terrier": "terrier/welsh",
    "west-highland-white-terrier": "terrier/westhighland",
    "wheaten-terrier": "terrier/wheaten",
    "toy-poodle": "poodle/toy",
    "miniature-poodle": "poodle/miniature",
    "standard-poodle": "poodle/standard",
    "miniature-schnauzer": "schnauzer/miniature",
    "giant-schnauzer": "schnauzer/giant",
    "standard-schnauzer": "schnauzer/miniature",
    "italian-greyhound": "greyhound/italian",
    "great-dane": "dane/great",
    "irish-setter": "setter/irish",
    "english-setter": "setter/english",
    "gordon-setter": "setter/gordon",
    "irish-wolfhound": "wolfhound/irish",
    "bernese-mountain-dog": "mountain/bernese",
    "swiss-mountain-dog": "mountain/swiss",
    "english-mastiff": "mastiff/english",
    "bull-mastiff": "mastiff/bull",
    "tibetan-mastiff": "mastiff/tibetan",
    "saint-bernard": "stbernard",
    "basset-hound": "hound/basset",
    "afghan-hound": "hound/afghan",
    "bloodhound": "hound/blood",
    "english-foxhound": "hound/english",
    "norwegian-elkhound": "elkhound/norwegian",
    "english-springer-spaniel": "springer/english",
    "welsh-springer-spaniel": "spaniel/welsh",
    "irish-water-spaniel": "spaniel/irish",
    "japanese-chin": "japanese/chin",
    "shar-pei": "sharpei",
    "shih-tzu": "shihtzu",
    "lhasa-apso": "lhasa",
    "bichon-frise": "bichon/frise",
    "bouvier-des-flandres": "bouvier",
    "alaskan-malamute": "malamute",
    "rhodesian-ridgeback": "ridgeback/rhodesian",
    "old-english-sheepdog": "sheepdog/english",
    "shetland-sheepdog": "sheepdog/shetland",
    "cardigan-welsh-corgi": "corgi/cardigan",
    "pembroke-welsh-corgi": "pembroke",
    "german-shorthaired-pointer": "pointer/germanlonghair",
    "flat-coated-retriever": "retriever/flatcoated",
    "chesapeake-bay-retriever": "retriever/chesapeake",
    "curly-coated-retriever": "retriever/curlycoated",
    "nova-scotia-duck-tolling-retriever": "retriever/golden",
    "mexican-hairless": "mexicanhairless",
    "chinese-crested": "chihuahua",
    "shiba-inu": "shiba",
    "chow-chow": "chow",
    "pekingese": "pekinese",
    "border-collie": "collie/border",
    "rough-collie": "rough/collie",
    "doberman-pinscher": "doberman",
    "great-pyrenees": "pyrenees",
    "portuguese-water-dog": "waterdog/spanish",
    "belgian-malinois": "malinois",
    "belgian-tervuren": "tervuren",
    "belgian-sheepdog": "groenendael",
    "australian-cattle-dog": "cattledog/australian",
    "brittany": "spaniel/brittany",
    "cane-corso": "mastiff/english",
    "miniature-pinscher": "pinscher/miniature",
    "xoloitzcuintli": "mexicanhairless",
    "pharaoh-hound": "hound/ibizan",
    "ibizan-hound": "hound/ibizan",
    "canaan-dog": "pariah/indian",
    "thai-ridgeback": "ridgeback/rhodesian",
    "finnish-spitz": "finnish/lapphund",
    "finnish-lapphund": "finnish/lapphund",
    "norwegian-buhund": "buhund/norwegian",
    "norwegian-lundehund": "buhund/norwegian",
    "swedish-vallhund": "corgi/cardigan",
    "scottish-deerhound": "deerhound/scottish",
    "american-staffordshire-terrier": "terrier/american",
    "boston-terrier": "terrier/boston",
    "australian-terrier": "terrier/australian",
    "staffordshire-bull-terrier": "bullterrier/staffordshire",
    "american-foxhound": "hound/walker",
    "plott-hound": "hound/plott",
    "treeing-walker-coonhound": "coonhound",
    "redbone-coonhound": "redbone",
    "bluetick-coonhound": "bluetick",
    "american-eskimo-dog": "eskimo",
    "japanese-spitz": "spitz/japanese",
    "italian-spinone": "segugio/italian",
    "clumber-spaniel": "clumber",
    "sussex-spaniel": "spaniel/sussex",
    "spanish-water-dog": "waterdog/spanish",
    "havanese": "havanese",
    "coton-de-tulear": "cotondetulear",
    "schipperke": "schipperke",
    "german-wirehaired-pointer": "pointer/germanlonghair",
    "german-shorthaired-pointer": "pointer/german",
    "hungarian-vizsla": "vizsla",
    "vizsla": "vizsla",
    "entlebucher-mountain-dog": "entlebucher",
    "appenzeller-sennenhund": "appenzeller",
    "leonberger": "leonberg",
    "papillon": "papillon",
    "keeshond": "keeshond",
    "komondor": "komondor",
    "kuvasz": "kuvasz",
    "newfoundland": "newfoundland",
    "otterhound": "otterhound",
    "briard": "briard",
    "pug": "pug",
    "pomeranian": "pomeranian",
    "chihuahua": "chihuahua",
    "maltese": "maltese",
    "weimaraner": "weimaraner",
    "whippet": "whippet",
    "dalmatian": "dalmatian",
    "boxer": "boxer",
    "rottweiler": "rottweiler",
    "dachshund": "dachshund",
    "beagle": "beagle",
    "akita": "akita",
    "samoyed": "samoyed",
    "saluki": "saluki",
    "borzoi": "borzoi",
    "basenji": "basenji",
    "pitbull": "pitbull",
    "american-pit-bull-terrier": "pitbull",
    "caucasian-shepherd-dog": "ovcharka/caucasian",
}

# Mapping from breed slug to Wikipedia article title for breeds
# that have non-obvious article names
WIKIPEDIA_MAPPING: dict[str, str] = {
    "afghan-shepherd": "Afghan Shepherd",
    "africanis": "Africanis",
    "alaskan-klee-kai": "Alaskan Klee Kai",
    "american-water-spaniel": "American Water Spaniel",
    "anatolian-shepherd-dog": "Anatolian Shepherd Dog",
    "azawakh": "Azawakh",
    "barbet": "Barbet (dog)",
    "beauceron": "Beauceron",
    "bergamasco-sheepdog": "Bergamasco Shepherd",
    "berger-picard": "Berger Picard",
    "bichon-frise": "Bichon Frisé",
    "black-russian-terrier": "Black Russian Terrier",
    "blue-lacy": "Blue Lacy",
    "boerboel": "Boerboel",
    "bolognese": "Bolognese (dog)",
    "boykin-spaniel": "Boykin Spaniel",
    "bracco-italiano": "Bracco Italiano",
    "bull-terrier": "Bull Terrier",
    "catahoula-leopard-dog": "Catahoula Leopard Dog",
    "catalburun": "Catalburun",
    "central-asian-shepherd-dog": "Central Asian Shepherd Dog",
    "cesky-terrier": "Cesky Terrier",
    "chinese-chongqing-dog": "Chinese Chongqing Dog",
    "chinook": "Chinook (dog)",
    "cirneco-dell-etna": "Cirneco dell'Etna",
    "coton-de-reunion": "Coton de Tulear",
    "croatian-sheepdog": "Croatian Sheepdog",
    "curly-coated-retriever": "Curly-coated Retriever",
    "czechoslovakian-vlcak": "Czechoslovakian Wolfdog",
    "danish-swedish-farmdog": "Danish-Swedish Farmdog",
    "dogo-argentino": "Dogo Argentino",
    "estrela-mountain-dog": "Estrela Mountain Dog",
    "eurasier": "Eurasier",
    "field-spaniel": "Field Spaniel",
    "fila-brasileiro": "Fila Brasileiro",
    "german-pinscher": "German Pinscher",
    "german-spitz": "German Spitz",
    "glen-of-imaal-terrier": "Glen of Imaal Terrier",
    "grand-basset-griffon-vendeen": "Grand Basset Griffon Vendéen",
    "greater-swiss-mountain-dog": "Greater Swiss Mountain Dog",
    "harrier": "Harrier (dog)",
    "hokkaido": "Hokkaido (dog)",
    "hungarian-wirehaired-vizsla": "Wirehaired Vizsla",
    "icelandic-sheepdog": "Icelandic Sheepdog",
    "indian-pariah-dog": "Indian pariah dog",
    "japanese-chin": "Japanese Chin",
    "kai-ken": "Kai Ken",
    "kangal": "Kangal Shepherd Dog",
    "kanni": "Kanni (dog)",
    "karelian-bear-dog": "Karelian Bear Dog",
    "kishu-ken": "Kishu",
    "kooikerhondje": "Kooikerhondje",
    "korean-jindo": "Korean Jindo",
    "kunming-wolfdog": "Kunming dog",
    "lagotto-romagnolo": "Lagotto Romagnolo",
    "lapponian-herder": "Lapponian Herder",
    "lowchen": "Löwchen",
    "manchester-terrier": "Manchester Terrier",
    "maremma-sheepdog": "Maremma Sheepdog",
    "mudhol-hound": "Mudhol Hound",
    "mudi": "Mudi (dog)",
    "new-guinea-singing-dog": "New Guinea singing dog",
    "norrbottenspets": "Norrbottenspets",
    "perro-de-presa-canario": "Perro de Presa Canario",
    "peruvian-inca-orchid": "Peruvian Inca Orchid",
    "petit-basset-griffon-vendeen": "Petit Basset Griffon Vendéen",
    "philippine-askal": "Askal",
    "polish-lowland-sheepdog": "Polish Lowland Sheepdog",
    "portuguese-podengo": "Portuguese Podengo",
    "puli": "Puli (dog)",
    "pungsan-dog": "Pungsan dog",
    "rat-terrier": "Rat Terrier",
    "russian-toy": "Russian Toy",
    "sapsali": "Sapsali",
    "sarplaninac": "Šarplaninac",
    "skye-terrier": "Skye Terrier",
    "sloughi": "Sloughi",
    "soft-coated-wheaten-terrier": "Soft-coated Wheaten Terrier",
    "south-russian-ovcharka": "South Russian Ovcharka",
    "spanish-mastiff": "Spanish Mastiff",
    "spinone-italiano": "Spinone Italiano",
    "stabyhoun": "Stabyhoun",
    "taiwan-dog": "Taiwan Dog",
    "tatra-shepherd-dog": "Tatra Shepherd Dog",
    "telomian": "Telomian",
    "thai-bangkaew-dog": "Thai Bangkaew Dog",
    "tibetan-spaniel": "Tibetan Spaniel",
    "tornjak": "Tornjak",
    "tosa-inu": "Tosa (dog)",
    "volpino-italiano": "Volpino Italiano",
    "wire-fox-terrier": "Wire Fox Terrier",
    "wirehaired-pointing-griffon": "Wirehaired Pointing Griffon",
}


def get_dog_ceo_name(breed_id: str) -> str:
    """Convert our breed slug to Dog CEO API format."""
    if breed_id in DOG_CEO_MAPPING:
        return DOG_CEO_MAPPING[breed_id]
    return breed_id


def fetch_image_dog_ceo(breed_id: str) -> str | None:
    """Fetch a random image URL from Dog CEO API."""
    api_name = get_dog_ceo_name(breed_id)
    url = f"{DOG_CEO_BASE}/{api_name}/images/random"
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("status") == "success":
                return data["message"]
    except requests.RequestException:
        pass
    return None


def fetch_image_wikipedia(breed_id: str, breed_name: str) -> str | None:
    """Fetch breed image from Wikipedia API using page thumbnail."""
    # Determine the Wikipedia article title
    if breed_id in WIKIPEDIA_MAPPING:
        title = WIKIPEDIA_MAPPING[breed_id]
    else:
        # Convert slug to title case as a guess
        title = breed_name

    try:
        # Use Wikipedia API to get page image (pageimages extension)
        params = {
            "action": "query",
            "titles": title,
            "prop": "pageimages",
            "format": "json",
            "pithumbsize": 800,
            "redirects": 1,
        }
        resp = requests.get(WIKIPEDIA_API, params=params, timeout=10)
        if resp.status_code != 200:
            return None

        data = resp.json()
        pages = data.get("query", {}).get("pages", {})
        for page in pages.values():
            thumbnail = page.get("thumbnail", {})
            source = thumbnail.get("source")
            if source:
                return source

        # If direct title didn't work, try search
        search_params = {
            "action": "query",
            "list": "search",
            "srsearch": f"{breed_name} dog breed",
            "format": "json",
            "srlimit": 1,
        }
        resp = requests.get(WIKIPEDIA_API, params=search_params, timeout=10)
        if resp.status_code != 200:
            return None

        data = resp.json()
        results = data.get("query", {}).get("search", [])
        if not results:
            return None

        found_title = results[0]["title"]
        params["titles"] = found_title
        resp = requests.get(WIKIPEDIA_API, params=params, timeout=10)
        if resp.status_code != 200:
            return None

        data = resp.json()
        pages = data.get("query", {}).get("pages", {})
        for page in pages.values():
            thumbnail = page.get("thumbnail", {})
            source = thumbnail.get("source")
            if source:
                return source

    except requests.RequestException:
        pass
    return None


def download_image(image_url: str, output_path: str) -> bool:
    """Download an image from a URL to a local file."""
    try:
        headers = {
            "User-Agent": "DogGlobeProject/1.0 (educational project; contact@example.com)"
        }
        resp = requests.get(image_url, timeout=15, headers=headers)
        if resp.status_code == 200 and len(resp.content) > 1000:
            with open(output_path, "wb") as f:
                f.write(resp.content)
            return True
    except requests.RequestException:
        pass
    return False


def main() -> None:
    """Download one image per breed using multiple sources."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        breeds = json.load(f)

    errors: list[str] = []
    downloaded = 0
    skipped = 0
    wiki_count = 0

    for i, breed in enumerate(breeds):
        breed_id = breed["id"]
        breed_name = breed["name"]
        output_path = os.path.join(OUTPUT_DIR, f"{breed_id}.jpg")

        if os.path.exists(output_path):
            skipped += 1
            continue

        print(f"[{i + 1}/{len(breeds)}] Fetching image for {breed_name}...")

        # Try Dog CEO API first
        image_url = fetch_image_dog_ceo(breed_id)
        if image_url and download_image(image_url, output_path):
            downloaded += 1
            print(f"  [OK] Dog CEO")
            time.sleep(0.3)
            continue

        # Try Wikipedia as fallback
        image_url = fetch_image_wikipedia(breed_id, breed_name)
        if image_url and download_image(image_url, output_path):
            downloaded += 1
            wiki_count += 1
            print(f"  [OK] Wikipedia")
            time.sleep(0.5)
            continue

        errors.append(breed_id)
        print(f"  [FAIL] {breed_id} — no image found")
        time.sleep(0.3)

    with open(ERROR_LOG, "w", encoding="utf-8") as f:
        f.write("\n".join(errors))

    print(f"\n[OK] Downloaded: {downloaded} ({wiki_count} from Wikipedia)")
    print(f"  Skipped (already exist): {skipped}")
    print(f"  Errors: {len(errors)}")
    if errors:
        print(f"  Failed breeds: {', '.join(errors)}")
        print(f"  Error log: {ERROR_LOG}")


if __name__ == "__main__":
    main()
