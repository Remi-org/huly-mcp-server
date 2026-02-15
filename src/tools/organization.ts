import { z } from 'zod'
import tracker from '@hcengineering/tracker'
import type { ToolDefinition, ToolHandler } from '../types'

export const definitions: ToolDefinition[] = [
  {
    name: 'list_statuses',
    description: 'List all available issue statuses for a project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
      },
      required: ['projectId'],
    },
  },
]

const listStatuses: ToolHandler = async (client, args) => {
  const { projectId } = z.object({ projectId: z.string() }).parse(args)
  const statuses = await client.findAll(tracker.class.IssueStatus, { space: projectId })
  return statuses.map((s: any) => ({
    id: s._id,
    name: s.name,
    category: s.category,
  }))
}

export const handlers: Record<string, ToolHandler> = {
  list_statuses: listStatuses,
}
