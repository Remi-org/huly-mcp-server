import { describe, it, expect, beforeEach } from 'vitest'
import { handlers, definitions } from '../../tools/organization'
import { createMockClient } from '../helpers'

describe('organization tool definitions', () => {
  it('exports 3 tool definitions', () => {
    expect(definitions).toHaveLength(3)
  })

  it('has all expected tool names', () => {
    const names = definitions.map((d) => d.name)
    expect(names).toContain('list_statuses')
    expect(names).toContain('list_components')
    expect(names).toContain('list_milestones')
  })

  it('all require projectId', () => {
    for (const def of definitions) {
      expect(def.inputSchema.required).toContain('projectId')
    }
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

  describe('list_components', () => {
    it('returns mapped component data', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'c1', label: 'Frontend', description: 'UI stuff' },
      ])
      const result: any = await handlers.list_components(client, { projectId: 'p1' })
      expect(result).toEqual([{ id: 'c1', label: 'Frontend', description: 'UI stuff' }])
    })

    it('throws on missing projectId', async () => {
      await expect(handlers.list_components(client, {})).rejects.toThrow()
    })
  })

  describe('list_milestones', () => {
    it('returns mapped milestone data', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'm1', label: 'v1.0', description: 'First release', targetDate: 1700000000, status: 'planned' },
      ])
      const result: any = await handlers.list_milestones(client, { projectId: 'p1' })
      expect(result).toEqual([{
        id: 'm1', label: 'v1.0', description: 'First release', targetDate: 1700000000, status: 'planned',
      }])
    })

    it('throws on missing projectId', async () => {
      await expect(handlers.list_milestones(client, {})).rejects.toThrow()
    })
  })
})
