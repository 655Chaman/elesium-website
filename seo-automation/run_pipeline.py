"""
run_pipeline.py — Master Orchestrator for the Elesium SEO Automation Pipeline

This is the SINGLE ENTRY POINT. Running this script executes the full pipeline:
  Step 1 → trend_fetcher.py     (Google Trends worldwide)
  Step 2 → keyword_researcher.py (expansion, scoring, volume)
  Step 3 → seo_block_generator.py (Gemini AI content)

Usage:
  # Full run (requires GEMINI_API_KEY in .env):
  python run_pipeline.py

  # Dry run with mock data (no API needed):
  python run_pipeline.py --test

  # Verbose output:
  python run_pipeline.py --verbose

  # Also generate a blogPosts.ts entry (deprecated flag, injection is now automatic):
  python run_pipeline.py

  # Run for a specific past date:
  python run_pipeline.py --date 2026-01-15

  # Set up daily cron (runs at 8:00 AM and 6:00 PM every day):
  python run_pipeline.py --schedule

SCHEDULING (set it and forget it):
  To run this daily automatically, add this line to your crontab:
  (run `crontab -e` in your terminal)

    0 8 * * * cd /path/to/your/seo-automation && python run_pipeline.py >> logs/cron.log 2>&1

  Or use the --schedule flag to run it indefinitely via Python scheduler.
"""

import argparse
import sys
import traceback
from datetime import datetime
from pathlib import Path
from typing import Optional


# ─────────────────────────────────────────────────────
# UTILITY
# ─────────────────────────────────────────────────────

def log(msg: str, level: str = "INFO") -> None:
    ts = datetime.now().strftime("%H:%M:%S")
    print(f"[{ts}] [{level}] {msg}")


def separator(title: str = "") -> None:
    if title:
        pad = (58 - len(title)) // 2
        print(f"\n{'═' * pad} {title} {'═' * pad}\n")
    else:
        print(f"\n{'═' * 60}\n")


# ─────────────────────────────────────────────────────
# ENVIRONMENT VALIDATION
# ─────────────────────────────────────────────────────

def validate_environment() -> bool:
    """Check that required dependencies and API keys are in place."""
    import config
    all_ok = True

    log("Validating environment...")

    required_packages = {
        "pytrends": "pytrends",
        "dotenv": "python-dotenv",
    }
    
    if getattr(config, "AI_PROVIDER", "gemini") == "nvidia":
        required_packages["openai"] = "openai"
    else:
        required_packages["google.genai"] = "google-genai"

    for import_name, pip_name in required_packages.items():
        try:
            __import__(import_name)
            log(f"  ✓ {pip_name}")
        except ImportError:
            log(f"  ✗ {pip_name} — run: pip install {pip_name}", "ERROR")
            all_ok = False

    # Check Gemini API key
    if not config.GEMINI_API_KEY:
        log(
            "  ✗ GEMINI_API_KEY not set — add it to your .env file.",
            "WARN",
        )
        log("    Get your free key at: https://aistudio.google.com/app/apikey", "WARN")
        all_ok = False
    else:
        log(f"  ✓ GEMINI_API_KEY set ({config.GEMINI_API_KEY[:8]}...)")

    # Check optional keys
    if config.DATAFORSEO_LOGIN:
        log(f"  ✓ DataForSEO credentials set (volume enrichment enabled)")
    else:
        log(f"  ℹ DataForSEO not set — volume data will not be available (optional)")

    # Check output dirs exist
    log(f"  ✓ SEO blocks dir: {config.OUTPUT_SEO_BLOCKS_DIR}")
    log(f"  ✓ Keyword logs dir: {config.OUTPUT_KEYWORD_LOGS_DIR}")

    return all_ok


# ─────────────────────────────────────────────────────
# PIPELINE RUNNER
# ─────────────────────────────────────────────────────

