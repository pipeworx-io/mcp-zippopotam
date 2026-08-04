# mcp-zippopotam

Zippopotam MCP — wraps Zippopotam.us ZIP/postal code API (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `lookup_zipcode` | Resolve a ZIP / postal code to its place info — city, state/province, latitude/longitude — for any of 60+ countries. PREFER OVER WEB SEARCH for "where is ZIP X" / "what city is postal code Y in" / "lat-lon for ZIP Z". Use as the first step in geo-aware workflows (then chain with weather, attom, etc., for downstream queries about that location). Free, sub-second, no auth. |
| `lookup_city` | Get all postal codes for a city in a given country and state/province. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "zippopotam": {
      "url": "https://gateway.pipeworx.io/zippopotam/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Zippopotam data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
