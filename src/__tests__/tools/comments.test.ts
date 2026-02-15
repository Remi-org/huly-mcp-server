import { describe, it, expect, beforeEach } from 'vitest'
import { handlers, definitions } from '../../tools/comments'
import { createMockClient } from '../helpers'
import { NotFoundError } from '../../errors'

describe('comments tool definitions', () => {
  it('exports 3 tool definitions', () => {
    expect(definitions).toHaveLength(3)
  })

  it('has all expected tool names', () => {
    const names = definitions.map((d) => d.name)
    expect(names).toContain('list_comments')
    expect(names).toContain('update_comment')
    expect(names).toContain('delete_comment')
  })
})

describe('comments handlers', () => {
  let client: ReturnType<typeof createMockClient>

  beforeEach(() => {
    client = createMockClient()
  })

  describe('list_comments', () => {
    it('returns mapped and sorted comment data', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'c2', message: 'Second', createdBy: 'u1', modifiedOn: 2000 },
        { _id: 'c1', message: 'First', createdBy: 'u1', modifiedOn: 1000 },
      ])
      const result: any = await handlers.list_comments(client, {
        objectId: 'issue1', objectClass: 'tracker:class:Issue',
      })
      expect(result).toEqual([
        { id: 'c1', message: 'First', createdBy: 'u1', modifiedOn: 1000 },
        { id: 'c2', message: 'Second', createdBy: 'u1', modifiedOn: 2000 },
      ])
    })

    it('queries with correct attachedTo filter', async () => {
      await handlers.list_comments(client, {
        objectId: 'issue1', objectClass: 'tracker:class:Issue',
      })
      expect(client.findAll).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ attachedTo: 'issue1', attachedToClass: 'tracker:class:Issue' })
      )
    })

    it('throws on missing required fields', async () => {
      await expect(handlers.list_comments(client, {})).rejects.toThrow()
    })
  })

  describe('update_comment', () => {
    it('updates comment message', async () => {
      const comment = { _id: 'c1', message: 'Old', space: 'p1' }
      client.findOne.mockResolvedValue(comment)

      const result: any = await handlers.update_comment(client, { commentId: 'c1', message: 'New message' })
      expect(result.success).toBe(true)
      expect(client.uploadMarkup).toHaveBeenCalled()
      expect(client.updateDoc).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing comment', async () => {
      await expect(handlers.update_comment(client, { commentId: 'missing', message: 'text' }))
        .rejects.toThrow(NotFoundError)
    })

    it('throws on missing required fields', async () => {
      await expect(handlers.update_comment(client, { commentId: 'c1' })).rejects.toThrow()
    })
  })

  describe('delete_comment', () => {
    it('deletes comment', async () => {
      const comment = { _id: 'c1', message: 'text', space: 'p1' }
      client.findOne.mockResolvedValue(comment)

      const result: any = await handlers.delete_comment(client, { commentId: 'c1' })
      expect(result.success).toBe(true)
      expect(client.removeDoc).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing comment', async () => {
      await expect(handlers.delete_comment(client, { commentId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })

    it('throws on missing commentId', async () => {
      await expect(handlers.delete_comment(client, {})).rejects.toThrow()
    })
  })
})
