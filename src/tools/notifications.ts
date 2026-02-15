import { z } from 'zod'
import { Ref, Class, Doc } from '@hcengineering/core'
import { NotFoundError } from '../errors'
import type { ToolDefinition, ToolHandler } from '../types'

const INBOX_NOTIFICATION_CLASS = 'notification:class:InboxNotification' as Ref<Class<Doc>>
const DOC_NOTIFY_CONTEXT_CLASS = 'notification:class:DocNotifyContext' as Ref<Class<Doc>>
const NOTIFICATION_PROVIDER_SETTING_CLASS = 'notification:class:NotificationProviderSetting' as Ref<Class<Doc>>

export const definitions: ToolDefinition[] = [
  {
    name: 'list_notifications',
    description: 'List inbox notifications with optional filters',
    inputSchema: {
      type: 'object',
      properties: {
        isViewed: { type: 'boolean', description: 'Filter by read status (optional)' },
        archived: { type: 'boolean', description: 'Filter by archived status (optional)' },
        limit: { type: 'number', description: 'Max results (default 50)' },
      },
    },
  },
  {
    name: 'get_notification',
    description: 'Get a specific notification by ID',
    inputSchema: {
      type: 'object',
      properties: {
        notificationId: { type: 'string', description: 'Notification ID' },
      },
      required: ['notificationId'],
    },
  },
  {
    name: 'mark_notification_read',
    description: 'Mark a notification as read',
    inputSchema: {
      type: 'object',
      properties: {
        notificationId: { type: 'string', description: 'Notification ID' },
      },
      required: ['notificationId'],
    },
  },
  {
    name: 'mark_all_notifications_read',
    description: 'Mark all unread notifications as read',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'archive_notification',
    description: 'Archive a notification',
    inputSchema: {
      type: 'object',
      properties: {
        notificationId: { type: 'string', description: 'Notification ID' },
      },
      required: ['notificationId'],
    },
  },
  {
    name: 'archive_all_notifications',
    description: 'Archive all non-archived notifications',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'delete_notification',
    description: 'Delete a notification',
    inputSchema: {
      type: 'object',
      properties: {
        notificationId: { type: 'string', description: 'Notification ID' },
      },
      required: ['notificationId'],
    },
  },
  {
    name: 'get_notification_context',
    description: 'Get a notification context by ID',
    inputSchema: {
      type: 'object',
      properties: {
        contextId: { type: 'string', description: 'Context ID' },
      },
      required: ['contextId'],
    },
  },
  {
    name: 'list_notification_contexts',
    description: 'List notification contexts',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Max results (default 50)' },
      },
    },
  },
  {
    name: 'pin_notification_context',
    description: 'Pin or unpin a notification context',
    inputSchema: {
      type: 'object',
      properties: {
        contextId: { type: 'string', description: 'Context ID' },
        pinned: { type: 'boolean', description: 'Whether to pin or unpin' },
      },
      required: ['contextId', 'pinned'],
    },
  },
  {
    name: 'list_notification_settings',
    description: 'List notification provider settings',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'update_notification_provider_setting',
    description: 'Update a notification provider setting',
    inputSchema: {
      type: 'object',
      properties: {
        settingId: { type: 'string', description: 'Setting ID' },
        enabled: { type: 'boolean', description: 'Enable or disable' },
      },
      required: ['settingId', 'enabled'],
    },
  },
  {
    name: 'get_unread_notification_count',
    description: 'Get count of unread notifications',
    inputSchema: { type: 'object', properties: {} },
  },
]

const listNotifications: ToolHandler = async (client, args) => {
  const input = z.object({
    isViewed: z.boolean().optional(),
    archived: z.boolean().optional(),
    limit: z.number().optional().default(50),
  }).parse(args)

  const query: any = {}
  if (input.isViewed !== undefined) query.isViewed = input.isViewed
  if (input.archived !== undefined) query.archived = input.archived

  const notifications = await client.findAll(INBOX_NOTIFICATION_CLASS, query, { limit: input.limit })
  return notifications.map((n: any) => ({
    id: n._id,
    title: n.title,
    body: n.body,
    isViewed: n.isViewed,
    archived: n.archived,
    createdOn: n.createdOn,
  }))
}

const getNotification: ToolHandler = async (client, args) => {
  const { notificationId } = z.object({ notificationId: z.string() }).parse(args)
  const notification = await client.findOne(INBOX_NOTIFICATION_CLASS, { _id: notificationId })
  if (!notification) throw new NotFoundError('Notification', notificationId)
  return notification
}

const markNotificationRead: ToolHandler = async (client, args) => {
  const { notificationId } = z.object({ notificationId: z.string() }).parse(args)
  const notification = await client.findOne(INBOX_NOTIFICATION_CLASS, { _id: notificationId })
  if (!notification) throw new NotFoundError('Notification', notificationId)

  await client.updateDoc(INBOX_NOTIFICATION_CLASS, notification.space, notificationId, { isViewed: true })
  return { success: true, message: 'Notification marked as read' }
}

