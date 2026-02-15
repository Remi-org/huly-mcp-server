import { z } from 'zod'
import { Ref, Class, Doc, generateId } from '@hcengineering/core'
import { NotFoundError } from '../errors'
import type { ToolDefinition, ToolHandler } from '../types'

const CHANNEL_CLASS = 'chunter:class:Channel' as Ref<Class<Doc>>
const DIRECT_MESSAGE_CLASS = 'chunter:class:DirectMessage' as Ref<Class<Doc>>
const CHAT_MESSAGE_CLASS = 'chunter:class:ChatMessage' as Ref<Class<Doc>>
const THREAD_MESSAGE_CLASS = 'chunter:class:ThreadMessage' as Ref<Class<Doc>>

export const definitions: ToolDefinition[] = [
  {
    name: 'list_channels',
    description: 'List all channels in the workspace',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'get_channel',
    description: 'Get full details of a specific channel by ID',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID to retrieve' },
      },
      required: ['channelId'],
    },
  },
  {
    name: 'create_channel',
    description: 'Create a new channel',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Channel name' },
        topic: { type: 'string', description: 'Channel topic (optional)' },
        private: { type: 'boolean', description: 'Whether the channel is private (optional)' },
        members: { type: 'array', items: { type: 'string' }, description: 'Member IDs (optional)' },
      },
      required: ['name'],
    },
  },
  {
    name: 'update_channel',
    description: 'Update an existing channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID to update' },
        name: { type: 'string', description: 'New name (optional)' },
        topic: { type: 'string', description: 'New topic (optional)' },
      },
      required: ['channelId'],
    },
  },
  {
    name: 'delete_channel',
    description: 'Delete a channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID to delete' },
      },
      required: ['channelId'],
    },
  },
  {
    name: 'list_channel_messages',
    description: 'List messages in a channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID to list messages from' },
      },
      required: ['channelId'],
    },
  },
  {
    name: 'send_channel_message',
    description: 'Send a message to a channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID to send message to' },
        message: { type: 'string', description: 'Message text (markdown supported)' },
      },
      required: ['channelId', 'message'],
    },
  },
  {
    name: 'list_direct_messages',
    description: 'List all direct message conversations',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'list_thread_replies',
    description: 'List replies in a message thread',
    inputSchema: {
      type: 'object',
      properties: {
        messageId: { type: 'string', description: 'Parent message ID' },
      },
      required: ['messageId'],
    },
  },
  {
    name: 'add_thread_reply',
    description: 'Add a reply to a message thread',
    inputSchema: {
      type: 'object',
      properties: {
        messageId: { type: 'string', description: 'Parent message ID to reply to' },
        message: { type: 'string', description: 'Reply text (markdown supported)' },
      },
      required: ['messageId', 'message'],
    },
  },
  {
    name: 'delete_thread_reply',
    description: 'Delete a thread reply',
    inputSchema: {
      type: 'object',
      properties: {
        replyId: { type: 'string', description: 'Reply ID to delete' },
      },
      required: ['replyId'],
    },
  },
]

const listChannels: ToolHandler = async (client) => {
  const channels = await client.findAll(CHANNEL_CLASS, {})
  return channels.map((c: any) => ({
    id: c._id,
    name: c.name,
    topic: c.topic,
    members: c.members,
    private: c.private,
  }))
}

const getChannel: ToolHandler = async (client, args) => {
  const { channelId } = z.object({ channelId: z.string() }).parse(args)
  const channel = await client.findOne(CHANNEL_CLASS, { _id: channelId })
  if (!channel) throw new NotFoundError('Channel', channelId)
  return channel
}

const createChannel: ToolHandler = async (client, args) => {
  const input = z.object({
    name: z.string().min(1),
    topic: z.string().optional(),
    private: z.boolean().optional(),
    members: z.array(z.string()).optional(),
  }).parse(args)

  const channelId = generateId()
  await client.createDoc(CHANNEL_CLASS, channelId, {
    name: input.name,
    topic: input.topic || '',
    private: input.private || false,
    members: input.members || [],
  }, channelId)

  return { success: true, channelId, message: `Created channel ${input.name}` }
}

