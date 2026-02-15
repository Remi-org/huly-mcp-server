import { NotFoundError, ValidationError, ConnectionError } from './errors'
import { logger } from './logger'

export function errorResponse(error: unknown) {
  if (error instanceof ValidationError) {
    return {
      content: [{ type: 'text' as const, text: `Validation error: ${error.message}` }],
      isError: true,
    }
  }

  if (error instanceof NotFoundError) {
    return {
      content: [{ type: 'text' as const, text: error.message }],
      isError: true,
    }
  }

  if (error instanceof ConnectionError) {
    return {
      content: [{ type: 'text' as const, text: `Connection error: ${error.message}` }],
      isError: true,
    }
  }

  const message = error instanceof Error ? error.message : String(error)
  logger.error('Unexpected error', { error: message })
  return {
    content: [{ type: 'text' as const, text: `Internal error: ${message}` }],
    isError: true,
  }
}

export function successResponse(data: unknown) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
  }
}
