---
description: Deploy local changes to live site
---

# Quick Deploy to Live Site

This workflow commits your current changes and deploys them to elesium.online.

## Steps

1. **Build and verify locally**
```bash
npm run build
```

// turbo-all
2. **Commit and push changes**
```bash
git add -A && git commit -m "Update: $(date '+%Y-%m-%d %H:%M')" && git push origin main
```

3. **Check deployment status**
   - Visit: https://github.com/655Chaman/elesium-website/actions
   - Wait for the build to complete (~2-3 minutes)
   - Your changes will be live at https://elesium.online

## Quick Command

For one-step deployment, run:
```bash
npm run build && git add -A && git commit -m "Update: $(date '+%Y-%m-%d %H:%M')" && git push origin main
```

## Notes
- Changes typically go live within 2-3 minutes
- GitHub Actions automatically builds and deploys on every push to main
- Always verify build succeeds before pushing to avoid breaking the live site
