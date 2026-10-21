#!/usr/bin/env bash
curl -X POST https://gql.hashnode.com \
  -H "Content-Type: application/json" \
  -H "Authorization: ${HASHNODE_API_KEY:-YOUR_API_KEY}" \
  -d @hashnode_payload.json