const updateChannel: ToolHandler = async (client, args) => {
  const input = z.object({
    channelId: z.string(),
    name: z.string().optional(),
    topic: z.string().optional(),
  }).parse(args)

  const channel = await client.findOne(CHANNEL_CLASS, { _id: input.channelId })
  if (!channel) throw new NotFoundError('Channel', input.channelId)

  const updates: any = {}
  if (input.name) updates.name = input.name
  if (input.topic !== undefined) updates.topic = input.topic

  if (Object.keys(updates).length > 0) {
    await client.updateDoc(CHANNEL_CLASS, channel.space, input.channelId, updates)
  }

  return { success: true, channelId: input.channelId, message: `Updated channel ${channel.name}` }
}

const deleteChannel: ToolHandler = async (client, args) => {
  const { channelId } = z.object({ channelId: z.string() }).parse(args)
  const channel = await client.findOne(CHANNEL_CLASS, { _id: channelId })
  if (!channel) throw new NotFoundError('Channel', channelId)

  await client.removeDoc(CHANNEL_CLASS, channel.space, channelId)
  return { success: true, channelId, message: `Deleted channel ${channel.name}` }
}

const listChannelMessages: ToolHandler = async (client, args) => {
  const { channelId } = z.object({ channelId: z.string() }).parse(args)
  const messages = await client.findAll(CHAT_MESSAGE_CLASS, { space: channelId }, { sort: { createdOn: -1 } })
  return messages.map((m: any) => ({
    id: m._id,
    message: m.message,
    createdBy: m.createdBy,
    createdOn: m.createdOn,
  }))
}

const sendChannelMessage: ToolHandler = async (client, args) => {
  const input = z.object({
    channelId: z.string(),
    message: z.string().min(1),
  }).parse(args)

  const channel = await client.findOne(CHANNEL_CLASS, { _id: input.channelId })
  if (!channel) throw new NotFoundError('Channel', input.channelId)

  const messageId = generateId()
  const markup = await client.uploadMarkup(
    CHAT_MESSAGE_CLASS, messageId, 'message', input.message, 'markdown'
  )

  await client.addCollection(
    CHAT_MESSAGE_CLASS, input.channelId, input.channelId, CHANNEL_CLASS, 'messages',
    { message: markup },
    messageId
  )

  return { success: true, messageId, message: `Sent message to channel ${channel.name}` }
}

const listDirectMessages: ToolHandler = async (client) => {
  const dms = await client.findAll(DIRECT_MESSAGE_CLASS, {})
  return dms.map((d: any) => ({
    id: d._id,
    members: d.members,
    createdOn: d.createdOn,
  }))
}

const listThreadReplies: ToolHandler = async (client, args) => {
  const { messageId } = z.object({ messageId: z.string() }).parse(args)
  const replies = await client.findAll(
    THREAD_MESSAGE_CLASS, { attachedTo: messageId }, { sort: { createdOn: 1 } }
  )
  return replies.map((r: any) => ({
    id: r._id,
    message: r.message,
    createdBy: r.createdBy,
    createdOn: r.createdOn,
  }))
}

const addThreadReply: ToolHandler = async (client, args) => {
  const input = z.object({
    messageId: z.string(),
    message: z.string().min(1),
  }).parse(args)

  const parentMessage = await client.findOne(CHAT_MESSAGE_CLASS, { _id: input.messageId })
  if (!parentMessage) throw new NotFoundError('Message', input.messageId)

  const replyId = generateId()
  const markup = await client.uploadMarkup(
    THREAD_MESSAGE_CLASS, replyId, 'message', input.message, 'markdown'
  )

  await client.addCollection(
    THREAD_MESSAGE_CLASS, parentMessage.space, input.messageId, CHAT_MESSAGE_CLASS, 'replies',
    { message: markup },
    replyId
  )

  return { success: true, replyId, message: 'Added thread reply' }
}

const deleteThreadReply: ToolHandler = async (client, args) => {
  const { replyId } = z.object({ replyId: z.string() }).parse(args)
  const reply = await client.findOne(THREAD_MESSAGE_CLASS, { _id: replyId })
  if (!reply) throw new NotFoundError('Thread reply', replyId)

  await client.removeDoc(THREAD_MESSAGE_CLASS, reply.space, replyId)
  return { success: true, replyId, message: 'Deleted thread reply' }
}

export const handlers: Record<string, ToolHandler> = {
  list_channels: listChannels,
  get_channel: getChannel,
  create_channel: createChannel,
  update_channel: updateChannel,
  delete_channel: deleteChannel,
  list_channel_messages: listChannelMessages,
  send_channel_message: sendChannelMessage,
  list_direct_messages: listDirectMessages,
  list_thread_replies: listThreadReplies,
  add_thread_reply: addThreadReply,
  delete_thread_reply: deleteThreadReply,
}
