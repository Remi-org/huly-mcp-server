import { z } from 'zod'
import { generateId, Ref, Class, Doc } from '@hcengineering/core'
import { makeRank } from '@hcengineering/rank'
import { DOCUMENT_CLASS, TEAMSPACE_CLASS } from '../constants'
import { NotFoundError } from '../errors'
import type { ToolDefinition, ToolHandler } from '../types'

const CHAT_MESSAGE_CLASS = 'chunter:class:ChatMessage' as Ref<Class<Doc>>

export const definitions: ToolDefinition[] = [
  {
    name: 'list_teamspaces',
    description: 'List all teamspaces (document containers)',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'list_documents',
    description: 'List documents in a teamspace or all documents',
    inputSchema: {
      type: 'object',
      properties: {
        teamspaceId: { type: 'string', description: 'Filter by teamspace ID (optional)' },
      },
    },
  },
  {
    name: 'get_document',
    description: 'Get full details of a specific document by ID with content',
    inputSchema: {
      type: 'object',
      properties: {
        documentId: { type: 'string', description: 'Document ID to retrieve' },
      },
      required: ['documentId'],
    },
  },
  {
    name: 'list_inline_comments',
    description: 'List inline comments on a document — shows highlighted text and any reply messages',
    inputSchema: {
      type: 'object',
      properties: {
        documentId: { type: 'string', description: 'Document ID to get inline comments for' },
      },
      required: ['documentId'],
    },
  },
  {
    name: 'create_document',
    description: 'Create a new document in a teamspace',
    inputSchema: {
      type: 'object',
      properties: {
        teamspaceId: { type: 'string', description: 'Teamspace ID where document will be created' },
        title: { type: 'string', description: 'Document title' },
        content: { type: 'string', description: 'Document content (markdown supported)' },
      },
      required: ['teamspaceId', 'title'],
    },
  },
  {
    name: 'update_document',
    description: 'Update an existing document',
    inputSchema: {
      type: 'object',
      properties: {
        documentId: { type: 'string', description: 'Document ID to update' },
        title: { type: 'string', description: 'New title (optional)' },
        content: { type: 'string', description: 'New content (optional)' },
      },
      required: ['documentId'],
    },
  },
  {
    name: 'delete_document',
    description: 'Delete a document',
    inputSchema: {
      type: 'object',
      properties: {
        documentId: { type: 'string', description: 'Document ID to delete' },
      },
      required: ['documentId'],
    },
  },
]

const listTeamspaces: ToolHandler = async (client) => {
  const teamspaces = await client.findAll(TEAMSPACE_CLASS, {})
  return teamspaces.map((ts: any) => ({
    id: ts._id,
    name: ts.name,
    description: ts.description,
    private: ts.private,
    members: ts.members,
    archived: ts.archived,
  }))
}

const listDocuments: ToolHandler = async (client, args) => {
  const input = z.object({ teamspaceId: z.string().optional() }).parse(args)
  const query: any = {}
  if (input.teamspaceId) query.space = input.teamspaceId

  const documents = await client.findAll(DOCUMENT_CLASS, query)
  return documents.map((d: any) => ({
    id: d._id,
    title: d.title,
    teamspace: d.space,
    createdOn: d.createdOn,
    modifiedOn: d.modifiedOn,
    createdBy: d.createdBy,
    modifiedBy: d.modifiedBy,
  }))
}

const getDocument: ToolHandler = async (client, args) => {
  const { documentId } = z.object({ documentId: z.string() }).parse(args)
  const document = await client.findOne(DOCUMENT_CLASS, { _id: documentId })
  if (!document) throw new NotFoundError('Document', documentId)

  if (document.content && client.markup?.fetchMarkup) {
    try {
      document.contentMarkdown = await client.markup.fetchMarkup(
        DOCUMENT_CLASS, documentId, 'content', document.content, 'markdown'
      )
    } catch {
      try {
        const raw = await client.markup.collaborator.getMarkup({
          objectClass: DOCUMENT_CLASS, objectId: documentId, objectAttr: 'content'
        })
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
        stripMarks(parsed, ['inline-comment'])
        document.contentMarkdown = prosemirrorToMarkdown(parsed)
        document.hasInlineComments = true
      } catch (e2) {
        document.contentMarkdown = `[Error fetching content: ${e2}]`
      }
    }
  }

  return document
}

const createDocument: ToolHandler = async (client, args) => {
  const input = z.object({
    teamspaceId: z.string(),
    title: z.string().min(1),
    content: z.string().optional(),
  }).parse(args)

  const teamspace = await client.findOne(TEAMSPACE_CLASS, { _id: input.teamspaceId })
  if (!teamspace) throw new NotFoundError('Teamspace', input.teamspaceId)

  const documentId = generateId()
  const lastDoc = await client.findOne(
    DOCUMENT_CLASS, { space: input.teamspaceId }, { sort: { rank: -1 } }
  )

  let contentRef
  if (input.content) {
    contentRef = await client.uploadMarkup(
      DOCUMENT_CLASS, documentId, 'content', input.content, 'markdown'
    )
  }

  await client.createDoc(DOCUMENT_CLASS, input.teamspaceId, {
    title: input.title,
    content: contentRef || '',
    attachments: 0,
    embeddings: 0,
    labels: 0,
    comments: 0,
    references: 0,
    rank: makeRank(lastDoc?.rank, undefined),
    parent: 'document:ids:NoParent',
  }, documentId)

  return {
    success: true,
    documentId,
    teamspaceId: input.teamspaceId,
    message: `Created document ${input.title}`,
  }
}

