#!/usr/bin/env python3
"""
compress_assets.py

High-performance multi-core static asset pre-compression suite for Elesium.
Generates max-speed, high-compression Brotli (.br, quality 9) and Gzip (.gz, level 9) artifacts
using ProcessPoolExecutor across all available CPU cores.

Compresses all static HTML, CSS, JavaScript, SVG, JSON, and XML files in frontend/dist/.
Enables 0-CPU instant edge serving and minimizes Googlebot crawl bandwidth by 80-90%.
"""

import os
import sys
import gzip
import time
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor

try:
    import brotli
    HAS_BROTLI = True
except ImportError:
    HAS_BROTLI = False

EXTENSIONS = {".html", ".css", ".js", ".svg", ".json", ".xml", ".txt"}
MIN_SIZE_BYTES = 256

def compress_single_file(file_path_str: str) -> tuple:
    path = Path(file_path_str)
    raw_data = path.read_bytes()
    raw_len = len(raw_data)
    fname = path.name

    # Gzip level 9
    gz_data = gzip.compress(raw_data, compresslevel=9)
    gz_path = path.with_name(f"{fname}.gz")
    gz_path.write_bytes(gz_data)
    gz_len = len(gz_data)

    br_len = 0
    if HAS_BROTLI:
        # Quality 9 offers 97% of quality 11 compression at 10x the speed
        mode = brotli.MODE_TEXT if path.suffix.lower() in {".html", ".css", ".js", ".svg", ".xml", ".txt", ".json"} else brotli.MODE_GENERIC
        br_data = brotli.compress(raw_data, quality=9, mode=mode)
        br_path = path.with_name(f"{fname}.br")
        br_path.write_bytes(br_data)
        br_len = len(br_data)

    return (raw_len, gz_len, br_len)

def compress_dist_assets():
    script_dir = Path(__file__).resolve().parent
    dist_dir = script_dir.parent / "frontend" / "dist"

    if not dist_dir.exists():
        print(f"Error: {dist_dir} does not exist. Run vite build and generate_ssg first.")
        sys.exit(1)

    start_time = time.time()
    targets = []

    for root, _, files in os.walk(dist_dir):
        for fname in files:
            path = Path(root) / fname
            if path.suffix.lower() in EXTENSIONS and not fname.endswith(".br") and not fname.endswith(".gz"):
                try:
                    if path.stat().st_size >= MIN_SIZE_BYTES:
                        targets.append(str(path))
                except OSError:
                    continue

    print(f"Starting parallel asset pre-compression on {len(targets):,} assets across {os.cpu_count() or 4} cores...")

    total_raw_bytes = 0
    total_gz_bytes = 0
    total_br_bytes = 0

    with ProcessPoolExecutor() as executor:
        for raw_len, gz_len, br_len in executor.map(compress_single_file, targets, chunksize=50):
            total_raw_bytes += raw_len
            total_gz_bytes += gz_len
            total_br_bytes += br_len

    elapsed = time.time() - start_time
    print(f"✅ Asset pre-compression complete in {elapsed:.2f}s.")
    print(f"   Files compressed: {len(targets):,}")
    print(f"   Raw Total:    {total_raw_bytes / (1024 * 1024):.2f} MB")
    print(f"   Gzip Total:   {total_gz_bytes / (1024 * 1024):.2f} MB ({(1 - total_gz_bytes / max(1, total_raw_bytes)) * 100:.1f}% reduction)")
    if HAS_BROTLI:
        print(f"   Brotli Total: {total_br_bytes / (1024 * 1024):.2f} MB ({(1 - total_br_bytes / max(1, total_raw_bytes)) * 100:.1f}% reduction)")

if __name__ == "__main__":
    compress_dist_assets()
