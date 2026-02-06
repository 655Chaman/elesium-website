#!/usr/bin/env node

/**
 * Auto-sync script for real-time GitHub synchronization
 * Watches for file changes and automatically commits & pushes to GitHub
 */

import chokidar from 'chokidar';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, relative } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const WATCH_PATHS = ['src/**/*', 'public/**/*', 'index.html', 'package.json', 'vite.config.ts', 'tsconfig.json'];
const IGNORE_PATHS = ['**/node_modules/**', '**/dist/**', '**/.git/**', '**/.gemini/**'];
const SYNC_INTERVAL = 30000; // 30 seconds
const DEBOUNCE_DELAY = 2000; // 2 seconds

// State
let changedFiles = new Set();
let syncTimer = null;
let isFirstRun = true;
let isSyncing = false;

console.log('🔄 Auto-sync watcher started...');
console.log('📁 Watching:', WATCH_PATHS.join(', '));
console.log('⏱️  Sync interval:', SYNC_INTERVAL / 1000, 'seconds\n');

// Initialize file watcher
const watcher = chokidar.watch(WATCH_PATHS, {
    ignored: IGNORE_PATHS,
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100
    }
});

// File change handler
watcher
    .on('change', (filePath) => {
        const relativePath = relative(process.cwd(), filePath);
        changedFiles.add(relativePath);
        console.log('📝 Changed:', relativePath);
        scheduleSync();
    })
    .on('add', (filePath) => {
        if (isFirstRun) return;
        const relativePath = relative(process.cwd(), filePath);
        changedFiles.add(relativePath);
        console.log('➕ Added:', relativePath);
        scheduleSync();
    })
    .on('unlink', (filePath) => {
        const relativePath = relative(process.cwd(), filePath);
        changedFiles.add(relativePath);
        console.log('➖ Deleted:', relativePath);
        scheduleSync();
    })
    .on('error', (error) => {
        console.error('❌ Watcher error:', error);
    })
    .on('ready', () => {
        isFirstRun = false;
        console.log('✅ Watcher ready. Monitoring for changes...\n');
    });

// Schedule sync with debouncing
function scheduleSync() {
    if (syncTimer) {
        clearTimeout(syncTimer);
    }

    syncTimer = setTimeout(() => {
        if (changedFiles.size > 0 && !isSyncing) {
            performSync();
        }
    }, DEBOUNCE_DELAY);
}

// Perform git sync
async function performSync() {
    if (isSyncing) {
        console.log('⏳ Sync already in progress, skipping...');
        return;
    }

    isSyncing = true;
    const files = Array.from(changedFiles);
    changedFiles.clear();

    console.log('\n🔄 Syncing', files.length, 'change(s) to GitHub...');

    const timestamp = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const commitMessage = `Auto-sync: ${timestamp}\n\nChanged files:\n${files.map(f => `- ${f}`).join('\n')}`;

    try {
        // Add all changes
        await execPromise('git add -A');

        // Check if there are changes to commit
        const status = await execPromise('git status --porcelain');

        if (!status.trim()) {
            console.log('ℹ️  No changes to commit');
            isSyncing = false;
            return;
        }

        // Commit changes
        await execPromise(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`);
        console.log('✅ Committed changes');

        // Push to GitHub
        await execPromise('git push origin main');
        console.log('✅ Pushed to GitHub');
        console.log('🚀 Changes will be live at https://elesium.online in ~2-3 minutes\n');

    } catch (error) {
        console.error('❌ Sync failed:', error.message);

        // If commit failed because there's nothing to commit, that's okay
        if (error.message.includes('nothing to commit')) {
            console.log('ℹ️  No changes to commit\n');
        } else {
            // Re-add files to changed set for retry
            files.forEach(f => changedFiles.add(f));
        }
    } finally {
        isSyncing = false;
    }
}

// Execute command as promise
function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout);
        });
    });
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n\n🛑 Shutting down auto-sync...');

    // Perform final sync if there are pending changes
    if (changedFiles.size > 0) {
        console.log('📤 Syncing final changes...');
        await performSync();
    }

    await watcher.close();
    console.log('✅ Auto-sync stopped\n');
    process.exit(0);
});

// Keep process alive
process.stdin.resume();