const updateDocument: ToolHandler = async (client, args) => {
  const input = z.object({
    documentId: z.string(),
    title: z.string().optional(),
    content: z.string().optional(),
  }).parse(args)

  const document = await client.findOne(DOCUMENT_CLASS, { _id: input.documentId })
  if (!document) throw new NotFoundError('Document', input.documentId)

  const updates: any = {}
  if (input.title) updates.title = input.title

  if (input.content !== undefined) {
    if (document.content) {
      const { parseMessageMarkdown, jsonToMarkup } = await import('@hcengineering/text')
      const parsed = parseMessageMarkdown(input.content, '', '')
      const markup = jsonToMarkup(parsed)
      await client.markup.collaborator.updateMarkup(
        { objectClass: DOCUMENT_CLASS, objectId: input.documentId, objectAttr: 'content' },
        markup
      )
    } else {
      updates.content = await client.uploadMarkup(
        DOCUMENT_CLASS, input.documentId, 'content', input.content, 'markdown'
      )
    }
  }

  if (Object.keys(updates).length > 0) {
    await client.updateDoc(DOCUMENT_CLASS, document.space, input.documentId, updates)
  }

  return {
    success: true,
    documentId: input.documentId,
    message: `Updated document ${document.title}`,
  }
}

function stripMarks(node: any, markTypes: string[]): void {
  if (node.marks) {
    node.marks = node.marks.filter((m: any) => !markTypes.includes(m.type))
    if (node.marks.length === 0) delete node.marks
  }
  if (node.content) {
    for (const child of node.content) stripMarks(child, markTypes)
  }
}

function prosemirrorToMarkdown(node: any): string {
  if (!node) return ''
  if (node.type === 'text') return node.text || ''

  let result = ''
  const children = (node.content || []).map((c: any) => prosemirrorToMarkdown(c)).join('')

  switch (node.type) {
    case 'doc': return children
    case 'paragraph': return children + '\n\n'
    case 'heading': {
      const level = node.attrs?.level || 1
      return '#'.repeat(level) + ' ' + children + '\n\n'
    }
    case 'bulletList': return children
    case 'orderedList': return children
    case 'listItem': return '- ' + children + '\n'
    case 'codeBlock': return '```\n' + children + '\n```\n\n'
    case 'blockquote': return children.split('\n').map((l: string) => '> ' + l).join('\n') + '\n\n'
    case 'horizontalRule': return '---\n\n'
    case 'hardBreak': return '\n'
    case 'table': return children + '\n'
    case 'tableRow': return '| ' + children + '\n'
    case 'tableCell': case 'tableHeader': return children + ' | '
    default: return children
  }
}

function extractInlineComments(node: any, results: Map<string, string[]>): void {
  if (node.marks) {
    for (const mark of node.marks) {
      if (mark.type === 'inline-comment' && mark.attrs?.thread) {
        const threadId = mark.attrs.thread
        if (!results.has(threadId)) results.set(threadId, [])
        if (node.text) results.get(threadId)!.push(node.text)
      }
    }
  }
  if (node.content) {
    for (const child of node.content) extractInlineComments(child, results)
  }
}

const listInlineComments: ToolHandler = async (client, args) => {
  const { documentId } = z.object({ documentId: z.string() }).parse(args)
  const document = await client.findOne(DOCUMENT_CLASS, { _id: documentId })
  if (!document) throw new NotFoundError('Document', documentId)

  if (!document.content) return []

  const raw = await client.markup.collaborator.getMarkup({
    objectClass: DOCUMENT_CLASS, objectId: documentId, objectAttr: 'content'
  })
  const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw

  const threads = new Map<string, string[]>()
  extractInlineComments(parsed, threads)

  if (threads.size === 0) return []

  const results = []
  for (const [threadId, textParts] of threads) {
    const highlightedText = textParts.join('')

    const replies = await client.findAll(CHAT_MESSAGE_CLASS, { attachedTo: threadId })
    const sortedReplies = replies.sort((a: any, b: any) => a.modifiedOn - b.modifiedOn)

    const replyData = []
    for (const r of sortedReplies) {
      let msg = (r as any).message
      if (msg && client.markup?.fetchMarkup) {
        try {
          msg = await client.markup.fetchMarkup(
            CHAT_MESSAGE_CLASS, (r as any)._id, 'message', msg, 'markdown'
          )
        } catch {}
      }
      replyData.push({
        id: (r as any)._id,
        author: (r as any).createdBy,
        message: msg,
        createdOn: (r as any).createdOn,
      })
    }

    results.push({
      threadId,
      highlightedText,
      replyCount: replyData.length,
      replies: replyData,
    })
  }

  return results
}

const deleteDocument: ToolHandler = async (client, args) => {
  const { documentId } = z.object({ documentId: z.string() }).parse(args)
  const document = await client.findOne(DOCUMENT_CLASS, { _id: documentId })
  if (!document) throw new NotFoundError('Document', documentId)

  await client.removeDoc(DOCUMENT_CLASS, document.space, documentId)
  return { success: true, documentId, message: `Deleted document ${document.title}` }
}

export const handlers: Record<string, ToolHandler> = {
  list_teamspaces: listTeamspaces,
  list_documents: listDocuments,
  get_document: getDocument,
  list_inline_comments: listInlineComments,
  create_document: createDocument,
  update_document: updateDocument,
  delete_document: deleteDocument,
}
