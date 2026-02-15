# Huly MCP Server

MCP server that exposes Huly workspace data to AI agents like Claude.

## Features

- `list_projects` - List all projects in the workspace
- `list_issues` - List issues with optional filters (projectId, status, assignee)
- `get_issue` - Get details of a specific issue by ID

## Setup

```bash
pnpm install
```

## Testing

### 1. Test with MCP Inspector

```bash
npx @modelcontextprotocol/inspector tsx src/index.ts
```

This will open a web UI at `http://localhost:6274` where you can:
- See all available tools
- Execute tools interactively
- View responses

### 2. Test with Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "huly": {
      "command": "tsx",
      "args": ["/Users/denissellu/src/remi/huly-mcp-server/src/index.ts"],
      "env": {
        "HULY_URL": "https://citadel.remi.casa",
        "HULY_EMAIL": "your-email@goremi.co.uk",
        "HULY_PASSWORD": "your-password",
        "HULY_WORKSPACE": "remi"
      }
    }
  }
}
```

Restart Claude Desktop completely (not just close window), then try:
- "List my Huly projects"
- "Show me all issues"
- "What issues are in the REM project?"

## Current Status

- ✅ MCP server structure complete
- ✅ Three tools implemented (list_projects, list_issues, get_issue)
- ✅ Tested with MCP Inspector
- ⚠️ Currently using mock data
- ❌ Real Huly connection pending (version mismatch issue with npm packages)

## Next Steps

To connect to real Huly instance, need to resolve package version issue:
- Parent project uses @hcengineering packages v0.6.500 (from platform monorepo)
- NPM only has v0.7.x which is incompatible with citadel.remi.casa
- Options: link to parent packages or update Huly instance

## Development

```bash
# Start with mock data
pnpm start

# Test connection (when real client is ready)
pnpm test-connection
```
