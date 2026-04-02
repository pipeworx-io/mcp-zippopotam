# @pipeworx/mcp-zippopotam

MCP server for ZIP and postal code lookups via Zippopotam.us

## Tools

| Tool | Description |
|------|-------------|
| `lookup_zipcode` | Look up place info (city, state, coordinates) for a ZIP/postal code |
| `lookup_city` | Get all postal codes for a city in a given country and state |

## Quickstart (Pipeworx Gateway)

```bash
curl -X POST https://gateway.pipeworx.io/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "lookup_zipcode",
      "arguments": { "country": "us", "zipcode": "90210" }
    }
  }'
```

## License

MIT
