import { describe, it, expect, beforeEach } from 'vitest'
import { handlers, definitions } from '../../tools/time-tracking'
import { createMockClient } from '../helpers'
import { NotFoundError } from '../../errors'

describe('time-tracking tool definitions', () => {
  it('exports 8 tool definitions', () => {
    expect(definitions).toHaveLength(8)
  })

  it('has all expected tool names', () => {
    const names = definitions.map((d) => d.name)
    expect(names).toContain('log_time')
    expect(names).toContain('get_time_report')
    expect(names).toContain('list_time_spend_reports')
    expect(names).toContain('get_detailed_time_report')
    expect(names).toContain('list_work_slots')
    expect(names).toContain('create_work_slot')
    expect(names).toContain('start_timer')
    expect(names).toContain('stop_timer')
  })
})

describe('time-tracking handlers', () => {
  let client: ReturnType<typeof createMockClient>

  beforeEach(() => {
    client = createMockClient()
  })

  describe('log_time', () => {
    it('logs time against an issue', async () => {
      client.findOne.mockResolvedValue({ _id: 'issue1', space: 'proj1' })

      const result: any = await handlers.log_time(client, { issueId: 'issue1', value: 30 })
      expect(result.success).toBe(true)
      expect(client.addCollection).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing issue', async () => {
      await expect(handlers.log_time(client, { issueId: 'missing', value: 30 }))
        .rejects.toThrow(NotFoundError)
    })

    it('throws on missing required params', async () => {
      await expect(handlers.log_time(client, {})).rejects.toThrow()
    })
  })

  describe('get_time_report', () => {
    it('returns report when found', async () => {
      const report = { _id: 'r1', value: 60, employee: 'emp1' }
      client.findOne.mockResolvedValue(report)
      const result = await handlers.get_time_report(client, { reportId: 'r1' })
      expect(result).toEqual(report)
    })

    it('throws NotFoundError when report missing', async () => {
      await expect(handlers.get_time_report(client, { reportId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('list_time_spend_reports', () => {
    it('returns mapped reports', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'r1', employee: 'emp1', date: 1700000000, value: 60, description: 'work' },
      ])
      const result: any = await handlers.list_time_spend_reports(client, {})
      expect(result).toEqual([{
        id: 'r1', employee: 'emp1', date: 1700000000, value: 60, description: 'work',
      }])
    })

    it('filters by issueId', async () => {
      await handlers.list_time_spend_reports(client, { issueId: 'issue1' })
      expect(client.findAll).toHaveBeenCalledWith(
        expect.anything(), expect.objectContaining({ attachedTo: 'issue1' })
      )
    })
  })

  describe('get_detailed_time_report', () => {
    it('returns aggregated data', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'r1', attachedTo: 'issue1', employee: 'emp1', value: 30 },
        { _id: 'r2', attachedTo: 'issue1', employee: 'emp1', value: 20 },
        { _id: 'r3', attachedTo: 'issue2', employee: 'emp2', value: 45 },
      ])

      const result: any = await handlers.get_detailed_time_report(client, { projectId: 'proj1' })
      expect(result.projectId).toBe('proj1')
      expect(result.totalReports).toBe(3)
      expect(result.byIssue.issue1.emp1).toBe(50)
      expect(result.byIssue.issue2.emp2).toBe(45)
    })
  })

  describe('list_work_slots', () => {
    it('returns mapped work slots', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'ws1', title: 'Slot 1', date: 1700000000, dueDate: 1700003600, employee: 'emp1' },
      ])
      const result: any = await handlers.list_work_slots(client, {})
      expect(result).toEqual([{
        id: 'ws1', title: 'Slot 1', date: 1700000000, dueDate: 1700003600, employee: 'emp1',
      }])
    })
  })

  describe('create_work_slot', () => {
    it('creates a work slot', async () => {
      const result: any = await handlers.create_work_slot(client, {
        title: 'Morning', date: 1700000000, dueDate: 1700003600,
      })
      expect(result.success).toBe(true)
      expect(client.createDoc).toHaveBeenCalled()
    })

    it('throws on missing required params', async () => {
      await expect(handlers.create_work_slot(client, {})).rejects.toThrow()
    })
  })

  describe('start_timer', () => {
    it('returns timer start info', async () => {
      client.findOne.mockResolvedValue({ _id: 'issue1' })
      const result: any = await handlers.start_timer(client, { issueId: 'issue1' })
      expect(result.success).toBe(true)
      expect(result.issueId).toBe('issue1')
      expect(result.startedAt).toBeTypeOf('number')
    })

    it('throws NotFoundError for missing issue', async () => {
      await expect(handlers.start_timer(client, { issueId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('stop_timer', () => {
    it('returns elapsed time', async () => {
      const startedAt = Date.now() - 60000 * 5
      const result: any = await handlers.stop_timer(client, { issueId: 'issue1', startedAt })
      expect(result.success).toBe(true)
      expect(result.elapsed).toBeTypeOf('number')
      expect(result.message).toContain('log_time')
    })
  })
})
