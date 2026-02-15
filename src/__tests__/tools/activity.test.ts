import { describe, it, expect, beforeEach } from 'vitest'
import { handlers, definitions } from '../../tools/activity'
import { createMockClient } from '../helpers'
import { NotFoundError } from '../../errors'

describe('activity tool definitions', () => {
  it('exports 8 tool definitions', () => {
    expect(definitions).toHaveLength(8)
  })

  it('has all expected tool names', () => {
    const names = definitions.map((d) => d.name)
    expect(names).toContain('list_activity')
    expect(names).toContain('add_reaction')
    expect(names).toContain('remove_reaction')
    expect(names).toContain('list_reactions')
    expect(names).toContain('save_message')
    expect(names).toContain('unsave_message')
    expect(names).toContain('list_saved_messages')
    expect(names).toContain('list_mentions')
  })
})

describe('activity handlers', () => {
  let client: ReturnType<typeof createMockClient>

  beforeEach(() => {
    client = createMockClient()
  })

  describe('list_activity', () => {
    it('returns mapped activity messages', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'm1', message: 'Hello', createdBy: 'u1', createdOn: 1700000000, _class: 'activity:class:ActivityMessage' },
      ])
      const result: any = await handlers.list_activity(client, { objectId: 'obj1' })
      expect(result).toEqual([{
        id: 'm1', message: 'Hello', createdBy: 'u1', createdOn: 1700000000, _class: 'activity:class:ActivityMessage',
      }])
    })

    it('throws on missing required objectId', async () => {
      await expect(handlers.list_activity(client, {})).rejects.toThrow()
    })
  })

  describe('add_reaction', () => {
    it('adds reaction to message', async () => {
      const result: any = await handlers.add_reaction(client, { messageId: 'm1', emoji: '👍' })
      expect(result.success).toBe(true)
      expect(client.addCollection).toHaveBeenCalled()
    })

    it('throws on missing required params', async () => {
      await expect(handlers.add_reaction(client, {})).rejects.toThrow()
    })
  })

  describe('remove_reaction', () => {
    it('removes matching reaction', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'r1', emoji: '👍', space: 'sp1' },
      ])
      const result: any = await handlers.remove_reaction(client, { messageId: 'm1', emoji: '👍' })
      expect(result.success).toBe(true)
      expect(client.removeDoc).toHaveBeenCalled()
    })

    it('throws NotFoundError when reaction not found', async () => {
      client.findAll.mockResolvedValue([])
      await expect(handlers.remove_reaction(client, { messageId: 'm1', emoji: '👎' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('list_reactions', () => {
    it('returns mapped reactions', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'r1', emoji: '👍', createdBy: 'u1' },
      ])
      const result: any = await handlers.list_reactions(client, { messageId: 'm1' })
      expect(result).toEqual([{ id: 'r1', emoji: '👍', createdBy: 'u1' }])
    })
  })

  describe('save_message', () => {
    it('saves a message', async () => {
      const result: any = await handlers.save_message(client, { messageId: 'm1' })
      expect(result.success).toBe(true)
      expect(client.createDoc).toHaveBeenCalled()
    })
  })

  describe('unsave_message', () => {
    it('unsaves a message', async () => {
      client.findOne.mockResolvedValue({ _id: 's1', space: 'sp1' })
      const result: any = await handlers.unsave_message(client, { messageId: 'm1' })
      expect(result.success).toBe(true)
      expect(client.removeDoc).toHaveBeenCalled()
    })

    it('throws NotFoundError when message not saved', async () => {
      await expect(handlers.unsave_message(client, { messageId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('list_saved_messages', () => {
    it('returns mapped saved messages', async () => {
      client.findAll.mockResolvedValue([
        { _id: 's1', attachedTo: 'm1', createdOn: 1700000000 },
      ])
      const result: any = await handlers.list_saved_messages(client, {})
      expect(result).toEqual([{ id: 's1', attachedTo: 'm1', createdOn: 1700000000 }])
    })
  })

  describe('list_mentions', () => {
    it('returns mapped mentions', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'mn1', user: 'u1', attachedTo: 'obj1', createdOn: 1700000000 },
      ])
      const result: any = await handlers.list_mentions(client, {})
      expect(result).toEqual([{ id: 'mn1', user: 'u1', attachedTo: 'obj1', createdOn: 1700000000 }])
    })
  })
})
