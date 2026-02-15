import { z } from 'zod'
import { Ref, Class, Doc } from '@hcengineering/core'
import { NotFoundError } from '../errors'
import type { ToolDefinition, ToolHandler } from '../types'

const COMMENT_CLASS = 'chunter:class:ChatMessage' as Ref<Class<Doc>>

export const definitions: ToolDefinition[] = [
  {
    name: 'list_comments',
    description: 'List all comments on an object (issue, card, etc.)',
    inputSchema: {
      type: 'object',
      properties: {
        objectId: { type: 'string', description: 'The ID of the object to list comments for' },
        objectClass: { type: 'string', description: 'The class of the object (e.g. tracker:class:Issue)' },
      },
      required: ['objectId', 'objectClass'],
    },
  },
  {
    name: 'update_comment',
    description: 'Update an existing comment message',
    inputSchema: {
      type: 'object',
      properties: {
        commentId: { type: 'string', description: 'Comment ID to update' },
        message: { type: 'string', description: 'New message content (markdown supported)' },
      },
      required: ['commentId', 'message'],
    },
  },
  {
    name: 'delete_comment',
    description: 'Delete a comment',
    inputSchema: {
      type: 'object',
      properties: {
        commentId: { type: 'string', description: 'Comment ID to delete' },
      },
      required: ['commentId'],
    },
  },
]

const listComments: ToolHandler = async (client, args) => {
  const { objectId, objectClass } = z.object({
    objectId: z.string(),
    objectClass: z.string(),
  }).parse(args)

  const comments = await client.findAll(COMMENT_CLASS, {
    attachedTo: objectId,
    attachedToClass: objectClass,
  })

  const sorted = comments.sort((a: any, b: any) => a.modifiedOn - b.modifiedOn)
  return sorted.map((c: any) => ({
    id: c._id,
    message: c.message,
    createdBy: c.createdBy,
    modifiedOn: c.modifiedOn,
  }))
}

const updateComment: ToolHandler = async (client, args) => {
  const input = z.object({
    commentId: z.string(),
    message: z.string().min(1),
  }).parse(args)

  const comment = await client.findOne(COMMENT_CLASS, { _id: input.commentId })
  if (!comment) throw new NotFoundError('Comment', input.commentId)

  const messageRef = await client.uploadMarkup(
    COMMENT_CLASS, input.commentId, 'message', input.message, 'markdown'
  )

  await client.updateDoc(COMMENT_CLASS, comment.space, input.commentId, { message: messageRef })
  return { success: true, commentId: input.commentId, message: 'Updated comment' }
}

const deleteComment: ToolHandler = async (client, args) => {
  const { commentId } = z.object({ commentId: z.string() }).parse(args)
  const comment = await client.findOne(COMMENT_CLASS, { _id: commentId })
  if (!comment) throw new NotFoundError('Comment', commentId)

  await client.removeDoc(COMMENT_CLASS, comment.space, commentId)
  return { success: true, commentId, message: 'Deleted comment' }
}

export const handlers: Record<string, ToolHandler> = {
  list_comments: listComments,
  update_comment: updateComment,
  delete_comment: deleteComment,
}
