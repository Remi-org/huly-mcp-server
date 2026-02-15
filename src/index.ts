#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { HulyClient } from './huly-client'

const server = new Server(
  {
    name: 'huly-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

let hulyClient: HulyClient | null = null

async function ensureConnected(): Promise<HulyClient> {
  if (!hulyClient) {
    hulyClient = new HulyClient({
      url: process.env.HULY_URL || 'https://citadel.remi.casa',
      email: process.env.HULY_EMAIL || '',
      password: process.env.HULY_PASSWORD || '',
      workspace: process.env.HULY_WORKSPACE || 'remi',
    })
    await hulyClient.connect()
  }
  return hulyClient
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_projects',
        description: 'List all projects in Huly workspace',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'list_issues',
        description: 'List issues with optional filters',
        inputSchema: {
          type: 'object',
          properties: {
            projectId: {
              type: 'string',
              description: 'Filter by project ID',
            },
            status: {
              type: 'string',
              description: 'Filter by status',
            },
            assignee: {
              type: 'string',
              description: 'Filter by assignee',
            },
          },
        },
      },
      {
        name: 'get_issue',
        description: 'Get details of a specific issue by ID',
        inputSchema: {
          type: 'object',
          properties: {
            issueId: {
              type: 'string',
              description: 'The issue ID to retrieve',
            },
          },
          required: ['issueId'],
        },
      },
    ],
  }
})

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  try {
    const client = await ensureConnected()

    switch (name) {
      case 'list_projects': {
        const projects = await client.listProjects()
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                projects.map((p) => ({
                  id: p._id,
                  identifier: p.identifier,
                  name: p.name,
                  description: p.description,
                })),
                null,
                2
              ),
            },
          ],
        }
      }

      case 'list_issues': {
        const filters = args as {
          projectId?: string
          status?: string
          assignee?: string
        }
        const issues = await client.listIssues(filters)
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                issues.map((i) => ({
                  id: i._id,
                  identifier: i.identifier,
                  title: i.title,
                  status: i.status,
                  assignee: i.assignee,
                  number: i.number,
                })),
                null,
                2
              ),
            },
          ],
        }
      }

      case 'get_issue': {
        const { issueId } = args as { issueId: string }
        const issue = await client.getIssue(issueId)
        if (!issue) {
          return {
            content: [
              {
                type: 'text',
                text: `Issue ${issueId} not found`,
              },
            ],
            isError: true,
          }
        }
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(issue, null, 2),
            },
          ],
        }
      }

      default:
        return {
          content: [
            {
              type: 'text',
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    }
  }
})

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Huly MCP server running on stdio')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
