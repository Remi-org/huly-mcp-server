import { describe, it, expect, beforeEach } from 'vitest'
import { handlers, definitions } from '../../tools/channels'
import { createMockClient } from '../helpers'
import { NotFoundError } from '../../errors'

describe('channels tool definitions', () => {
  it('exports 11 tool definitions', () => {
    expect(definitions).toHaveLength(11)
  })

  it('has all expected tool names', () => {
    const names = definitions.map((d) => d.name)
    expect(names).toContain('list_channels')
    expect(names).toContain('get_channel')
    expect(names).toContain('create_channel')
    expect(names).toContain('update_channel')
    expect(names).toContain('delete_channel')
    expect(names).toContain('list_channel_messages')
    expect(names).toContain('send_channel_message')
    expect(names).toContain('list_direct_messages')
    expect(names).toContain('list_thread_replies')
    expect(names).toContain('add_thread_reply')
    expect(names).toContain('delete_thread_reply')
  })
})

describe('channels handlers', () => {
  let client: ReturnType<typeof createMockClient>

  beforeEach(() => {
    client = createMockClient()
  })

  describe('list_channels', () => {
    it('returns mapped channel data', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'ch1', name: 'general', topic: 'General chat', members: ['u1'], private: false },
      ])
      const result: any = await handlers.list_channels(client, {})
      expect(result).toEqual([{
        id: 'ch1', name: 'general', topic: 'General chat', members: ['u1'], private: false,
      }])
    })

    it('returns empty array when no channels', async () => {
      const result = await handlers.list_channels(client, {})
      expect(result).toEqual([])
    })
  })

  describe('get_channel', () => {
    it('returns channel when found', async () => {
      const channel = { _id: 'ch1', name: 'general' }
      client.findOne.mockResolvedValue(channel)
      const result = await handlers.get_channel(client, { channelId: 'ch1' })
      expect(result).toEqual(channel)
    })

    it('throws NotFoundError when channel missing', async () => {
      await expect(handlers.get_channel(client, { channelId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })

    it('throws on missing channelId', async () => {
      await expect(handlers.get_channel(client, {})).rejects.toThrow()
    })
  })

  describe('create_channel', () => {
    it('creates channel with required fields', async () => {
      const result: any = await handlers.create_channel(client, { name: 'general' })
      expect(result.success).toBe(true)
      expect(result.channelId).toBeDefined()
      expect(client.createDoc).toHaveBeenCalled()
    })

    it('creates channel with all options', async () => {
      const result: any = await handlers.create_channel(client, {
        name: 'private-chat', topic: 'Secret', private: true, members: ['u1', 'u2'],
      })
      expect(result.success).toBe(true)
      expect(client.createDoc).toHaveBeenCalledWith(
        expect.anything(), expect.anything(),
        expect.objectContaining({ name: 'private-chat', topic: 'Secret', private: true, members: ['u1', 'u2'] }),
        expect.anything()
      )
    })

    it('throws on missing name', async () => {
      await expect(handlers.create_channel(client, {})).rejects.toThrow()
    })
  })

  describe('update_channel', () => {
    it('updates channel name', async () => {
      const channel = { _id: 'ch1', name: 'old', space: 's1' }
      client.findOne.mockResolvedValue(channel)

      const result: any = await handlers.update_channel(client, { channelId: 'ch1', name: 'new' })
      expect(result.success).toBe(true)
      expect(client.updateDoc).toHaveBeenCalledWith(
        expect.anything(), 's1', 'ch1', expect.objectContaining({ name: 'new' })
      )
    })

    it('throws NotFoundError for missing channel', async () => {
      await expect(handlers.update_channel(client, { channelId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('delete_channel', () => {
    it('deletes channel', async () => {
      const channel = { _id: 'ch1', name: 'general', space: 's1' }
      client.findOne.mockResolvedValue(channel)

      const result: any = await handlers.delete_channel(client, { channelId: 'ch1' })
      expect(result.success).toBe(true)
      expect(client.removeDoc).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing channel', async () => {
      await expect(handlers.delete_channel(client, { channelId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('list_channel_messages', () => {
    it('returns mapped message data', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'm1', message: 'Hello', createdBy: 'u1', createdOn: 1700000000 },
      ])
      const result: any = await handlers.list_channel_messages(client, { channelId: 'ch1' })
      expect(result).toEqual([{
        id: 'm1', message: 'Hello', createdBy: 'u1', createdOn: 1700000000,
      }])
    })

    it('passes channelId as space filter', async () => {
      await handlers.list_channel_messages(client, { channelId: 'ch1' })
      expect(client.findAll).toHaveBeenCalledWith(
        expect.anything(), expect.objectContaining({ space: 'ch1' }), expect.anything()
      )
    })

    it('throws on missing channelId', async () => {
      await expect(handlers.list_channel_messages(client, {})).rejects.toThrow()
    })
  })

  describe('send_channel_message', () => {
    it('sends message to channel', async () => {
      const channel = { _id: 'ch1', name: 'general' }
      client.findOne.mockResolvedValue(channel)

      const result: any = await handlers.send_channel_message(client, {
        channelId: 'ch1', message: 'Hello world',
      })
      expect(result.success).toBe(true)
      expect(client.uploadMarkup).toHaveBeenCalled()
      expect(client.addCollection).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing channel', async () => {
      await expect(handlers.send_channel_message(client, {
        channelId: 'missing', message: 'Hi',
      })).rejects.toThrow(NotFoundError)
    })

    it('throws on empty message', async () => {
      await expect(handlers.send_channel_message(client, {
        channelId: 'ch1', message: '',
      })).rejects.toThrow()
    })
  })

  describe('list_direct_messages', () => {
    it('returns mapped DM data', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'dm1', members: ['u1', 'u2'], createdOn: 1700000000 },
      ])
      const result: any = await handlers.list_direct_messages(client, {})
      expect(result).toEqual([{
        id: 'dm1', members: ['u1', 'u2'], createdOn: 1700000000,
      }])
    })
  })

  describe('list_thread_replies', () => {
    it('returns mapped reply data', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'r1', message: 'Reply', createdBy: 'u1', createdOn: 1700000000 },
      ])
      const result: any = await handlers.list_thread_replies(client, { messageId: 'm1' })
      expect(result).toEqual([{
        id: 'r1', message: 'Reply', createdBy: 'u1', createdOn: 1700000000,
      }])
    })

    it('filters by attachedTo', async () => {
      await handlers.list_thread_replies(client, { messageId: 'm1' })
      expect(client.findAll).toHaveBeenCalledWith(
        expect.anything(), expect.objectContaining({ attachedTo: 'm1' }), expect.anything()
      )
    })

    it('throws on missing messageId', async () => {
      await expect(handlers.list_thread_replies(client, {})).rejects.toThrow()
    })
  })

  describe('add_thread_reply', () => {
    it('adds reply to thread', async () => {
      const parentMsg = { _id: 'm1', space: 'ch1' }
      client.findOne.mockResolvedValue(parentMsg)

      const result: any = await handlers.add_thread_reply(client, {
        messageId: 'm1', message: 'My reply',
      })
      expect(result.success).toBe(true)
      expect(client.uploadMarkup).toHaveBeenCalled()
      expect(client.addCollection).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing parent message', async () => {
      await expect(handlers.add_thread_reply(client, {
        messageId: 'missing', message: 'Reply',
      })).rejects.toThrow(NotFoundError)
    })

    it('throws on empty message', async () => {
      await expect(handlers.add_thread_reply(client, {
        messageId: 'm1', message: '',
      })).rejects.toThrow()
    })
  })

  describe('delete_thread_reply', () => {
    it('deletes reply', async () => {
      const reply = { _id: 'r1', space: 'ch1' }
      client.findOne.mockResolvedValue(reply)

      const result: any = await handlers.delete_thread_reply(client, { replyId: 'r1' })
      expect(result.success).toBe(true)
      expect(client.removeDoc).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing reply', async () => {
      await expect(handlers.delete_thread_reply(client, { replyId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })

    it('throws on missing replyId', async () => {
      await expect(handlers.delete_thread_reply(client, {})).rejects.toThrow()
    })
  })
})
