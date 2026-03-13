import { z } from 'zod'
import type { ToolDefinition, ToolHandler } from '../types'

export const definitions: ToolDefinition[] = [
  {
    name: 'fulltext_search',
    description: 'Search across all content in the workspace — documents, cards, issues, messages, and more. Returns results ranked by relevance.',
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

  const connection = client.connection
  if (connection?.searchFulltext) {
    const results = await connection.searchFulltext(
      { query: input.query },
      { limit: input.limit || 50 }
    )
    return (results.docs || []).map((r: any) => ({
      id: r.id ?? r.doc?._id,
      _class: r.doc?._class,
      title: r.title,
      shortTitle: r.shortTitle,
      score: r.score,
    }))
  }

  const results = await client.findAll(
    'core:class:Doc' as any,
    { $search: input.query },
    { limit: input.limit || 50 }
  )
  return results.map((r: any) => ({
    id: r._id,
    _class: r._class,
    title: r.title || r.name,
    score: r.$score,
  }))
}

export const handlers: Record<string, ToolHandler> = {
  fulltext_search: fulltextSearch,
}
