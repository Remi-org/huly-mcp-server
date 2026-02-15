import { describe, it, expect } from 'vitest'
import { NotFoundError, ValidationError, ConnectionError } from '../errors'
import { errorResponse, successResponse } from '../error-handler'

describe('error classes', () => {
  it('NotFoundError has correct name and message', () => {
    const err = new NotFoundError('Issue', 'abc-123')
    expect(err.name).toBe('NotFoundError')
    expect(err.message).toBe('Issue abc-123 not found')
    expect(err).toBeInstanceOf(Error)
  })

  it('ValidationError has correct name and message', () => {
    const err = new ValidationError('field is required')
    expect(err.name).toBe('ValidationError')
    expect(err.message).toBe('field is required')
    expect(err).toBeInstanceOf(Error)
  })

  it('ConnectionError has correct name and message', () => {
    const err = new ConnectionError('timeout')
    expect(err.name).toBe('ConnectionError')
    expect(err.message).toBe('timeout')
    expect(err).toBeInstanceOf(Error)
  })
})

describe('errorResponse', () => {
  it('handles ValidationError', () => {
    const result = errorResponse(new ValidationError('bad input'))
    expect(result.isError).toBe(true)
    expect(result.content[0].text).toContain('Validation error')
    expect(result.content[0].text).toContain('bad input')
  })

  it('handles NotFoundError', () => {
    const result = errorResponse(new NotFoundError('Project', 'xyz'))
    expect(result.isError).toBe(true)
    expect(result.content[0].text).toBe('Project xyz not found')
  })

  it('handles ConnectionError', () => {
    const result = errorResponse(new ConnectionError('refused'))
    expect(result.isError).toBe(true)
    expect(result.content[0].text).toContain('Connection error')
    expect(result.content[0].text).toContain('refused')
  })

  it('handles generic Error', () => {
    const result = errorResponse(new Error('something broke'))
    expect(result.isError).toBe(true)
    expect(result.content[0].text).toContain('Internal error')
    expect(result.content[0].text).toContain('something broke')
  })

  it('handles non-Error values', () => {
    const result = errorResponse('string error')
    expect(result.isError).toBe(true)
    expect(result.content[0].text).toContain('Internal error')
    expect(result.content[0].text).toContain('string error')
  })
})

describe('successResponse', () => {
  it('wraps data as JSON text content', () => {
    const result = successResponse({ id: '123', name: 'Test' })
    expect(result.content[0].type).toBe('text')
    expect(JSON.parse(result.content[0].text)).toEqual({ id: '123', name: 'Test' })
  })

  it('handles arrays', () => {
    const result = successResponse([1, 2, 3])
    expect(JSON.parse(result.content[0].text)).toEqual([1, 2, 3])
  })

  it('handles null', () => {
    const result = successResponse(null)
    expect(result.content[0].text).toBe('null')
  })
})