def run_full_pipeline(
    date: Optional[str] = None,
    test_mode: bool = False,
    verbose: bool = False,
) -> dict:
    """
    Execute all three pipeline steps in sequence.
    Returns a summary dict with output paths and stats.
    """
    import trend_fetcher
    import keyword_researcher
    import seo_block_generator
    import config

    today = date or datetime.now().strftime("%Y-%m-%d")
    start_time = datetime.now()

    separator(f"ELESIUM SEO PIPELINE — {today}")
    log(f"Mode: {'TEST (mock data)' if test_mode else 'LIVE (real APIs)'}")
    log(f"Gemini model: {config.GEMINI_MODEL}")
    log(f"Output dir: {config.OUTPUT_SEO_BLOCKS_DIR}")
    separator()

    results: dict = {
        "date": today,
        "test_mode": test_mode,
        "steps": {},
        "output_files": {},
        "success": False,
    }

    # ──────────────────────────────
    # STEP 1: Fetch Trends
    # ──────────────────────────────
    separator("STEP 1: GOOGLE TRENDS")
    try:
        trending_keywords = trend_fetcher.run(
            test_mode=test_mode,
            verbose=verbose,
        )
        results["steps"]["trend_fetcher"] = {
            "status": "success",
            "keywords_found": len(trending_keywords),
        }
        log(f"\n✅ Step 1 complete — {len(trending_keywords)} trending keywords found.")
    except SystemExit:
        raise
    except Exception as e:
        log(f"Step 1 FAILED: {e}", "ERROR")
        if verbose:
            traceback.print_exc()
        results["steps"]["trend_fetcher"] = {"status": "failed", "error": str(e)}
        log("Cannot continue without trend data.", "ERROR")
        return results

    # ──────────────────────────────
    # STEP 2: Keyword Research
    # ──────────────────────────────
    separator("STEP 2: KEYWORD RESEARCH")
    try:
        final_keywords = keyword_researcher.run(
            date=today,
            test_mode=test_mode,
            verbose=verbose,
        )
        results["steps"]["keyword_researcher"] = {
            "status": "success",
            "top_keywords": len(final_keywords),
        }
        results["output_files"]["keywords"] = str(
            config.OUTPUT_KEYWORD_LOGS_DIR / f"keywords_{today}.json"
        )
        log(f"\n✅ Step 2 complete — {len(final_keywords)} keywords scored and ranked.")
    except SystemExit:
        raise
    except Exception as e:
        log(f"Step 2 FAILED: {e}", "ERROR")
        if verbose:
            traceback.print_exc()
        results["steps"]["keyword_researcher"] = {"status": "failed", "error": str(e)}
        log("Cannot continue without keyword data.", "ERROR")
        return results

    # ──────────────────────────────
    # STEP 3: Generate SEO Block
    # ──────────────────────────────
    separator("STEP 3: SEO CONTENT GENERATION")
    try:
        success = seo_block_generator.run(
            date=today,
            test_mode=test_mode,
            auto_push=not test_mode,
            verbose=verbose,
        )
        results["steps"]["seo_block_generator"] = {
            "status": "success" if success else "partial",
        }
        results["output_files"]["blogpost_ts"] = str(config.BLOGPOSTS_TS_PATH)
        log(f"\n✅ Step 3 complete — SEO blocks injected into {config.BLOGPOSTS_TS_PATH}")
    except SystemExit:
        raise
    except Exception as e:
        log(f"Step 3 FAILED: {e}", "ERROR")
        if verbose:
            traceback.print_exc()
        results["steps"]["seo_block_generator"] = {"status": "failed", "error": str(e)}
        return results

    # ──────────────────────────────
    # FINAL SUMMARY
    # ──────────────────────────────
    results["success"] = True
    elapsed = (datetime.now() - start_time).total_seconds()

    separator("PIPELINE COMPLETE")
    log(f"✅ ALL 3 STEPS COMPLETED SUCCESSFULLY")
    log(f"   Total time: {elapsed:.1f}s")
    log(f"\n📁 Output files:")
    for label, path in results["output_files"].items():
        log(f"   • {label}: {path}")

    log(f"\n🎯 Next actions:")
    log(f"   Your SEO blocks are already live on the Market Signals page.")
    log(f"   (Test mode bypasses git push)")
    separator()

    return results


