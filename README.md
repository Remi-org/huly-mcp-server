# huly-mcp-server

MCP server for Huly workspace management. Exposes 116 tools for project management, documents, cards, messaging, calendar, and more through the [Model Context Protocol](https://modelcontextprotocol.io/).

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

## Available Tools (116)

### Issues & Projects (15)
- `list_projects` - List all projects
- `list_issues` - List issues with optional filters
- `get_issue` - Get full issue details with description
- `create_issue` - Create a new issue
- `update_issue` - Update an existing issue
- `delete_issue` - Delete an issue
- `add_comment` - Add a comment to an issue
- `search_issues` - Search issues by text query
- `add_issue_label` - Add a label to an issue
- `list_issue_templates` - List issue templates
- `get_issue_template` - Get template details
- `create_issue_template` - Create an issue template
- `update_issue_template` - Update an issue template
- `delete_issue_template` - Delete an issue template
- `create_issue_from_template` - Create issue using template defaults

### Organization (1)
- `list_statuses` - List issue statuses for a project

### Components (5)
- `list_components` - List project components
- `get_component` - Get component details
- `create_component` - Create a component
- `update_component` - Update a component
- `delete_component` - Delete a component

### Milestones (5)
- `list_milestones` - List project milestones
- `get_milestone` - Get milestone details
- `create_milestone` - Create a milestone
- `update_milestone` - Update a milestone
- `delete_milestone` - Delete a milestone

### Cards (6)
- `list_card_spaces` - List all card spaces
- `list_cards` - List cards with optional space filter
- `get_card` - Get full card details
- `create_card` - Create a new card
- `update_card` - Update a card
- `delete_card` - Delete a card

### Documents (6)
- `list_teamspaces` - List all teamspaces
- `list_documents` - List documents with optional teamspace filter
- `get_document` - Get full document with content
- `create_document` - Create a new document
- `update_document` - Update a document
- `delete_document` - Delete a document

### Attachments (7)
- `list_attachments` - List attachments on an issue or card
- `get_attachment` - Get attachment details
- `add_attachment` - Add an attachment to an object
- `update_attachment` - Update attachment metadata
- `delete_attachment` - Delete an attachment
- `pin_attachment` - Pin or unpin an attachment
- `download_attachment` - Get download info for an attachment

### Comments (3)
- `list_comments` - List comments on an object
- `update_comment` - Update a comment
- `delete_comment` - Delete a comment

### Search (1)
- `fulltext_search` - Search across all workspace objects

### Contacts (8)
- `list_persons` - List all persons
- `get_person` - Get person details
- `create_person` - Create a person
- `update_person` - Update a person
- `delete_person` - Delete a person
- `list_employees` - List active employees
- `list_organizations` - List organizations
- `create_organization` - Create an organization

### Storage (1)
- `upload_file` - Upload a file to the workspace

### Channels (11)
- `list_channels` - List all channels
- `get_channel` - Get channel details
- `create_channel` - Create a channel
- `update_channel` - Update a channel
- `delete_channel` - Delete a channel
- `list_channel_messages` - List messages in a channel
- `send_channel_message` - Send a message to a channel
- `list_direct_messages` - List direct message conversations
- `list_thread_replies` - List replies in a thread
- `add_thread_reply` - Add a reply to a thread
- `delete_thread_reply` - Delete a thread reply

### Time Tracking (8)
- `log_time` - Log time spent on an issue
- `get_time_report` - Get a time spend report
- `list_time_spend_reports` - List time reports with filters
- `get_detailed_time_report` - Get aggregated time report for a project
- `list_work_slots` - List work slots
- `create_work_slot` - Create a work slot
- `start_timer` - Start a timer for an issue
- `stop_timer` - Stop a timer

### Calendar (8)
- `list_events` - List calendar events
- `get_event` - Get event details
- `create_event` - Create a calendar event
- `update_event` - Update a calendar event
- `delete_event` - Delete a calendar event
- `list_recurring_events` - List recurring events
- `create_recurring_event` - Create a recurring event
- `list_event_instances` - List instances of a recurring event

### Activity (8)
- `list_activity` - List activity messages for an object
- `add_reaction` - Add an emoji reaction
- `remove_reaction` - Remove an emoji reaction
- `list_reactions` - List reactions on a message
- `save_message` - Save a message for later
- `unsave_message` - Remove a saved message
- `list_saved_messages` - List saved messages
- `list_mentions` - List user mentions

### Notifications (13)
- `list_notifications` - List inbox notifications
- `get_notification` - Get notification details
- `mark_notification_read` - Mark a notification as read
- `mark_all_notifications_read` - Mark all as read
- `archive_notification` - Archive a notification
- `archive_all_notifications` - Archive all notifications
- `delete_notification` - Delete a notification
- `get_notification_context` - Get notification context
- `list_notification_contexts` - List notification contexts
- `pin_notification_context` - Pin/unpin a notification context
- `list_notification_settings` - List notification settings
- `update_notification_provider_setting` - Update notification provider setting
- `get_unread_notification_count` - Get unread count

### Workspace (10)
- `list_workspace_members` - List workspace members
- `update_member_role` - Update a member's role
- `get_workspace_info` - Get workspace info
- `list_workspaces` - List available workspaces
- `create_workspace` - Create a workspace
- `delete_workspace` - Delete a workspace
- `get_user_profile` - Get current user profile
- `update_user_profile` - Update user profile
- `update_guest_settings` - Update guest access settings
- `get_regions` - Get available regions

## Testing

```bash
pnpm test
pnpm test:coverage
```

## License

ISC
