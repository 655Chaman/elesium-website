#!/usr/bin/env bash
set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Executing Craig Campbell Parasite Syndication curl suite for $(basename "$DIR")..."

if [ -n "$DEVTO_API_KEY" ]; then
  echo "--- Publishing to Dev.to ---"
  "$DIR/publish_devto.sh"
else
  echo "[Notice] DEVTO_API_KEY not set. Skipping live Dev.to publish. Test payload valid."
fi

if [ -n "$HASHNODE_API_KEY" ]; then
  echo "--- Publishing to Hashnode ---"
  "$DIR/publish_hashnode.sh"
else
  echo "[Notice] HASHNODE_API_KEY not set. Skipping live Hashnode publish. Test payload valid."
fi

echo "Syndication execution script complete."
