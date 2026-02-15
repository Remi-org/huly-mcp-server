import { describe, it, expect, beforeEach } from 'vitest'
import { handlers, definitions } from '../../tools/components'
import { createMockClient } from '../helpers'
import { NotFoundError } from '../../errors'

describe('components tool definitions', () => {
  it('exports 5 tool definitions', () => {
    expect(definitions).toHaveLength(5)
  })

  it('has all expected tool names', () => {
    const names = definitions.map((d) => d.name)
    expect(names).toContain('list_components')
    expect(names).toContain('get_component')
    expect(names).toContain('create_component')
    expect(names).toContain('update_component')
    expect(names).toContain('delete_component')
  })
})

describe('components handlers', () => {
  let client: ReturnType<typeof createMockClient>

  beforeEach(() => {
    client = createMockClient()
  })

  describe('list_components', () => {
    it('returns mapped component data', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'comp1', label: 'Frontend', description: 'UI components' },
      ])
      const result: any = await handlers.list_components(client, { projectId: 'p1' })
      expect(result).toEqual([{ id: 'comp1', label: 'Frontend', description: 'UI components' }])
    })

    it('filters by project', async () => {
      await handlers.list_components(client, { projectId: 'p1' })
      expect(client.findAll).toHaveBeenCalledWith(
        expect.anything(), expect.objectContaining({ space: 'p1' })
      )
    })

    it('throws on missing projectId', async () => {
      await expect(handlers.list_components(client, {})).rejects.toThrow()
    })
  })

  describe('get_component', () => {
    it('returns component when found', async () => {
      const comp = { _id: 'comp1', label: 'Frontend' }
      client.findOne.mockResolvedValue(comp)
      const result = await handlers.get_component(client, { componentId: 'comp1' })
      expect(result).toEqual(comp)
    })

    it('throws NotFoundError when missing', async () => {
      await expect(handlers.get_component(client, { componentId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })

    it('throws on missing componentId', async () => {
      await expect(handlers.get_component(client, {})).rejects.toThrow()
    })
  })

  describe('create_component', () => {
    it('creates component with required fields', async () => {
      const result: any = await handlers.create_component(client, { projectId: 'p1', label: 'Backend' })
      expect(result.success).toBe(true)
      expect(result.componentId).toBeDefined()
      expect(client.createDoc).toHaveBeenCalled()
    })

    it('creates component with optional fields', async () => {
      const result: any = await handlers.create_component(client, {
        projectId: 'p1', label: 'Backend', description: 'Server', lead: 'user1',
      })
      expect(result.success).toBe(true)
      expect(client.createDoc).toHaveBeenCalledWith(
        expect.anything(), 'p1',
        expect.objectContaining({ label: 'Backend', description: 'Server', lead: 'user1' }),
        expect.any(String)
      )
    })

    it('throws on missing required fields', async () => {
      await expect(handlers.create_component(client, { projectId: 'p1' })).rejects.toThrow()
    })
  })

  describe('update_component', () => {
    it('updates component label', async () => {
      const comp = { _id: 'comp1', label: 'Old', space: 'p1' }
      client.findOne.mockResolvedValue(comp)

      const result: any = await handlers.update_component(client, { componentId: 'comp1', label: 'New' })
      expect(result.success).toBe(true)
      expect(client.updateDoc).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing component', async () => {
      await expect(handlers.update_component(client, { componentId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })

    it('throws on missing componentId', async () => {
      await expect(handlers.update_component(client, {})).rejects.toThrow()
    })
  })

  describe('delete_component', () => {
    it('deletes component', async () => {
      const comp = { _id: 'comp1', label: 'Frontend', space: 'p1' }
      client.findOne.mockResolvedValue(comp)

      const result: any = await handlers.delete_component(client, { componentId: 'comp1' })
      expect(result.success).toBe(true)
      expect(client.removeDoc).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing component', async () => {
      await expect(handlers.delete_component(client, { componentId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })
})
