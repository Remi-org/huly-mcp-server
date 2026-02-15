import { z } from 'zod'
import { Ref, Class, Doc, generateId } from '@hcengineering/core'
import { makeRank } from '@hcengineering/rank'
import { CARD_CLASS, CARD_SPACE_CLASS } from '../constants'
import { NotFoundError } from '../errors'
import type { ToolDefinition, ToolHandler } from '../types'

export const definitions: ToolDefinition[] = [
  {
    name: 'list_card_spaces',
    description: 'List all card spaces in the workspace',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'list_cards',
    description: 'List all cards in workspace or card space',
    inputSchema: {
      type: 'object',
      properties: {
        cardSpaceId: { type: 'string', description: 'Filter by card space ID (optional)' },
      },
    },
  },
  {
    name: 'get_card',
    description: 'Get full details of a specific card by ID',
    inputSchema: {
      type: 'object',
      properties: {
        cardId: { type: 'string', description: 'Card ID to retrieve' },
      },
      required: ['cardId'],
    },
  },
  {
    name: 'create_card',
    description: 'Create a new card in a card space',
    inputSchema: {
      type: 'object',
      properties: {
        cardSpaceId: { type: 'string', description: 'Card space ID where card will be created' },
        title: { type: 'string', description: 'Card title' },
        content: { type: 'string', description: 'Card content (markdown supported)' },
        type: { type: 'string', description: 'Card type ID (optional)' },
      },
      required: ['cardSpaceId', 'title'],
    },
  },
  {
    name: 'update_card',
    description: 'Update an existing card',
    inputSchema: {
      type: 'object',
      properties: {
        cardId: { type: 'string', description: 'Card ID to update' },
        title: { type: 'string', description: 'New title (optional)' },
        content: { type: 'string', description: 'New content (optional)' },
      },
      required: ['cardId'],
    },
  },
  {
    name: 'delete_card',
    description: 'Delete a card',
    inputSchema: {
      type: 'object',
      properties: {
        cardId: { type: 'string', description: 'Card ID to delete' },
      },
      required: ['cardId'],
    },
  },
]

const listCardSpaces: ToolHandler = async (client) => {
  const spaces = await client.findAll(CARD_SPACE_CLASS, {})
  return spaces.map((cs: any) => ({
    id: cs._id,
    name: cs.name,
    description: cs.description,
    members: cs.members,
    owners: cs.owners,
  }))
}

const listCards: ToolHandler = async (client, args) => {
  const input = z.object({ cardSpaceId: z.string().optional() }).parse(args)
  const query: any = {}
  if (input.cardSpaceId) query.space = input.cardSpaceId

  const cards = await client.findAll(CARD_CLASS, query)
  return cards.map((c: any) => ({
    id: c._id,
    title: c.title,
    space: c.space,
    type: c._class,
    createdOn: c.createdOn,
  }))
}

const getCard: ToolHandler = async (client, args) => {
  const { cardId } = z.object({ cardId: z.string() }).parse(args)
  const card = await client.findOne(CARD_CLASS, { _id: cardId })
  if (!card) throw new NotFoundError('Card', cardId)
  return card
}

const createCard: ToolHandler = async (client, args) => {
  const input = z.object({
    cardSpaceId: z.string(),
    title: z.string().min(1),
    content: z.string().optional(),
    type: z.string().optional(),
  }).parse(args)

  const cardSpace = await client.findOne(CARD_SPACE_CLASS, { _id: input.cardSpaceId })
  if (!cardSpace) throw new NotFoundError('Card space', input.cardSpaceId)

  const cardId = generateId()
  const lastCard = await client.findOne(
    CARD_CLASS, { space: input.cardSpaceId }, { sort: { rank: -1 } }
  )

  const cardClass = (input.type as Ref<Class<Doc>>) || CARD_CLASS

  let contentRef
  if (input.content) {
    contentRef = await client.uploadMarkup(
      cardClass, cardId, 'content', input.content, 'markdown'
    )
  }

  await client.createDoc(cardClass, input.cardSpaceId, {
    title: input.title,
    content: contentRef || '',
    rank: makeRank(lastCard?.rank, undefined),
    parentInfo: [],
    blobs: {},
  }, cardId)

  return { success: true, cardId, message: `Created card ${input.title}` }
}

const updateCard: ToolHandler = async (client, args) => {
  const input = z.object({
    cardId: z.string(),
    title: z.string().optional(),
    content: z.string().optional(),
  }).parse(args)

  const card = await client.findOne(CARD_CLASS, { _id: input.cardId })
  if (!card) throw new NotFoundError('Card', input.cardId)

  const updates: any = {}
  if (input.title) updates.title = input.title

  if (input.content !== undefined) {
    if (card.content) {
      const { parseMessageMarkdown, jsonToMarkup } = await import('@hcengineering/text')
      const parsed = parseMessageMarkdown(input.content, '', '')
      const markup = jsonToMarkup(parsed)
      await client.markup.collaborator.updateMarkup(
        { objectClass: card._class, objectId: input.cardId, objectAttr: 'content' },
        markup
      )
    } else {
      updates.content = await client.uploadMarkup(
        card._class, input.cardId, 'content', input.content, 'markdown'
      )
    }
  }

  if (Object.keys(updates).length > 0) {
    await client.updateDoc(CARD_CLASS, card.space, input.cardId, updates)
  }

  return { success: true, cardId: input.cardId, message: `Updated card ${card.title}` }
}

const deleteCard: ToolHandler = async (client, args) => {
  const { cardId } = z.object({ cardId: z.string() }).parse(args)
  const card = await client.findOne(CARD_CLASS, { _id: cardId })
  if (!card) throw new NotFoundError('Card', cardId)

  await client.removeDoc(CARD_CLASS, card.space, cardId)
  return { success: true, cardId, message: `Deleted card ${card.title}` }
}

export const handlers: Record<string, ToolHandler> = {
  list_card_spaces: listCardSpaces,
  list_cards: listCards,
  get_card: getCard,
  create_card: createCard,
  update_card: updateCard,
  delete_card: deleteCard,
}
