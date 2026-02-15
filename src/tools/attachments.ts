import { z } from 'zod'
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

export const handlers: Record<string, ToolHandler> = {
  list_attachments: listAttachments,
  delete_attachment: deleteAttachment,
}
