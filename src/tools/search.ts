import { z } from 'zod'
import tracker from '@hcengineering/tracker'
import type { ToolDefinition, ToolHandler } from '../types'

export const definitions: ToolDefinition[] = [
  {
    name: 'fulltext_search',
    description: 'Search issues by text query across titles and descriptions',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query text' },
        limit: { type: 'number', description: 'Maximum results to return (default 50)' },
      },
      required: ['query'],
    },
  },
]

const fulltextSearch: ToolHandler = async (client, args) => {
  const input = z.object({
    query: z.string().min(1),
    limit: z.number().optional(),
  }).parse(args)

  const results = await client.findAll(
    tracker.class.Issue,
    { $search: input.query },
    { limit: input.limit || 50 }
  )

  return results.map((r: any) => ({
    id: r._id,
    _class: r._class,
    identifier: r.identifier,
    title: r.title,
    space: r.space,
    modifiedOn: r.modifiedOn,
  }))
}

export const handlers: Record<string, ToolHandler> = {
  fulltext_search: fulltextSearch,
}
