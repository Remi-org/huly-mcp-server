import { z } from 'zod'
import type { ToolDefinition, ToolHandler } from '../types'

export const definitions: ToolDefinition[] = [
  {
    name: 'upload_file',
    description: 'Upload a file to the workspace',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Filename' },
        content: { type: 'string', description: 'File content as base64 string' },
        type: { type: 'string', description: 'MIME type (e.g. image/png)' },
      },
      required: ['name', 'content', 'type'],
    },
  },
]

const uploadFile: ToolHandler = async (client, args) => {
  const input = z.object({
    name: z.string().min(1),
    content: z.string().min(1),
    type: z.string().min(1),
  }).parse(args)

  const buffer = Buffer.from(input.content, 'base64')

  try {
    if (typeof client.uploadFile !== 'function') {
      return { success: false, error: 'Upload API is not available on this client' }
    }
    await client.uploadFile(input.name, buffer, input.type)
  } catch (err: any) {
    return { success: false, error: `Upload failed: ${err.message || err}` }
  }

  return { success: true, name: input.name, type: input.type, size: buffer.length }
}

export const handlers: Record<string, ToolHandler> = {
  upload_file: uploadFile,
}
