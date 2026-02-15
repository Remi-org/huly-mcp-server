import { z } from 'zod'
import core from '@hcengineering/core'
import type { ToolDefinition, ToolHandler } from '../types'

export const definitions: ToolDefinition[] = [
  {
    name: 'fulltext_search',
    description: 'Search across all documents, issues, and objects by text query',
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
    core.class.Doc,
    { $search: input.query },
    { limit: input.limit || 50 }
  )

  return results.map((r: any) => ({
    id: r._id,
    _class: r._class,
    space: r.space,
    modifiedOn: r.modifiedOn,
  }))
}

export const handlers: Record<string, ToolHandler> = {
  fulltext_search: fulltextSearch,
}
