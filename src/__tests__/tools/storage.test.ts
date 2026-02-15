import { describe, it, expect, beforeEach, vi } from 'vitest'
import { handlers, definitions } from '../../tools/storage'
import { createMockClient } from '../helpers'

describe('storage tool definitions', () => {
  it('exports 1 tool definition', () => {
    expect(definitions).toHaveLength(1)
  })

  it('has upload_file tool', () => {
    const names = definitions.map((d) => d.name)
    expect(names).toContain('upload_file')
  })
})

describe('storage handlers', () => {
  let client: ReturnType<typeof createMockClient>

  beforeEach(() => {
    client = createMockClient()
  })

  describe('upload_file', () => {
    it('uploads file successfully', async () => {
      client.uploadFile = vi.fn().mockResolvedValue(undefined)
      const content = Buffer.from('hello world').toString('base64')

      const result: any = await handlers.upload_file(client, {
        name: 'test.txt', content, type: 'text/plain',
      })
      expect(result.success).toBe(true)
      expect(result.name).toBe('test.txt')
      expect(result.type).toBe('text/plain')
      expect(result.size).toBe(11)
      expect(client.uploadFile).toHaveBeenCalledWith('test.txt', expect.any(Buffer), 'text/plain')
    })

    it('returns error when uploadFile is not available', async () => {
      const content = Buffer.from('hello').toString('base64')

      const result: any = await handlers.upload_file(client, {
        name: 'test.txt', content, type: 'text/plain',
      })
      expect(result.success).toBe(false)
      expect(result.error).toContain('not available')
    })

    it('returns error when upload fails', async () => {
      client.uploadFile = vi.fn().mockRejectedValue(new Error('network error'))
      const content = Buffer.from('hello').toString('base64')

      const result: any = await handlers.upload_file(client, {
        name: 'test.txt', content, type: 'text/plain',
      })
      expect(result.success).toBe(false)
      expect(result.error).toContain('network error')
    })

    it('throws on missing name', async () => {
      await expect(handlers.upload_file(client, {
        content: 'abc', type: 'text/plain',
      })).rejects.toThrow()
    })

    it('throws on missing content', async () => {
      await expect(handlers.upload_file(client, {
        name: 'test.txt', type: 'text/plain',
      })).rejects.toThrow()
    })

    it('throws on missing type', async () => {
      await expect(handlers.upload_file(client, {
        name: 'test.txt', content: 'abc',
      })).rejects.toThrow()
    })
  })
})