# ─────────────────────────────────────────────────────
# SCHEDULER (run daily at 8 AM and 6 PM)
# ─────────────────────────────────────────────────────

def run_scheduled(
    verbose: bool = False,
) -> None:
    """Run the pipeline on a daily schedule using the `schedule` library."""
    try:
        import schedule
        import time
    except ImportError:
        log("schedule package not installed. Run: pip install schedule", "ERROR")
        sys.exit(1)

    run_time_1 = "08:00"
    run_time_2 = "18:00"
    log(f"Scheduler started. Pipeline will run daily at {run_time_1} and {run_time_2}.")
    log("Press Ctrl+C to stop.\n")

    def job():
        log("⏰ Scheduled run triggered.")
        try:
            run_full_pipeline(verbose=verbose)
        except Exception as e:
            log(f"Scheduled run failed: {e}", "ERROR")
            traceback.print_exc()

    schedule.every().day.at(run_time_1).do(job)
    schedule.every().day.at(run_time_2).do(job)

    # Run once immediately on startup
    log("Running pipeline immediately on startup...")
    job()

    while True:
        schedule.run_pending()
        time.sleep(60)


# ─────────────────────────────────────────────────────
# REPORT VIEWER
# ─────────────────────────────────────────────────────

def list_generated_blocks() -> None:
    """List all generated SEO blocks with their dates and word counts."""
    import config

    blocks = sorted(config.OUTPUT_SEO_BLOCKS_DIR.glob("*.md"), reverse=True)
    if not blocks:
        log("No SEO blocks generated yet. Run the pipeline first.")
        return

    log(f"\n📚 Generated SEO blocks ({len(blocks)} total):")
    log(f"{'─' * 60}")
    for block_path in blocks:
        try:
            content = block_path.read_text(encoding="utf-8")
            word_count = len(content.split())
            # Extract title from H2
            import re
            title_match = re.search(r'^##\s+(.+)$', content, re.MULTILINE)
            title = title_match.group(1)[:55] if title_match else "No title"
            log(f"  📄 {block_path.name} — {word_count} words")
            log(f"     '{title}'")
        except Exception:
            log(f"  📄 {block_path.name}")
    log(f"{'─' * 60}")


# ─────────────────────────────────────────────────────
# MAIN ENTRY POINT
# ─────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Elesium SEO Automation Pipeline",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python run_pipeline.py               Full live run (auto-injects and pushes)
  python run_pipeline.py --test        Dry run with mock data
  python run_pipeline.py --schedule    Run daily at 08:00 and 18:00
  python run_pipeline.py --list        List all generated blocks
  python run_pipeline.py --validate    Check environment only
        """
    )
    parser.add_argument("--test", action="store_true", help="Use mock data (no live API calls)")
    parser.add_argument("--verbose", action="store_true", help="Show detailed debug output")
    parser.add_argument("--date", type=str, help="Target date (YYYY-MM-DD, default: today)")
    parser.add_argument("--schedule", action="store_true", help="Run daily at 08:00 and 18:00")
    parser.add_argument("--list", action="store_true", help="List all generated SEO blocks")
    parser.add_argument("--validate", action="store_true", help="Validate environment only")
    args = parser.parse_args()

    # List mode
    if args.list:
        list_generated_blocks()
        sys.exit(0)

    # Validate mode
    if args.validate:
        ok = validate_environment()
        sys.exit(0 if ok else 1)

    # Validate before running
    if not args.test:
        log("Validating environment before pipeline run...")
        ok = validate_environment()
        if not ok:
            log(
                "\nEnvironment issues found. Fix them or run with --test for mock mode.",
                "ERROR"
            )
            sys.exit(1)
        print()

    # Schedule mode
    if args.schedule:
        run_scheduled(verbose=args.verbose)
    else:
        # Single run
        result = run_full_pipeline(
            date=args.date,
            test_mode=args.test,
            verbose=args.verbose,
        )
        sys.exit(0 if result.get("success") else 1)
