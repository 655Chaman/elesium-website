#!/usr/bin/env bash
# Syndication Publisher for: context-parallelism-ring-kv-communication-overlap-2m-tokens
set -e

echo "=== Publishing to Dev.to ==="
if [ -n "$DEVTO_API_KEY" ]; then
  curl -s -X POST "https://dev.to/api/articles" \
    -H "api-key: $DEVTO_API_KEY" \
    -H "Content-Type: application/json" \
    -d @automation/syndications/context-parallelism-ring-kv-communication-overlap-2m-tokens/dev_to_payload.json | jq .url
else
  echo "DEVTO_API_KEY not set. Skipping Dev.to."
fi

echo "=== Publishing to Hashnode ==="
if [ -n "$HASHNODE_API_KEY" ]; then
  curl -s -X POST "https://api.hashnode.com" \
    -H "Authorization: $HASHNODE_API_KEY" \
    -H "Content-Type: application/json" \
    -d @automation/syndications/context-parallelism-ring-kv-communication-overlap-2m-tokens/hashnode_payload.json | jq .
else
  echo "HASHNODE_API_KEY not set. Skipping Hashnode."
fi

echo "=== Publishing to Medium ==="
if [ -n "$MEDIUM_API_KEY" ] && [ -n "$MEDIUM_AUTHOR_ID" ]; then
  curl -s -X POST "https://api.medium.com/v1/users/$MEDIUM_AUTHOR_ID/posts" \
    -H "Authorization: Bearer $MEDIUM_API_KEY" \
    -H "Content-Type: application/json" \
    -d @automation/syndications/context-parallelism-ring-kv-communication-overlap-2m-tokens/medium_payload.json | jq .data.url
else
  echo "MEDIUM_API_KEY or MEDIUM_AUTHOR_ID not set. Skipping Medium."
fi
