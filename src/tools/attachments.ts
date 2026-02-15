import { z } from 'zod'
import { generateId } from '@hcengineering/core'
import { ATTACHMENT_CLASS } from '../constants'
import { NotFoundError } from '../errors'
import type { ToolDefinition, ToolHandler } from '../types'

export const definitions: ToolDefinition[] = [
  {
    name: 'list_attachments',
    description: 'List attachments on an issue or card',
    inputSchema: {
      type: 'object',
      properties: {
        attachedTo: { type: 'string', description: 'ID of issue or card' },
        attachedToClass: { type: 'string', description: 'Class (tracker:class:Issue or card:class:Card)' },
      },
      required: ['attachedTo', 'attachedToClass'],
    },
  },
  {
    name: 'delete_attachment',
    description: 'Delete an attachment',
    inputSchema: {
      type: 'object',
      properties: {
        attachmentId: { type: 'string', description: 'Attachment ID to delete' },
      },
      required: ['attachmentId'],
    },
  },
  {
    name: 'get_attachment',
    description: 'Get full details of an attachment by ID',
    inputSchema: {
      type: 'object',
      properties: {
        attachmentId: { type: 'string', description: 'Attachment ID to retrieve' },
      },
      required: ['attachmentId'],
    },
  },
  {
    name: 'add_attachment',
    description: 'Add an attachment to an object',
    inputSchema: {
      type: 'object',
      properties: {
        attachedTo: { type: 'string', description: 'Object ID to attach to' },
        attachedToClass: { type: 'string', description: 'Class of object (e.g. tracker:class:Issue)' },
        name: { type: 'string', description: 'Filename' },
        file: { type: 'string', description: 'File reference or blob ID' },
        type: { type: 'string', description: 'MIME type' },
        size: { type: 'number', description: 'File size in bytes' },
      },
      required: ['attachedTo', 'attachedToClass', 'name', 'file', 'type', 'size'],
    },
  },
  {
    name: 'update_attachment',
    description: 'Update attachment metadata',
    inputSchema: {
      type: 'object',
      properties: {
        attachmentId: { type: 'string', description: 'Attachment ID to update' },
        name: { type: 'string', description: 'New filename (optional)' },
        description: { type: 'string', description: 'New description (optional)' },
      },
      required: ['attachmentId'],
    },
  },
  {
    name: 'pin_attachment',
    description: 'Pin or unpin an attachment',
    inputSchema: {
      type: 'object',
      properties: {
        attachmentId: { type: 'string', description: 'Attachment ID' },
        pinned: { type: 'boolean', description: 'Whether to pin or unpin' },
      },
      required: ['attachmentId', 'pinned'],
    },
  },
  {
    name: 'download_attachment',
    description: 'Get download info for an attachment',
    inputSchema: {
      type: 'object',
      properties: {
        attachmentId: { type: 'string', description: 'Attachment ID' },
      },
      required: ['attachmentId'],
    },
  },
]

const listAttachments: ToolHandler = async (client, args) => {
  const input = z.object({
    attachedTo: z.string(),
    attachedToClass: z.string(),
  }).parse(args)

  const attachments = await client.findAll(ATTACHMENT_CLASS, {
    attachedTo: input.attachedTo,
    attachedToClass: input.attachedToClass,
  })

  return attachments.map((a: any) => ({
    id: a._id,
    name: a.name,
    file: a.file,
    size: a.size,
    type: a.type,
    lastModified: a.lastModified,
    metadata: a.metadata,
  }))
}

const deleteAttachment: ToolHandler = async (client, args) => {
  const { attachmentId } = z.object({ attachmentId: z.string() }).parse(args)
  const attachment = await client.findOne(ATTACHMENT_CLASS, { _id: attachmentId })
  if (!attachment) throw new NotFoundError('Attachment', attachmentId)

  await client.removeDoc(ATTACHMENT_CLASS, attachment.space, attachmentId)
  return { success: true, attachmentId, message: `Deleted attachment ${attachment.name}` }
}

const getAttachment: ToolHandler = async (client, args) => {
  const { attachmentId } = z.object({ attachmentId: z.string() }).parse(args)
  const attachment = await client.findOne(ATTACHMENT_CLASS, { _id: attachmentId })
  if (!attachment) throw new NotFoundError('Attachment', attachmentId)
  return attachment
}

const addAttachment: ToolHandler = async (client, args) => {
  const input = z.object({
    attachedTo: z.string(),
    attachedToClass: z.string(),
    name: z.string().min(1),
    file: z.string(),
    type: z.string(),
    size: z.number(),
  }).parse(args)

  const attachmentId = generateId()
  await client.addCollection(
    ATTACHMENT_CLASS, '' as any, input.attachedTo, input.attachedToClass as any, 'attachments',
    {
      name: input.name,
      file: input.file,
      type: input.type,
      size: input.size,
      lastModified: Date.now(),
    },
    attachmentId
  )

  return { success: true, attachmentId, message: `Added attachment ${input.name}` }
}

const updateAttachment: ToolHandler = async (client, args) => {
  const input = z.object({
    attachmentId: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),
  }).parse(args)

  const attachment = await client.findOne(ATTACHMENT_CLASS, { _id: input.attachmentId })
  if (!attachment) throw new NotFoundError('Attachment', input.attachmentId)

  const updates: any = {}
  if (input.name) updates.name = input.name
  if (input.description !== undefined) updates.description = input.description

  if (Object.keys(updates).length > 0) {
    await client.updateDoc(ATTACHMENT_CLASS, attachment.space, input.attachmentId, updates)
  }

  return { success: true, attachmentId: input.attachmentId, message: `Updated attachment` }
}

const pinAttachment: ToolHandler = async (client, args) => {
  const input = z.object({
    attachmentId: z.string(),
    pinned: z.boolean(),
  }).parse(args)

  const attachment = await client.findOne(ATTACHMENT_CLASS, { _id: input.attachmentId })
  if (!attachment) throw new NotFoundError('Attachment', input.attachmentId)

  await client.updateDoc(ATTACHMENT_CLASS, attachment.space, input.attachmentId, { pinned: input.pinned })
  return { success: true, attachmentId: input.attachmentId, message: `Attachment ${input.pinned ? 'pinned' : 'unpinned'}` }
}

const downloadAttachment: ToolHandler = async (client, args) => {
  const { attachmentId } = z.object({ attachmentId: z.string() }).parse(args)
  const attachment = await client.findOne(ATTACHMENT_CLASS, { _id: attachmentId })
  if (!attachment) throw new NotFoundError('Attachment', attachmentId)

  return {
    id: attachment._id,
    name: attachment.name,
    file: attachment.file,
    type: attachment.type,
    size: attachment.size,
  }
}

export const handlers: Record<string, ToolHandler> = {
  list_attachments: listAttachments,
  delete_attachment: deleteAttachment,
  get_attachment: getAttachment,
  add_attachment: addAttachment,
  update_attachment: updateAttachment,
  pin_attachment: pinAttachment,
  download_attachment: downloadAttachment,
}
