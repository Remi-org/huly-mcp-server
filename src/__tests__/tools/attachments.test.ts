import { describe, it, expect, beforeEach } from 'vitest'
import { handlers, definitions } from '../../tools/attachments'
import { createMockClient } from '../helpers'
import { NotFoundError } from '../../errors'

describe('attachments tool definitions', () => {
  it('exports 7 tool definitions', () => {
    expect(definitions).toHaveLength(7)
  })

  it('has all expected tool names', () => {
    const names = definitions.map((d) => d.name)
    expect(names).toContain('list_attachments')
    expect(names).toContain('delete_attachment')
    expect(names).toContain('get_attachment')
    expect(names).toContain('add_attachment')
    expect(names).toContain('update_attachment')
    expect(names).toContain('pin_attachment')
    expect(names).toContain('download_attachment')
  })
})

describe('attachments handlers', () => {
  let client: ReturnType<typeof createMockClient>

  beforeEach(() => {
    client = createMockClient()
  })

  describe('list_attachments', () => {
    it('returns mapped attachment data', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'a1', name: 'file.pdf', file: 'f1', size: 1024, type: 'application/pdf', lastModified: 1700000000, metadata: {} },
      ])
      const result: any = await handlers.list_attachments(client, {
        attachedTo: 'i1', attachedToClass: 'tracker:class:Issue',
      })
      expect(result).toEqual([{
        id: 'a1', name: 'file.pdf', file: 'f1', size: 1024, type: 'application/pdf', lastModified: 1700000000, metadata: {},
      }])
    })

    it('passes filter to query', async () => {
      await handlers.list_attachments(client, { attachedTo: 'i1', attachedToClass: 'tracker:class:Issue' })
      expect(client.findAll).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ attachedTo: 'i1', attachedToClass: 'tracker:class:Issue' })
      )
    })

    it('throws on missing required fields', async () => {
      await expect(handlers.list_attachments(client, {})).rejects.toThrow()
    })
  })

  describe('delete_attachment', () => {
    it('deletes attachment', async () => {
      const attachment = { _id: 'a1', name: 'file.pdf', space: 'p1' }
      client.findOne.mockResolvedValue(attachment)

      const result: any = await handlers.delete_attachment(client, { attachmentId: 'a1' })
      expect(result.success).toBe(true)
      expect(client.removeDoc).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing attachment', async () => {
      await expect(handlers.delete_attachment(client, { attachmentId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('get_attachment', () => {
    it('returns attachment when found', async () => {
      const attachment = { _id: 'a1', name: 'file.pdf' }
      client.findOne.mockResolvedValue(attachment)

      const result = await handlers.get_attachment(client, { attachmentId: 'a1' })
      expect(result).toEqual(attachment)
    })

    it('throws NotFoundError for missing attachment', async () => {
      await expect(handlers.get_attachment(client, { attachmentId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('add_attachment', () => {
    it('adds attachment to object', async () => {
      const result: any = await handlers.add_attachment(client, {
        attachedTo: 'i1', attachedToClass: 'tracker:class:Issue',
        name: 'file.pdf', file: 'blob:ref', type: 'application/pdf', size: 1024,
      })
      expect(result.success).toBe(true)
      expect(client.addCollection).toHaveBeenCalled()
    })

    it('throws on missing required fields', async () => {
      await expect(handlers.add_attachment(client, { attachedTo: 'i1' })).rejects.toThrow()
    })
  })

  describe('update_attachment', () => {
    it('updates attachment metadata', async () => {
      client.findOne.mockResolvedValue({ _id: 'a1', space: 'p1' })

      const result: any = await handlers.update_attachment(client, { attachmentId: 'a1', name: 'renamed.pdf' })
      expect(result.success).toBe(true)
      expect(client.updateDoc).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing attachment', async () => {
      await expect(handlers.update_attachment(client, { attachmentId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('pin_attachment', () => {
    it('pins attachment', async () => {
      client.findOne.mockResolvedValue({ _id: 'a1', space: 'p1' })

      const result: any = await handlers.pin_attachment(client, { attachmentId: 'a1', pinned: true })
      expect(result.success).toBe(true)
      expect(client.updateDoc).toHaveBeenCalledWith(
        expect.anything(), 'p1', 'a1', { pinned: true }
      )
    })

    it('throws NotFoundError for missing attachment', async () => {
      await expect(handlers.pin_attachment(client, { attachmentId: 'missing', pinned: true }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('download_attachment', () => {
    it('returns attachment download info', async () => {
      client.findOne.mockResolvedValue({ _id: 'a1', name: 'file.pdf', file: 'blob:ref', type: 'application/pdf', size: 1024 })

      const result: any = await handlers.download_attachment(client, { attachmentId: 'a1' })
      expect(result.name).toBe('file.pdf')
      expect(result.file).toBe('blob:ref')
    })

    it('throws NotFoundError for missing attachment', async () => {
      await expect(handlers.download_attachment(client, { attachmentId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })
})
