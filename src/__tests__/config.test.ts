import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { loadConfig } from '../config'

describe('loadConfig', () => {
  const validEnv = {
    HULY_URL: 'https://huly.example.com',
    HULY_EMAIL: 'user@example.com',
    HULY_PASSWORD: 'secret',
    HULY_WORKSPACE: 'my-workspace',
  }

  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnv = { ...process.env }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('returns config when all env vars are valid', () => {
    Object.assign(process.env, validEnv)
    const config = loadConfig()
    expect(config.hulyUrl).toBe(validEnv.HULY_URL)
    expect(config.hulyEmail).toBe(validEnv.HULY_EMAIL)
    expect(config.hulyPassword).toBe(validEnv.HULY_PASSWORD)
    expect(config.hulyWorkspace).toBe(validEnv.HULY_WORKSPACE)
  })

  it('throws when HULY_URL is missing', () => {
    Object.assign(process.env, { ...validEnv, HULY_URL: undefined })
    expect(() => loadConfig()).toThrow('Invalid configuration')
  })

  it('throws when HULY_URL is not a valid URL', () => {
    Object.assign(process.env, { ...validEnv, HULY_URL: 'not-a-url' })
    expect(() => loadConfig()).toThrow('Invalid configuration')
  })

  it('throws when HULY_EMAIL is missing', () => {
    Object.assign(process.env, { ...validEnv, HULY_EMAIL: undefined })
    expect(() => loadConfig()).toThrow('Invalid configuration')
  })

  it('throws when HULY_EMAIL is not a valid email', () => {
    Object.assign(process.env, { ...validEnv, HULY_EMAIL: 'not-an-email' })
    expect(() => loadConfig()).toThrow('Invalid configuration')
  })

  it('throws when HULY_PASSWORD is missing', () => {
    Object.assign(process.env, { ...validEnv, HULY_PASSWORD: undefined })
    expect(() => loadConfig()).toThrow('Invalid configuration')
  })

  it('throws when HULY_PASSWORD is empty', () => {
    Object.assign(process.env, { ...validEnv, HULY_PASSWORD: '' })
    expect(() => loadConfig()).toThrow('Invalid configuration')
  })

  it('throws when HULY_WORKSPACE is missing', () => {
    Object.assign(process.env, { ...validEnv, HULY_WORKSPACE: undefined })
    expect(() => loadConfig()).toThrow('Invalid configuration')
  })

  it('throws when multiple vars are missing', () => {
    delete process.env.HULY_URL
    delete process.env.HULY_EMAIL
    delete process.env.HULY_PASSWORD
    delete process.env.HULY_WORKSPACE
    expect(() => loadConfig()).toThrow('Invalid configuration')
  })
})
