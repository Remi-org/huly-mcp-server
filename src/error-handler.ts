import { NotFoundError, ValidationError, ConnectionError } from './errors'
import { logger } from './logger'

export interface ToolResponse {
  content: Array<{ type: 'text'; text: string }>
  isError?: boolean
}

export function errorResponse(error: unknown): ToolResponse {
  if (error instanceof ValidationError) {
    return {
      content: [{ type: 'text', text: `Validation error: ${error.message}` }],
      isError: true,
    }
  }

  if (error instanceof NotFoundError) {
    return {
      content: [{ type: 'text', text: error.message }],
      isError: true,
    }
  }

  if (error instanceof ConnectionError) {
    return {
      content: [{ type: 'text', text: `Connection error: ${error.message}` }],
      isError: true,
    }
  }

  const message = error instanceof Error ? error.message : String(error)
  logger.error('Unexpected error', { error: message })
  return {
    content: [{ type: 'text', text: `Internal error: ${message}` }],
    isError: true,
  }
}

export function successResponse(data: unknown): ToolResponse {
  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  }
}
