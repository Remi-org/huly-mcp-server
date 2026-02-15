import { describe, it, expect, beforeEach } from 'vitest'
import { handlers, definitions } from '../../tools/search'
import { createMockClient } from '../helpers'

describe('search tool definitions', () => {
  it('exports 1 tool definition', () => {
    expect(definitions).toHaveLength(1)
  })

  it('has expected tool name', () => {
    const names = definitions.map((d) => d.name)
    expect(names).toContain('fulltext_search')
  })
})

describe('search handlers', () => {
  let client: ReturnType<typeof createMockClient>

  beforeEach(() => {
    client = createMockClient()
  })

  describe('fulltext_search', () => {
    it('returns mapped search results', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'doc1', _class: 'tracker:class:Issue', space: 'p1', modifiedOn: 1700000000 },
        { _id: 'doc2', _class: 'document:class:Document', space: 'ts1', modifiedOn: 1700000001 },
      ])
      const result: any = await handlers.fulltext_search(client, { query: 'test' })
      expect(result).toEqual([
        { id: 'doc1', _class: 'tracker:class:Issue', space: 'p1', modifiedOn: 1700000000 },
        { id: 'doc2', _class: 'document:class:Document', space: 'ts1', modifiedOn: 1700000001 },
      ])
    })

    it('passes search query and default limit', async () => {
      await handlers.fulltext_search(client, { query: 'hello' })
      expect(client.findAll).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ $search: 'hello' }),
        expect.objectContaining({ limit: 50 })
      )
    })

    it('uses custom limit when provided', async () => {
      await handlers.fulltext_search(client, { query: 'hello', limit: 10 })
      expect(client.findAll).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ $search: 'hello' }),
        expect.objectContaining({ limit: 10 })
      )
    })

    it('throws on missing query', async () => {
      await expect(handlers.fulltext_search(client, {})).rejects.toThrow()
    })

    it('throws on empty query', async () => {
      await expect(handlers.fulltext_search(client, { query: '' })).rejects.toThrow()
    })
  })
})
