import { describe, it, expect, beforeEach } from 'vitest'
import { handlers, definitions } from '../../tools/calendar'
import { createMockClient } from '../helpers'
import { NotFoundError } from '../../errors'

describe('calendar tool definitions', () => {
  it('exports 8 tool definitions', () => {
    expect(definitions).toHaveLength(8)
  })

  it('has all expected tool names', () => {
    const names = definitions.map((d) => d.name)
    expect(names).toContain('list_events')
    expect(names).toContain('get_event')
    expect(names).toContain('create_event')
    expect(names).toContain('update_event')
    expect(names).toContain('delete_event')
    expect(names).toContain('list_recurring_events')
    expect(names).toContain('create_recurring_event')
    expect(names).toContain('list_event_instances')
  })
})

describe('calendar handlers', () => {
  let client: ReturnType<typeof createMockClient>

  beforeEach(() => {
    client = createMockClient()
  })

  describe('list_events', () => {
    it('returns mapped events', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'e1', title: 'Meeting', date: 1700000000, dueDate: 1700003600, location: 'Room A', participants: ['u1'], allDay: false },
      ])
      const result: any = await handlers.list_events(client, {})
      expect(result).toEqual([{
        id: 'e1', title: 'Meeting', date: 1700000000, dueDate: 1700003600, location: 'Room A', participants: ['u1'], allDay: false,
      }])
    })

    it('applies date range filter', async () => {
      await handlers.list_events(client, { startDate: 100, endDate: 200 })
      expect(client.findAll).toHaveBeenCalledWith(
        expect.anything(), expect.objectContaining({ date: { $gte: 100, $lte: 200 } })
      )
    })
  })

  describe('get_event', () => {
    it('returns event when found', async () => {
      const event = { _id: 'e1', title: 'Meeting' }
      client.findOne.mockResolvedValue(event)
      const result = await handlers.get_event(client, { eventId: 'e1' })
      expect(result).toEqual(event)
    })

    it('throws NotFoundError when event missing', async () => {
      await expect(handlers.get_event(client, { eventId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('create_event', () => {
    it('creates event with required fields', async () => {
      const result: any = await handlers.create_event(client, {
        title: 'Standup', date: 1700000000, dueDate: 1700001800,
      })
      expect(result.success).toBe(true)
      expect(client.createDoc).toHaveBeenCalled()
    })

    it('uploads description when provided', async () => {
      await handlers.create_event(client, {
        title: 'Standup', date: 1700000000, dueDate: 1700001800, description: 'Daily sync',
      })
      expect(client.uploadMarkup).toHaveBeenCalled()
    })

    it('throws on missing required params', async () => {
      await expect(handlers.create_event(client, {})).rejects.toThrow()
    })
  })

  describe('update_event', () => {
    it('updates event fields', async () => {
      const event = { _id: 'e1', title: 'Old', space: 'cal1', description: null }
      client.findOne.mockResolvedValue(event)

      const result: any = await handlers.update_event(client, { eventId: 'e1', title: 'New' })
      expect(result.success).toBe(true)
      expect(client.updateDoc).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing event', async () => {
      await expect(handlers.update_event(client, { eventId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('delete_event', () => {
    it('deletes event', async () => {
      const event = { _id: 'e1', title: 'Meeting', space: 'cal1' }
      client.findOne.mockResolvedValue(event)

      const result: any = await handlers.delete_event(client, { eventId: 'e1' })
      expect(result.success).toBe(true)
      expect(client.removeDoc).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing event', async () => {
      await expect(handlers.delete_event(client, { eventId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('list_recurring_events', () => {
    it('returns mapped recurring events', async () => {
      client.findAll.mockResolvedValue([
        { _id: 're1', title: 'Weekly', date: 1700000000, rules: [{ freq: 'weekly' }], exdate: [] },
      ])
      const result: any = await handlers.list_recurring_events(client, {})
      expect(result).toEqual([{
        id: 're1', title: 'Weekly', date: 1700000000, rules: [{ freq: 'weekly' }], exdate: [],
      }])
    })
  })

  describe('create_recurring_event', () => {
    it('creates recurring event', async () => {
      const result: any = await handlers.create_recurring_event(client, {
        title: 'Weekly Sync', date: 1700000000, rules: [{ freq: 'weekly', interval: 1 }],
      })
      expect(result.success).toBe(true)
      expect(client.createDoc).toHaveBeenCalled()
    })

    it('throws on missing required params', async () => {
      await expect(handlers.create_recurring_event(client, {})).rejects.toThrow()
    })
  })

  describe('list_event_instances', () => {
    it('returns mapped instances', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'ri1', title: 'Weekly', date: 1700000000, dueDate: 1700003600, originalStartTime: 1699900000 },
      ])
      const result: any = await handlers.list_event_instances(client, { recurringEventId: 're1' })
      expect(result).toEqual([{
        id: 'ri1', title: 'Weekly', date: 1700000000, dueDate: 1700003600, originalStartTime: 1699900000,
      }])
    })
  })
})
