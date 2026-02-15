import { describe, it, expect, beforeEach } from 'vitest'
import { handlers, definitions } from '../../tools/documents'
import { createMockClient } from '../helpers'
import { NotFoundError } from '../../errors'

describe('documents tool definitions', () => {
  it('exports 6 tool definitions', () => {
    expect(definitions).toHaveLength(6)
  })

  it('has all expected tool names', () => {
    const names = definitions.map((d) => d.name)
    expect(names).toContain('list_teamspaces')
    expect(names).toContain('list_documents')
    expect(names).toContain('get_document')
    expect(names).toContain('create_document')
    expect(names).toContain('update_document')
    expect(names).toContain('delete_document')
  })
})

describe('documents handlers', () => {
  let client: ReturnType<typeof createMockClient>

  beforeEach(() => {
    client = createMockClient()
  })

  describe('list_teamspaces', () => {
    it('returns mapped teamspace data', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'ts1', name: 'Docs', description: 'docs', private: false, members: ['u1'], archived: false },
      ])
      const result: any = await handlers.list_teamspaces(client, {})
      expect(result).toEqual([{
        id: 'ts1', name: 'Docs', description: 'docs', private: false, members: ['u1'], archived: false,
      }])
    })
  })

  describe('list_documents', () => {
    it('returns mapped document data', async () => {
      client.findAll.mockResolvedValue([{
        _id: 'd1', title: 'Doc 1', space: 'ts1', createdOn: 1, modifiedOn: 2, createdBy: 'u1', modifiedBy: 'u2',
      }])
      const result: any = await handlers.list_documents(client, {})
      expect(result).toEqual([{
        id: 'd1', title: 'Doc 1', teamspace: 'ts1', createdOn: 1, modifiedOn: 2, createdBy: 'u1', modifiedBy: 'u2',
      }])
    })

    it('filters by teamspace when provided', async () => {
      await handlers.list_documents(client, { teamspaceId: 'ts1' })
      expect(client.findAll).toHaveBeenCalledWith(
        expect.anything(), expect.objectContaining({ space: 'ts1' })
      )
    })
  })

  describe('get_document', () => {
    it('returns document when found', async () => {
      const doc = { _id: 'd1', title: 'Doc', content: null }
      client.findOne.mockResolvedValue(doc)
      const result = await handlers.get_document(client, { documentId: 'd1' })
      expect(result).toEqual(doc)
    })

    it('fetches content markup when available', async () => {
      const doc = { _id: 'd1', title: 'Doc', content: 'blob:ref' }
      client.findOne.mockResolvedValue(doc)
      await handlers.get_document(client, { documentId: 'd1' })
      expect(client.markup.fetchMarkup).toHaveBeenCalled()
    })

    it('throws NotFoundError when document missing', async () => {
      await expect(handlers.get_document(client, { documentId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('create_document', () => {
    it('creates document with required fields', async () => {
      const teamspace = { _id: 'ts1', name: 'Docs' }
      client.findOne.mockResolvedValueOnce(teamspace).mockResolvedValueOnce(null)

      const result: any = await handlers.create_document(client, { teamspaceId: 'ts1', title: 'New doc' })
      expect(result.success).toBe(true)
      expect(client.createDoc).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing teamspace', async () => {
      await expect(handlers.create_document(client, { teamspaceId: 'missing', title: 'Doc' }))
        .rejects.toThrow(NotFoundError)
    })

    it('uploads content when provided', async () => {
      const teamspace = { _id: 'ts1', name: 'Docs' }
      client.findOne.mockResolvedValueOnce(teamspace).mockResolvedValueOnce(null)

      await handlers.create_document(client, { teamspaceId: 'ts1', title: 'Doc', content: '# Hello' })
      expect(client.uploadMarkup).toHaveBeenCalled()
    })
  })

  describe('update_document', () => {
    it('updates document title', async () => {
      const doc = { _id: 'd1', title: 'Old', space: 'ts1', content: null }
      client.findOne.mockResolvedValue(doc)

      const result: any = await handlers.update_document(client, { documentId: 'd1', title: 'New' })
      expect(result.success).toBe(true)
      expect(client.updateDoc).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing document', async () => {
      await expect(handlers.update_document(client, { documentId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('delete_document', () => {
    it('deletes document', async () => {
      const doc = { _id: 'd1', title: 'Doc', space: 'ts1' }
      client.findOne.mockResolvedValue(doc)

      const result: any = await handlers.delete_document(client, { documentId: 'd1' })
      expect(result.success).toBe(true)
      expect(client.removeDoc).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing document', async () => {
      await expect(handlers.delete_document(client, { documentId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })
})
