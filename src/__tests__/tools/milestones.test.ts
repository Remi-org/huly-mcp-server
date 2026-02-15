import { describe, it, expect, beforeEach } from 'vitest'
import { handlers, definitions } from '../../tools/milestones'
import { createMockClient } from '../helpers'
import { NotFoundError } from '../../errors'

describe('milestones tool definitions', () => {
  it('exports 5 tool definitions', () => {
    expect(definitions).toHaveLength(5)
  })

  it('has all expected tool names', () => {
    const names = definitions.map((d) => d.name)
    expect(names).toContain('list_milestones')
    expect(names).toContain('get_milestone')
    expect(names).toContain('create_milestone')
    expect(names).toContain('update_milestone')
    expect(names).toContain('delete_milestone')
  })
})

describe('milestones handlers', () => {
  let client: ReturnType<typeof createMockClient>

  beforeEach(() => {
    client = createMockClient()
  })

  describe('list_milestones', () => {
    it('returns mapped milestone data', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'ms1', label: 'v1.0', description: 'First release', targetDate: '2025-06-01', status: 0 },
      ])
      const result: any = await handlers.list_milestones(client, { projectId: 'p1' })
      expect(result).toEqual([{
        id: 'ms1', label: 'v1.0', description: 'First release', targetDate: '2025-06-01', status: 0,
      }])
    })

    it('filters by project', async () => {
      await handlers.list_milestones(client, { projectId: 'p1' })
      expect(client.findAll).toHaveBeenCalledWith(
        expect.anything(), expect.objectContaining({ space: 'p1' })
      )
    })

    it('throws on missing projectId', async () => {
      await expect(handlers.list_milestones(client, {})).rejects.toThrow()
    })
  })

  describe('get_milestone', () => {
    it('returns milestone when found', async () => {
      const ms = { _id: 'ms1', label: 'v1.0' }
      client.findOne.mockResolvedValue(ms)
      const result = await handlers.get_milestone(client, { milestoneId: 'ms1' })
      expect(result).toEqual(ms)
    })

    it('throws NotFoundError when missing', async () => {
      await expect(handlers.get_milestone(client, { milestoneId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })

    it('throws on missing milestoneId', async () => {
      await expect(handlers.get_milestone(client, {})).rejects.toThrow()
    })
  })

  describe('create_milestone', () => {
    it('creates milestone with required fields', async () => {
      const result: any = await handlers.create_milestone(client, { projectId: 'p1', label: 'v1.0' })
      expect(result.success).toBe(true)
      expect(result.milestoneId).toBeDefined()
      expect(client.createDoc).toHaveBeenCalled()
    })

    it('creates milestone with optional fields', async () => {
      const result: any = await handlers.create_milestone(client, {
        projectId: 'p1', label: 'v2.0', description: 'Major release',
        targetDate: '2025-12-01', status: 'InProgress',
      })
      expect(result.success).toBe(true)
      expect(client.createDoc).toHaveBeenCalledWith(
        expect.anything(), 'p1',
        expect.objectContaining({ label: 'v2.0', description: 'Major release', status: 1 }),
        expect.any(String)
      )
    })

    it('defaults status to Planned', async () => {
      await handlers.create_milestone(client, { projectId: 'p1', label: 'v1.0' })
      expect(client.createDoc).toHaveBeenCalledWith(
        expect.anything(), 'p1',
        expect.objectContaining({ status: 0 }),
        expect.any(String)
      )
    })

    it('throws on missing required fields', async () => {
      await expect(handlers.create_milestone(client, { projectId: 'p1' })).rejects.toThrow()
    })
  })

  describe('update_milestone', () => {
    it('updates milestone label', async () => {
      const ms = { _id: 'ms1', label: 'Old', space: 'p1' }
      client.findOne.mockResolvedValue(ms)

      const result: any = await handlers.update_milestone(client, { milestoneId: 'ms1', label: 'New' })
      expect(result.success).toBe(true)
      expect(client.updateDoc).toHaveBeenCalled()
    })

    it('updates milestone status', async () => {
      const ms = { _id: 'ms1', label: 'v1.0', space: 'p1' }
      client.findOne.mockResolvedValue(ms)

      await handlers.update_milestone(client, { milestoneId: 'ms1', status: 'Completed' })
      expect(client.updateDoc).toHaveBeenCalledWith(
        expect.anything(), 'p1', 'ms1',
        expect.objectContaining({ status: 2 })
      )
    })

    it('throws NotFoundError for missing milestone', async () => {
      await expect(handlers.update_milestone(client, { milestoneId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })

    it('throws on missing milestoneId', async () => {
      await expect(handlers.update_milestone(client, {})).rejects.toThrow()
    })
  })

  describe('delete_milestone', () => {
    it('deletes milestone', async () => {
      const ms = { _id: 'ms1', label: 'v1.0', space: 'p1' }
      client.findOne.mockResolvedValue(ms)

      const result: any = await handlers.delete_milestone(client, { milestoneId: 'ms1' })
      expect(result.success).toBe(true)
      expect(client.removeDoc).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing milestone', async () => {
      await expect(handlers.delete_milestone(client, { milestoneId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })
})
