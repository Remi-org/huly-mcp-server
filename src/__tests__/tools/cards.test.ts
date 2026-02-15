import { describe, it, expect, beforeEach } from 'vitest'
import { handlers, definitions } from '../../tools/cards'
import { createMockClient } from '../helpers'
import { NotFoundError } from '../../errors'

describe('cards tool definitions', () => {
  it('exports 6 tool definitions', () => {
    expect(definitions).toHaveLength(6)
  })

  it('has all expected tool names', () => {
    const names = definitions.map((d) => d.name)
    expect(names).toContain('list_card_spaces')
    expect(names).toContain('list_cards')
    expect(names).toContain('get_card')
    expect(names).toContain('create_card')
    expect(names).toContain('update_card')
    expect(names).toContain('delete_card')
  })
})

describe('cards handlers', () => {
  let client: ReturnType<typeof createMockClient>

  beforeEach(() => {
    client = createMockClient()
  })

  describe('list_card_spaces', () => {
    it('returns mapped card space data', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'cs1', name: 'Space 1', description: 'desc', members: ['u1'], owners: ['u2'] },
      ])
      const result: any = await handlers.list_card_spaces(client, {})
      expect(result).toEqual([{
        id: 'cs1', name: 'Space 1', description: 'desc', members: ['u1'], owners: ['u2'],
      }])
    })
  })

  describe('list_cards', () => {
    it('returns mapped card data', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'c1', title: 'Card 1', space: 'cs1', _class: 'card:class:Card', createdOn: 1700000000 },
      ])
      const result: any = await handlers.list_cards(client, {})
      expect(result).toEqual([{
        id: 'c1', title: 'Card 1', space: 'cs1', type: 'card:class:Card', createdOn: 1700000000,
      }])
    })

    it('filters by card space when provided', async () => {
      await handlers.list_cards(client, { cardSpaceId: 'cs1' })
      expect(client.findAll).toHaveBeenCalledWith(
        expect.anything(), expect.objectContaining({ space: 'cs1' })
      )
    })
  })

  describe('get_card', () => {
    it('returns card when found', async () => {
      const card = { _id: 'c1', title: 'Card 1' }
      client.findOne.mockResolvedValue(card)
      const result = await handlers.get_card(client, { cardId: 'c1' })
      expect(result).toEqual(card)
    })

    it('throws NotFoundError when card missing', async () => {
      await expect(handlers.get_card(client, { cardId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('create_card', () => {
    it('creates card with required fields', async () => {
      const space = { _id: 'cs1', name: 'Space' }
      client.findOne.mockResolvedValueOnce(space).mockResolvedValueOnce(null)

      const result: any = await handlers.create_card(client, { cardSpaceId: 'cs1', title: 'New card' })
      expect(result.success).toBe(true)
      expect(client.createDoc).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing card space', async () => {
      await expect(handlers.create_card(client, { cardSpaceId: 'missing', title: 'Card' }))
        .rejects.toThrow(NotFoundError)
    })

    it('uploads content when provided', async () => {
      const space = { _id: 'cs1', name: 'Space' }
      client.findOne.mockResolvedValueOnce(space).mockResolvedValueOnce(null)

      await handlers.create_card(client, { cardSpaceId: 'cs1', title: 'Card', content: '# Hello' })
      expect(client.uploadMarkup).toHaveBeenCalled()
    })
  })

  describe('update_card', () => {
    it('updates card title', async () => {
      const card = { _id: 'c1', title: 'Old', space: 'cs1', content: null, _class: 'card:class:Card' }
      client.findOne.mockResolvedValue(card)

      const result: any = await handlers.update_card(client, { cardId: 'c1', title: 'New' })
      expect(result.success).toBe(true)
      expect(client.updateDoc).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing card', async () => {
      await expect(handlers.update_card(client, { cardId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('delete_card', () => {
    it('deletes card', async () => {
      const card = { _id: 'c1', title: 'Card', space: 'cs1' }
      client.findOne.mockResolvedValue(card)

      const result: any = await handlers.delete_card(client, { cardId: 'c1' })
      expect(result.success).toBe(true)
      expect(client.removeDoc).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing card', async () => {
      await expect(handlers.delete_card(client, { cardId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })
})
