# huly-mcp-server

MCP server for Huly workspace management. Exposes Huly's project management, documents, cards, and attachments through the [Model Context Protocol](https://modelcontextprotocol.io/).

## Requirements

- Node.js >= 20
- pnpm
- A running Huly instance with API access

## Setup

```bash
pnpm install
cp .env.example .env
# Edit .env with your Huly credentials
```

## Configuration

| Variable | Description |
|---|---|
| `HULY_URL` | Huly instance URL (e.g. `https://huly.example.com`) |
| `HULY_EMAIL` | Account email |
| `HULY_PASSWORD` | Account password |
| `HULY_WORKSPACE` | Workspace identifier |
| `LOG_LEVEL` | Logging level: `debug`, `info`, `warn`, `error` (default: `info`) |

## Running

```bash
pnpm start
```

### Docker

```bash
docker build -t huly-mcp-server .
docker run --env-file .env huly-mcp-server
```

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "huly": {
      "command": "npx",
      "args": ["tsx", "src/index.ts"],
      "cwd": "/path/to/huly-mcp-server",
      "env": {
        "HULY_URL": "https://huly.example.com",
        "HULY_EMAIL": "your-email@example.com",
        "HULY_PASSWORD": "your-password",
        "HULY_WORKSPACE": "your-workspace"
      }
    }
  }
}
```

## Available Tools

### Issues & Projects
- `list_projects` - List all projects
- `list_issues` - List issues with optional filters (project, status, assignee)
- `get_issue` - Get full issue details with description
- `create_issue` - Create a new issue
- `update_issue` - Update an existing issue
- `add_comment` - Add a comment to an issue
- `search_issues` - Search issues by text query

### Organization
- `list_statuses` - List issue statuses for a project
- `list_components` - List project components
- `list_milestones` - List project milestones

### Cards
- `list_card_spaces` - List all card spaces
- `list_cards` - List cards with optional space filter
- `get_card` - Get full card details
- `create_card` - Create a new card
- `update_card` - Update a card
- `delete_card` - Delete a card

### Documents
- `list_teamspaces` - List all teamspaces
- `list_documents` - List documents with optional teamspace filter
- `get_document` - Get full document with content
- `create_document` - Create a new document
- `update_document` - Update a document
- `delete_document` - Delete a document

### Attachments
- `list_attachments` - List attachments on an issue or card
- `delete_attachment` - Delete an attachment

## Testing

```bash
pnpm test
pnpm test:coverage
```

## License

ISC
