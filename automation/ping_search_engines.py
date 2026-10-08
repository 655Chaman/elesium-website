#!/usr/bin/env python3
"""
Manual search engine ping script.
Run this after any manual content update.
Usage: python3 automation/ping_search_engines.py
"""
import urllib.request
import urllib.error

SITEMAP_URL = "https://elesium.online/sitemap.xml"
PAGES = [
    "https://elesium.online/",
    "https://elesium.online/ai-automation",
    "https://elesium.online/ai-automation-agency-india",
    "https://elesium.online/how-we-work",
    "https://elesium.online/markets",
    "https://elesium.online/resources",
]

def ping_search_engines():
    print("Pinging Google Search Console (Sitemap)...")
    google_url = f"https://www.google.com/ping?sitemap={SITEMAP_URL}"
    try:
        urllib.request.urlopen(google_url)
        print("Google ping status: 200")
    except urllib.error.URLError as e:
        print(f"Google ping failed: {e}")

    print("\nPinging Bing Sitemap...")
    bing_url = f"https://www.bing.com/ping?sitemap={SITEMAP_URL}"
    try:
        urllib.request.urlopen(bing_url)
        print("Bing ping status: 200")
    except urllib.error.URLError as e:
        print(f"Bing ping failed: {e}")

    print("\nNotifying Google of updated pages...")
    for page in PAGES:
        url = f"https://www.google.com/ping?sitemap={page}"
        try:
            urllib.request.urlopen(url)
            print(f"Pinged: {page} — Status: 200")
        except urllib.error.URLError as e:
            print(f"Pinged: {page} — Failed: {e}")
    print("Done. Pages submitted for indexing consideration.")

if __name__ == "__main__":
    ping_search_engines()
