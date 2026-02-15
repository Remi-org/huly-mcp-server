import { describe, it, expect, beforeEach } from 'vitest'
import { handlers, definitions } from '../../tools/organization'
import { createMockClient } from '../helpers'

describe('organization tool definitions', () => {
  it('exports 1 tool definition', () => {
    expect(definitions).toHaveLength(1)
  })

  it('has list_statuses', () => {
    const names = definitions.map((d) => d.name)
    expect(names).toContain('list_statuses')
  })

  it('requires projectId', () => {
    expect(definitions[0].inputSchema.required).toContain('projectId')
  })
})

describe('organization handlers', () => {
  let client: ReturnType<typeof createMockClient>

  beforeEach(() => {
    client = createMockClient()
  })

  describe('list_statuses', () => {
    it('returns mapped status data', async () => {
      client.findAll.mockResolvedValue([
        { _id: 's1', name: 'Open', category: 'active' },
      ])
      const result: any = await handlers.list_statuses(client, { projectId: 'p1' })
      expect(result).toEqual([{ id: 's1', name: 'Open', category: 'active' }])
    })

    it('passes projectId to query', async () => {
      await handlers.list_statuses(client, { projectId: 'p1' })
      expect(client.findAll).toHaveBeenCalledWith(
        expect.anything(), expect.objectContaining({ space: 'p1' })
      )
    })

    it('throws on missing projectId', async () => {
      await expect(handlers.list_statuses(client, {})).rejects.toThrow()
    })
  })
})
