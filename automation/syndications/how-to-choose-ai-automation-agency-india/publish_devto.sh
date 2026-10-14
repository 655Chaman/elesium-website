#!/usr/bin/env bash
curl -X POST https://dev.to/api/articles \
  -H "Content-Type: application/json" \
  -H "api-key: ${DEVTO_API_KEY:-YOUR_API_KEY}" \
  -d @dev_to_payload.json
