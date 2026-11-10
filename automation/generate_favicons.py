#!/usr/bin/env python3
"""
Elesium Favicon & Brand Icon Generator
Generates all production favicons, touch icons, and square logo assets from the authentic LOGO_NEW.png.
"""

import os
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent

def generate_icons():
    logo_src = ROOT / "frontend" / "src" / "assets" / "LOGO_NEW.png"
    if not logo_src.exists():
        raise FileNotFoundError(f"Source logo not found at {logo_src}")

    orig = Image.open(logo_src).convert("RGBA")
    
    # 1. Precise crop of the white Elesium diamond flame mark
    # Pixel boundary: x=[42, 510], y=[43, 546]
    emblem = orig.crop((42, 43, 510, 546))
    print(f"Cropped authentic emblem: {emblem.size}")

    # 2. Master Squircle Canvas (1024x1024) with anti-aliasing
    size = 1024
    squircle_canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(squircle_canvas)

    # Sleek dark obsidian background & subtle slate border
    bg_color = (8, 12, 22, 255)      # #080c16 Obsidian Slate
    border_color = (30, 41, 59, 255)  # #1e293b Slate-800
    radius = 224                      # Smooth iOS/macOS squircle curve

    draw.rounded_rectangle([(0, 0), (size - 1, size - 1)], radius=radius, fill=bg_color)
    draw.rounded_rectangle([(0, 0), (size - 1, size - 1)], radius=radius, outline=border_color, width=6)

    # Emblem scaled to 74% of canvas for maximum legibility at small sizes
    target_h = int(size * 0.74)
    scale = target_h / emblem.height
    target_w = int(emblem.width * scale)
    emblem_resized = emblem.resize((target_w, target_h), Image.Resampling.LANCZOS)

    # Center emblem
    pos_x = (size - target_w) // 2
    pos_y = (size - target_h) // 2
    squircle_canvas.alpha_composite(emblem_resized, (pos_x, pos_y))

    # 3. Master Apple Touch Icon Canvas (1024x1024 RGB solid background)
    apple_canvas = Image.new("RGB", (size, size), (8, 12, 22))
    # Apple safe zone: 64% scale centered
    apple_target_h = int(size * 0.64)
    apple_scale = apple_target_h / emblem.height
    apple_target_w = int(emblem.width * apple_scale)
    apple_emblem_resized = emblem.resize((apple_target_w, apple_target_h), Image.Resampling.LANCZOS)
    apple_pos_x = (size - apple_target_w) // 2
    apple_pos_y = (size - apple_target_h) // 2

    # Paste emblem using its alpha mask
    apple_canvas.paste(apple_emblem_resized, (apple_pos_x, apple_pos_y), mask=apple_emblem_resized.split()[3])

    # 4. Generate Target Sizes
    icon_512 = squircle_canvas.resize((512, 512), Image.Resampling.LANCZOS)
    icon_192 = squircle_canvas.resize((192, 192), Image.Resampling.LANCZOS)
    icon_32  = squircle_canvas.resize((32, 32), Image.Resampling.LANCZOS)
    icon_180_apple = apple_canvas.resize((180, 180), Image.Resampling.LANCZOS)

    # 5. Save all assets to frontend/public/ and frontend/dist/
    dest_dirs = [
        ROOT / "frontend" / "public",
        ROOT / "frontend" / "dist",
    ]

    for d in dest_dirs:
        d.mkdir(parents=True, exist_ok=True)
        (d / "assets").mkdir(parents=True, exist_ok=True)

        # favicon.png (32x32 standard browser favicon)
        icon_32.save(d / "favicon.png", "PNG")
        
        # favicon-192.png (192x192 PWA / Android)
        icon_192.save(d / "favicon-192.png", "PNG")

        # apple-touch-icon.png (180x180 iOS Touch Icon)
        icon_180_apple.save(d / "apple-touch-icon.png", "PNG")

        # assets/logo-square.png (512x512 High-Res Schema & PWA Icon)
        icon_512.save(d / "assets" / "logo-square.png", "PNG")

        # assets/ele-in-logo.png (Overwrite legacy green 'e' logo completely)
        icon_512.save(d / "assets" / "ele-in-logo.png", "PNG")

        # favicon.ico (Multi-resolution: 16x16, 32x32, 48x48)
        icon_512.save(
            d / "favicon.ico",
            format="ICO",
            sizes=[(16, 16), (32, 32), (48, 48)]
        )
        print(f"Successfully generated all icons in {d}")

    # Also overwrite frontend/src/assets/ele-in-logo.png
    src_assets = ROOT / "frontend" / "src" / "assets"
    if src_assets.exists():
        icon_512.save(src_assets / "ele-in-logo.png", "PNG")
        print(f"Overwrote legacy green 'e' in {src_assets / 'ele-in-logo.png'}")

if __name__ == "__main__":
    generate_icons()
