import { describe, it, expect, beforeEach } from 'vitest'
import { handlers, definitions } from '../../tools/attachments'
import { createMockClient } from '../helpers'
import { NotFoundError } from '../../errors'

describe('attachments tool definitions', () => {
  it('exports 2 tool definitions', () => {
    expect(definitions).toHaveLength(2)
  })

  it('has all expected tool names', () => {
    const names = definitions.map((d) => d.name)
    expect(names).toContain('list_attachments')
    expect(names).toContain('delete_attachment')
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

    it('throws on missing attachmentId', async () => {
      await expect(handlers.delete_attachment(client, {})).rejects.toThrow()
    })
  })
})
