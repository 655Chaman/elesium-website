---
description: Real-time auto-sync development workflow
---

# Real-time Auto-Sync Deployment

Automatically sync your local changes to GitHub and deploy to elesium.online in real-time.

## Quick Start Commands

### Start Auto-Sync with Dev Server (Recommended)
// turbo-all
```bash
npm run dev:sync
```

This runs both:
- Local dev server at `http://localhost:5173`
- Auto-sync watcher for GitHub

### Auto-Sync Only (No Dev Server)
// turbo-all  
```bash
npm run watch
```

## How It Works

1. **Make changes** to any file in `src/`, `public/`, or config files
2. **Save the file** (Cmd+S / Ctrl+S)
3. **Auto-commit** happens after 2 seconds of no changes
4. **Auto-push** to GitHub every 30 seconds
5. **Live deployment** via GitHub Actions (~2-3 minutes)

## Example Workflow

```bash
# Start real-time development
npm run dev:sync

# Edit src/components/sections/Hero.tsx
# Save (Cmd+S)
# → Console: "📝 Changed: src/components/sections/Hero.tsx"
# → Console: "✅ Committed changes"
# → Console: "✅ Pushed to GitHub"
# → Console: "🚀 Changes will be live at https://elesium.online in ~2-3 minutes"

# Stop with Ctrl+C when done
```

## Stop Auto-Sync

Press `Ctrl+C` in the terminal. Any pending changes will be synced before stopping.

## Alternative: Manual Deploy

If you prefer manual control:
```bash
# Work with dev server
npm run dev

# Deploy when ready
// turbo
npm run deploy
```

## Verify Deployment

- **GitHub Actions**: https://github.com/655Chaman/elesium-website/actions
- **Live Site**: https://elesium.online
- **Wait time**: 2-3 minutes after push

## Configuration

Edit `watch-and-sync.js` to customize:
- `SYNC_INTERVAL`: How often to push (default: 30s)
- `DEBOUNCE_DELAY`: Wait after last change (default: 2s)

## Troubleshooting

**Not pushing?**
- Check git config: `git config user.name` and `git config user.email`

**Not deploying?**
- Check GitHub Actions status
- Wait 2-3 minutes
- Hard refresh browser (Cmd+Shift+R)

**Too many commits?**
- Use `npm run deploy` for manual deployment instead

---

See [AUTO-SYNC.md](file:///Users/krdeeksha/ELESIUM%20WEBSITE/AUTO-SYNC.md) for detailed documentation.
