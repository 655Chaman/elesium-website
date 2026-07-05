# Elesium SEO Automation Pipeline

A complete, automated pipeline that:
1. **Scrapes Google Trends** worldwide for trending keywords
2. **Filters & scores** them for relevance to Elesium's B2B business
3. **Expands** keywords using related queries
4. **Generates SEO-dense content blocks** daily via Gemini AI

---

## Quick Start

### 1. Install dependencies

```bash
cd seo-automation
pip install -r requirements.txt
```

### 2. Set up your API key

```bash
cp .env.example .env
# Then edit .env and add your GEMINI_API_KEY
# Get it free at: https://aistudio.google.com/app/apikey
```

### 3. Test the pipeline (no API needed)

```bash
python run_pipeline.py --test
```

### 4. Run for real

```bash
python run_pipeline.py
```

### 5. Run and generate a blogPosts.ts entry

```bash
python run_pipeline.py --inject
```

---

## Daily Automation (Set & Forget)

### Option A: Built-in Python Scheduler
```bash
python run_pipeline.py --schedule
# Runs every day at 8:00 AM automatically
```

### Option B: System Cron
```bash
# Open your crontab:
crontab -e

# Add this line (adjust the path):
0 8 * * * cd /Users/krdeeksha/ELESIUM\ WEBSITE/seo-automation && python run_pipeline.py --inject >> logs/cron.log 2>&1
```

---

## All Commands

| Command | Description |
|---------|-------------|
| `python run_pipeline.py` | Full live run |
| `python run_pipeline.py --test` | Dry run with mock data |
| `python run_pipeline.py --inject` | Live run + blogPosts.ts entry |
| `python run_pipeline.py --verbose` | Show detailed debug output |
| `python run_pipeline.py --schedule` | Run daily at 08:00 AM |
| `python run_pipeline.py --list` | List all generated SEO blocks |
| `python run_pipeline.py --validate` | Check environment only |
| `python run_pipeline.py --date 2025-01-15` | Run for a specific past date |

---

## Output Files

```
daily_seo_blocks/
└── YYYY-MM-DD.md          ← SEO content block (publish to your blog)
└── YYYY-MM-DD_blogpost_entry.ts  ← blogPosts.ts entry (with --inject)

keyword_logs/
└── trends_YYYY-MM-DD.json      ← Raw trending keywords from Google
└── keywords_YYYY-MM-DD.json    ← Scored, ranked keyword list
└── density_report_YYYY-MM-DD.json  ← Keyword density analysis
```

---

## Architecture

```
run_pipeline.py (orchestrator)
    ├── trend_fetcher.py       → Google Trends worldwide scraping
    ├── keyword_researcher.py  → Expansion, scoring, volume enrichment
    └── seo_block_generator.py → Gemini AI content generation
```

---

## API Keys Summary

| Key | Required | Where to Get | Cost |
|-----|----------|-------------|------|
| `GEMINI_API_KEY` | ✅ Yes | [aistudio.google.com](https://aistudio.google.com/app/apikey) | Free |
| `DATAFORSEO_LOGIN/PASSWORD` | ❌ Optional | [dataforseo.com](https://app.dataforseo.com/register) | Free sandbox |
| `SERPAPI_KEY` | ❌ Optional | [serpapi.com](https://serpapi.com/) | 100 free/month |
