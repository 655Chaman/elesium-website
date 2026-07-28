# Auto-Sync Setup - Real-time GitHub Development

Your repository is now configured for **real-time GitHub synchronization**! Every change you make will automatically be committed and pushed to GitHub, deploying live to elesium.online within 2-3 minutes.

## 🚀 Quick Start

### Option 1: Auto-sync Only
Monitor file changes and auto-commit/push without running the dev server:
```bash
npm run watch
```

### Option 2: Dev Server + Auto-sync (Recommended)
Run both the local dev server AND auto-sync in parallel:
```bash
npm run dev:sync
```

This will:
- Start Vite dev server at `http://localhost:5173`
- Watch for file changes and auto-sync to GitHub
- Show you local changes instantly + deploy to live site automatically

## 📋 How It Works

1. **File Watcher**: Monitors `src/`, `public/`, and config files for changes
2. **Debouncing**: Waits 2 seconds after your last change before syncing
3. **Auto-commit**: Creates commits with timestamps and lists changed files
4. **Auto-push**: Pushes to GitHub every 30 seconds (or after debounce period)
5. **Live Deploy**: GitHub Actions builds and deploys to elesium.online

## 🎯 Example Workflow

```bash
# Start auto-sync with dev server
npm run dev:sync

# Make changes in VSCode to any component
# Save the file (Cmd+S)
# → Console shows: "📝 Changed: src/components/Hero.tsx"
# → After 2 seconds: "✅ Committed changes"
# → After commit: "✅ Pushed to GitHub"
# → After 2-3 minutes: Changes live at https://elesium.online

# When done, press Ctrl+C to stop
```

## 📊 Console Output

The auto-sync will show you real-time status:
```
🔄 Auto-sync watcher started...
📁 Watching: src/**/*, public/**/*...
⏱️  Sync interval: 30 seconds

📝 Changed: src/components/sections/Hero.tsx
📝 Changed: src/index.css

🔄 Syncing 2 change(s) to GitHub...
✅ Committed changes
✅ Pushed to GitHub
🚀 Changes will be live at https://elesium.online in ~2-3 minutes
```

## ⚙️ Configuration

You can customize the auto-sync behavior by editing `watch-and-sync.js`:

```javascript
const SYNC_INTERVAL = 30000; // How often to push (30 seconds)
const DEBOUNCE_DELAY = 2000;  // Wait time after last change (2 seconds)
```

## 🛑 Stopping Auto-Sync

Press `Ctrl+C` in the terminal. The script will:
1. Sync any pending changes
2. Clean up the file watcher
3. Exit gracefully

## 📝 Git History

Auto-sync creates commits like:
```
Auto-sync: 02/06/2026, 05:36:00 PM

Changed files:
- src/components/sections/Hero.tsx
- src/index.css
```

This is normal for real-time development workflows. If you prefer cleaner history, use `npm run deploy` for manual deployments instead.

## 🔄 Alternative: Manual Deploy

If you prefer to control when changes go live:
```bash
# Work normally with the dev server
npm run dev

# When ready to deploy
npm run deploy
```

## 🎨 What Gets Watched

- ✅ All source files: `src/**/*`
- ✅ Public assets: `public/**/*`
- ✅ Config files: `vite.config.ts`, `package.json`, etc.
- ❌ Build outputs: `dist/**/*`
- ❌ Dependencies: `node_modules/**/*`
- ❌ Git files: `.git/**/*`

## 🚨 Troubleshooting

### Auto-sync not pushing?
Check that you're authenticated with GitHub:
```bash
git config user.name
git config user.email
```

### Changes not appearing live?
1. Check GitHub Actions: https://github.com/655Chaman/elesium-website/actions
2. Wait 2-3 minutes for deployment to complete
3. Hard refresh browser (Cmd+Shift+R)

### Too many commits?
Consider using manual deploy instead:
```bash
# Stop auto-sync (Ctrl+C)
# Use manual deployment
npm run deploy
```

---

**🎉 You're all set for real-time development!** Every change you make will automatically sync to GitHub and deploy to your live site.
