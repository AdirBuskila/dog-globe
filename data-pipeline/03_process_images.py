"""
03_process_images.py
Resizes breed images to 80x80px circular PNGs with a teal glow border.
If no raw image exists, generates a styled placeholder.
"""

import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DIR = os.path.join(SCRIPT_DIR, "output", "images_raw")
OUT_DIR = os.path.join(SCRIPT_DIR, "output", "images")

SIZE = 256
BORDER_WIDTH = 3
GLOW_COLOR = (0, 255, 179)  # #00FFB3
BG_COLOR = (10, 15, 20)     # Dark background for placeholders


def create_circular_mask(size: int) -> Image.Image:
    """Create a circular alpha mask."""
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size - 1, size - 1), fill=255)
    return mask


def add_glow_border(img: Image.Image) -> Image.Image:
    """Add a teal glow border around the circular image."""
    canvas_size = SIZE + 16
    canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))

    glow = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse(
        (0, 0, canvas_size - 1, canvas_size - 1),
        fill=(*GLOW_COLOR, 60),
    )
    glow = glow.filter(ImageFilter.GaussianBlur(radius=6))

    canvas.paste(glow, (0, 0), glow)

    border = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    border_draw = ImageDraw.Draw(border)
    border_draw.ellipse(
        (2, 2, canvas_size - 3, canvas_size - 3),
        outline=(*GLOW_COLOR, 200),
        width=BORDER_WIDTH,
    )
    canvas.paste(border, (0, 0), border)

    offset = (canvas_size - SIZE) // 2
    canvas.paste(img, (offset, offset), img)

    return canvas


def create_placeholder(breed_id: str) -> Image.Image:
    """Create a placeholder image with the breed's initials."""
    img = Image.new("RGBA", (SIZE, SIZE), (*BG_COLOR, 255))
    draw = ImageDraw.Draw(img)
    draw.ellipse((0, 0, SIZE - 1, SIZE - 1), fill=(20, 30, 40, 255))

    initials = "".join(
        word[0].upper() for word in breed_id.replace("-", " ").split()[:2]
    )

    try:
        font = ImageFont.truetype("arial.ttf", 72)
    except (OSError, IOError):
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), initials, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = (SIZE - text_w) // 2
    y = (SIZE - text_h) // 2

    draw.text((x, y), initials, fill=(*GLOW_COLOR, 255), font=font)

    mask = create_circular_mask(SIZE)
    img.putalpha(mask)

    return img


def process_image(raw_path: str) -> Image.Image:
    """Resize and crop a raw image to circular 80x80."""
    img = Image.open(raw_path).convert("RGBA")

    # Center crop to square
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    img = img.crop((left, top, left + side, top + side))

    img = img.resize((SIZE, SIZE), Image.LANCZOS)

    mask = create_circular_mask(SIZE)
    img.putalpha(mask)

    return img


def main() -> None:
    """Process all breed images."""
    os.makedirs(OUT_DIR, exist_ok=True)

    import json
    input_file = os.path.join(SCRIPT_DIR, "breeds_hardcoded.json")
    with open(input_file, "r", encoding="utf-8") as f:
        breeds = json.load(f)

    processed = 0
    placeholders = 0

    for breed in breeds:
        breed_id = breed["id"]
        raw_path = os.path.join(RAW_DIR, f"{breed_id}.jpg")
        out_path = os.path.join(OUT_DIR, f"{breed_id}.png")

        if os.path.exists(raw_path):
            img = process_image(raw_path)
            processed += 1
        else:
            img = create_placeholder(breed_id)
            placeholders += 1

        final = add_glow_border(img)
        final.save(out_path, "PNG")

    print(f"[OK] Processed: {processed} images")
    print(f"  Placeholders: {placeholders}")
    print(f"  Output: {OUT_DIR}")


if __name__ == "__main__":
    main()
