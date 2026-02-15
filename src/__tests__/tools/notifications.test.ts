import { describe, it, expect, beforeEach } from 'vitest'
import { handlers, definitions } from '../../tools/notifications'
import { createMockClient } from '../helpers'
import { NotFoundError } from '../../errors'

describe('notifications tool definitions', () => {
  it('exports 13 tool definitions', () => {
    expect(definitions).toHaveLength(13)
  })

  it('has all expected tool names', () => {
    const names = definitions.map((d) => d.name)
    expect(names).toContain('list_notifications')
    expect(names).toContain('get_notification')
    expect(names).toContain('mark_notification_read')
    expect(names).toContain('mark_all_notifications_read')
    expect(names).toContain('archive_notification')
    expect(names).toContain('archive_all_notifications')
    expect(names).toContain('delete_notification')
    expect(names).toContain('get_notification_context')
    expect(names).toContain('list_notification_contexts')
    expect(names).toContain('pin_notification_context')
    expect(names).toContain('list_notification_settings')
    expect(names).toContain('update_notification_provider_setting')
    expect(names).toContain('get_unread_notification_count')
  })
})

describe('notifications handlers', () => {
  let client: ReturnType<typeof createMockClient>

  beforeEach(() => {
    client = createMockClient()
  })

  describe('list_notifications', () => {
    it('returns mapped notifications', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'n1', title: 'New comment', body: 'text', isViewed: false, archived: false, createdOn: 1700000000 },
      ])
      const result: any = await handlers.list_notifications(client, {})
      expect(result).toEqual([{
        id: 'n1', title: 'New comment', body: 'text', isViewed: false, archived: false, createdOn: 1700000000,
      }])
    })

    it('applies isViewed filter', async () => {
      await handlers.list_notifications(client, { isViewed: false })
      expect(client.findAll).toHaveBeenCalledWith(
        expect.anything(), expect.objectContaining({ isViewed: false }), expect.anything()
      )
    })
  })

  describe('get_notification', () => {
    it('returns notification when found', async () => {
      const notification = { _id: 'n1', title: 'Alert' }
      client.findOne.mockResolvedValue(notification)
      const result = await handlers.get_notification(client, { notificationId: 'n1' })
      expect(result).toEqual(notification)
    })

    it('throws NotFoundError when missing', async () => {
      await expect(handlers.get_notification(client, { notificationId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('mark_notification_read', () => {
    it('marks notification as read', async () => {
      client.findOne.mockResolvedValue({ _id: 'n1', space: 'sp1' })
      const result: any = await handlers.mark_notification_read(client, { notificationId: 'n1' })
      expect(result.success).toBe(true)
      expect(client.updateDoc).toHaveBeenCalledWith(
        expect.anything(), 'sp1', 'n1', { isViewed: true }
      )
    })

    it('throws NotFoundError when missing', async () => {
      await expect(handlers.mark_notification_read(client, { notificationId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('mark_all_notifications_read', () => {
    it('marks all unread as read', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'n1', space: 'sp1' },
        { _id: 'n2', space: 'sp1' },
      ])
      const result: any = await handlers.mark_all_notifications_read(client, {})
      expect(result.success).toBe(true)
      expect(result.count).toBe(2)
      expect(client.updateDoc).toHaveBeenCalledTimes(2)
    })
  })

  describe('archive_notification', () => {
    it('archives notification', async () => {
      client.findOne.mockResolvedValue({ _id: 'n1', space: 'sp1' })
      const result: any = await handlers.archive_notification(client, { notificationId: 'n1' })
      expect(result.success).toBe(true)
      expect(client.updateDoc).toHaveBeenCalledWith(
        expect.anything(), 'sp1', 'n1', { archived: true }
      )
    })

    it('throws NotFoundError when missing', async () => {
      await expect(handlers.archive_notification(client, { notificationId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('archive_all_notifications', () => {
    it('archives all non-archived', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'n1', space: 'sp1' },
      ])
      const result: any = await handlers.archive_all_notifications(client, {})
      expect(result.success).toBe(true)
      expect(result.count).toBe(1)
    })
  })

  describe('delete_notification', () => {
    it('deletes notification', async () => {
      client.findOne.mockResolvedValue({ _id: 'n1', space: 'sp1' })
      const result: any = await handlers.delete_notification(client, { notificationId: 'n1' })
      expect(result.success).toBe(true)
      expect(client.removeDoc).toHaveBeenCalled()
    })

    it('throws NotFoundError when missing', async () => {
      await expect(handlers.delete_notification(client, { notificationId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('get_notification_context', () => {
    it('returns context when found', async () => {
      const context = { _id: 'ctx1', objectId: 'obj1' }
      client.findOne.mockResolvedValue(context)
      const result = await handlers.get_notification_context(client, { contextId: 'ctx1' })
      expect(result).toEqual(context)
    })

    it('throws NotFoundError when missing', async () => {
      await expect(handlers.get_notification_context(client, { contextId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('list_notification_contexts', () => {
    it('returns mapped contexts', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'ctx1', objectId: 'obj1', objectClass: 'cls1', lastUpdateTimestamp: 1700000000, isPinned: false },
      ])
      const result: any = await handlers.list_notification_contexts(client, {})
      expect(result).toEqual([{
        id: 'ctx1', objectId: 'obj1', objectClass: 'cls1', lastUpdateTimestamp: 1700000000, isPinned: false,
      }])
    })
  })

  describe('pin_notification_context', () => {
    it('pins a context', async () => {
      client.findOne.mockResolvedValue({ _id: 'ctx1', space: 'sp1' })
      const result: any = await handlers.pin_notification_context(client, { contextId: 'ctx1', pinned: true })
      expect(result.success).toBe(true)
      expect(client.updateDoc).toHaveBeenCalledWith(
        expect.anything(), 'sp1', 'ctx1', { isPinned: true }
      )
    })

    it('throws NotFoundError when missing', async () => {
      await expect(handlers.pin_notification_context(client, { contextId: 'missing', pinned: true }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('list_notification_settings', () => {
    it('returns mapped settings', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'set1', provider: 'email', enabled: true },
      ])
      const result: any = await handlers.list_notification_settings(client, {})
      expect(result).toEqual([{ id: 'set1', provider: 'email', enabled: true }])
    })
  })

  describe('update_notification_provider_setting', () => {
    it('updates setting', async () => {
      client.findOne.mockResolvedValue({ _id: 'set1', space: 'sp1' })
      const result: any = await handlers.update_notification_provider_setting(client, { settingId: 'set1', enabled: false })
      expect(result.success).toBe(true)
      expect(client.updateDoc).toHaveBeenCalledWith(
        expect.anything(), 'sp1', 'set1', { enabled: false }
      )
    })

    it('throws NotFoundError when missing', async () => {
      await expect(handlers.update_notification_provider_setting(client, { settingId: 'missing', enabled: true }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('get_unread_notification_count', () => {
    it('returns count of unread notifications', async () => {
      client.findAll.mockResolvedValue([{ _id: 'n1' }, { _id: 'n2' }, { _id: 'n3' }])
      const result: any = await handlers.get_unread_notification_count(client, {})
      expect(result.count).toBe(3)
    })
  })
})
