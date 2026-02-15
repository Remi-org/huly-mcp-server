import { z } from 'zod'
import { Ref, Class, Doc, generateId } from '@hcengineering/core'
import { NotFoundError } from '../errors'
import type { ToolDefinition, ToolHandler } from '../types'

const ACTIVITY_MESSAGE_CLASS = 'activity:class:ActivityMessage' as Ref<Class<Doc>>
const REACTION_CLASS = 'activity:class:Reaction' as Ref<Class<Doc>>
const SAVED_MESSAGE_CLASS = 'activity:class:SavedMessage' as Ref<Class<Doc>>
const USER_MENTION_CLASS = 'activity:class:UserMentionInfo' as Ref<Class<Doc>>

export const definitions: ToolDefinition[] = [
  {
    name: 'list_activity',
    description: 'List activity messages for an object',
    inputSchema: {
      type: 'object',
      properties: {
        objectId: { type: 'string', description: 'Object ID to get activity for' },
        objectClass: { type: 'string', description: 'Object class (optional)' },
        limit: { type: 'number', description: 'Max results (default 50)' },
      },
      required: ['objectId'],
    },
  },
  {
    name: 'add_reaction',
    description: 'Add an emoji reaction to a message',
    inputSchema: {
      type: 'object',
      properties: {
        messageId: { type: 'string', description: 'Message ID to react to' },
        emoji: { type: 'string', description: 'Emoji to add' },
      },
      required: ['messageId', 'emoji'],
    },
  },
  {
    name: 'remove_reaction',
    description: 'Remove an emoji reaction from a message',
    inputSchema: {
      type: 'object',
      properties: {
        messageId: { type: 'string', description: 'Message ID' },
        emoji: { type: 'string', description: 'Emoji to remove' },
      },
      required: ['messageId', 'emoji'],
    },
  },
  {
    name: 'list_reactions',
    description: 'List all reactions on a message',
    inputSchema: {
      type: 'object',
      properties: {
        messageId: { type: 'string', description: 'Message ID' },
      },
      required: ['messageId'],
    },
  },
  {
    name: 'save_message',
    description: 'Save a message for later',
    inputSchema: {
      type: 'object',
      properties: {
        messageId: { type: 'string', description: 'Message ID to save' },
      },
      required: ['messageId'],
    },
  },
  {
    name: 'unsave_message',
    description: 'Remove a saved message',
    inputSchema: {
      type: 'object',
      properties: {
        messageId: { type: 'string', description: 'Message ID to unsave' },
      },
      required: ['messageId'],
    },
  },
  {
    name: 'list_saved_messages',
    description: 'List all saved messages',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Max results (default 50)' },
      },
    },
  },
  {
    name: 'list_mentions',
    description: 'List user mentions',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Max results (default 50)' },
      },
    },
  },
]

const listActivity: ToolHandler = async (client, args) => {
  const input = z.object({
    objectId: z.string(),
    objectClass: z.string().optional(),
    limit: z.number().optional().default(50),
  }).parse(args)

  const query: any = { attachedTo: input.objectId }
  if (input.objectClass) query.attachedToClass = input.objectClass

  const messages = await client.findAll(ACTIVITY_MESSAGE_CLASS, query, { sort: { createdOn: -1 }, limit: input.limit })
  return messages.map((m: any) => ({
    id: m._id,
    message: m.message,
    createdBy: m.createdBy,
    createdOn: m.createdOn,
    _class: m._class,
  }))
}

const addReaction: ToolHandler = async (client, args) => {
  const input = z.object({
    messageId: z.string(),
    emoji: z.string().min(1),
  }).parse(args)

  const reactionId = generateId()
  await client.addCollection(REACTION_CLASS, '' as any, input.messageId, ACTIVITY_MESSAGE_CLASS, 'reactions', {
    emoji: input.emoji,
  }, reactionId)

  return { success: true, reactionId, message: `Added reaction ${input.emoji}` }
}

const removeReaction: ToolHandler = async (client, args) => {
  const input = z.object({
    messageId: z.string(),
    emoji: z.string(),
  }).parse(args)

  const reactions = await client.findAll(REACTION_CLASS, { attachedTo: input.messageId })
  const match = (reactions as any[]).find((r: any) => r.emoji === input.emoji)
  if (!match) throw new NotFoundError('Reaction', input.emoji)

  await client.removeDoc(REACTION_CLASS, match.space, match._id)
  return { success: true, message: `Removed reaction ${input.emoji}` }
}

const listReactions: ToolHandler = async (client, args) => {
  const { messageId } = z.object({ messageId: z.string() }).parse(args)

  const reactions = await client.findAll(REACTION_CLASS, { attachedTo: messageId })
  return reactions.map((r: any) => ({
    id: r._id,
    emoji: r.emoji,
    createdBy: r.createdBy,
  }))
}

const saveMessage: ToolHandler = async (client, args) => {
  const { messageId } = z.object({ messageId: z.string() }).parse(args)

  const savedId = generateId()
  await client.createDoc(SAVED_MESSAGE_CLASS, '' as any, {
    attachedTo: messageId,
  }, savedId)

  return { success: true, savedId, message: 'Message saved' }
}

const unsaveMessage: ToolHandler = async (client, args) => {
  const { messageId } = z.object({ messageId: z.string() }).parse(args)

  const saved = await client.findOne(SAVED_MESSAGE_CLASS, { attachedTo: messageId })
  if (!saved) throw new NotFoundError('Saved message', messageId)

  await client.removeDoc(SAVED_MESSAGE_CLASS, saved.space, saved._id)
  return { success: true, message: 'Message unsaved' }
}

const listSavedMessages: ToolHandler = async (client, args) => {
  const { limit } = z.object({ limit: z.number().optional().default(50) }).parse(args)

  const saved = await client.findAll(SAVED_MESSAGE_CLASS, {}, { limit })
  return saved.map((s: any) => ({
    id: s._id,
    attachedTo: s.attachedTo,
    createdOn: s.createdOn,
  }))
}

const listMentions: ToolHandler = async (client, args) => {
  const { limit } = z.object({ limit: z.number().optional().default(50) }).parse(args)

  const mentions = await client.findAll(USER_MENTION_CLASS, {}, { limit })
  return mentions.map((m: any) => ({
    id: m._id,
    user: m.user,
    attachedTo: m.attachedTo,
    createdOn: m.createdOn,
  }))
}

export const handlers: Record<string, ToolHandler> = {
  list_activity: listActivity,
  add_reaction: addReaction,
  remove_reaction: removeReaction,
  list_reactions: listReactions,
  save_message: saveMessage,
  unsave_message: unsaveMessage,
  list_saved_messages: listSavedMessages,
  list_mentions: listMentions,
}