const markAllNotificationsRead: ToolHandler = async (client) => {
  const unread = await client.findAll(INBOX_NOTIFICATION_CLASS, { isViewed: false })
  for (const n of unread as any[]) {
    await client.updateDoc(INBOX_NOTIFICATION_CLASS, n.space, n._id, { isViewed: true })
  }
  return { success: true, count: unread.length }
}

const archiveNotification: ToolHandler = async (client, args) => {
  const { notificationId } = z.object({ notificationId: z.string() }).parse(args)
  const notification = await client.findOne(INBOX_NOTIFICATION_CLASS, { _id: notificationId })
  if (!notification) throw new NotFoundError('Notification', notificationId)

  await client.updateDoc(INBOX_NOTIFICATION_CLASS, notification.space, notificationId, { archived: true })
  return { success: true, message: 'Notification archived' }
}

const archiveAllNotifications: ToolHandler = async (client) => {
  const notifications = await client.findAll(INBOX_NOTIFICATION_CLASS, { archived: false })
  for (const n of notifications as any[]) {
    await client.updateDoc(INBOX_NOTIFICATION_CLASS, n.space, n._id, { archived: true })
  }
  return { success: true, count: notifications.length }
}

const deleteNotification: ToolHandler = async (client, args) => {
  const { notificationId } = z.object({ notificationId: z.string() }).parse(args)
  const notification = await client.findOne(INBOX_NOTIFICATION_CLASS, { _id: notificationId })
  if (!notification) throw new NotFoundError('Notification', notificationId)

  await client.removeDoc(INBOX_NOTIFICATION_CLASS, notification.space, notificationId)
  return { success: true, message: 'Notification deleted' }
}

const getNotificationContext: ToolHandler = async (client, args) => {
  const { contextId } = z.object({ contextId: z.string() }).parse(args)
  const context = await client.findOne(DOC_NOTIFY_CONTEXT_CLASS, { _id: contextId })
  if (!context) throw new NotFoundError('Notification context', contextId)
  return context
}

const listNotificationContexts: ToolHandler = async (client, args) => {
  const { limit } = z.object({ limit: z.number().optional().default(50) }).parse(args)

  const contexts = await client.findAll(DOC_NOTIFY_CONTEXT_CLASS, {}, { sort: { lastUpdateTimestamp: -1 }, limit })
  return contexts.map((c: any) => ({
    id: c._id,
    objectId: c.objectId,
    objectClass: c.objectClass,
    lastUpdateTimestamp: c.lastUpdateTimestamp,
    isPinned: c.isPinned,
  }))
}

const pinNotificationContext: ToolHandler = async (client, args) => {
  const input = z.object({
    contextId: z.string(),
    pinned: z.boolean(),
  }).parse(args)

  const context = await client.findOne(DOC_NOTIFY_CONTEXT_CLASS, { _id: input.contextId })
  if (!context) throw new NotFoundError('Notification context', input.contextId)

  await client.updateDoc(DOC_NOTIFY_CONTEXT_CLASS, context.space, input.contextId, { isPinned: input.pinned })
  return { success: true, message: `Notification context ${input.pinned ? 'pinned' : 'unpinned'}` }
}

const listNotificationSettings: ToolHandler = async (client) => {
  const settings = await client.findAll(NOTIFICATION_PROVIDER_SETTING_CLASS, {})
  return settings.map((s: any) => ({
    id: s._id,
    provider: s.provider,
    enabled: s.enabled,
  }))
}

const updateNotificationProviderSetting: ToolHandler = async (client, args) => {
  const input = z.object({
    settingId: z.string(),
    enabled: z.boolean(),
  }).parse(args)

  const setting = await client.findOne(NOTIFICATION_PROVIDER_SETTING_CLASS, { _id: input.settingId })
  if (!setting) throw new NotFoundError('Notification setting', input.settingId)

  await client.updateDoc(NOTIFICATION_PROVIDER_SETTING_CLASS, setting.space, input.settingId, { enabled: input.enabled })
  return { success: true, message: `Setting ${input.enabled ? 'enabled' : 'disabled'}` }
}

const getUnreadNotificationCount: ToolHandler = async (client) => {
  const results = await client.findAll(INBOX_NOTIFICATION_CLASS, { isViewed: false, archived: false })
  return { count: results.length }
}

export const handlers: Record<string, ToolHandler> = {
  list_notifications: listNotifications,
  get_notification: getNotification,
  mark_notification_read: markNotificationRead,
  mark_all_notifications_read: markAllNotificationsRead,
  archive_notification: archiveNotification,
  archive_all_notifications: archiveAllNotifications,
  delete_notification: deleteNotification,
  get_notification_context: getNotificationContext,
  list_notification_contexts: listNotificationContexts,
  pin_notification_context: pinNotificationContext,
  list_notification_settings: listNotificationSettings,
  update_notification_provider_setting: updateNotificationProviderSetting,
  get_unread_notification_count: getUnreadNotificationCount,
}
