#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { AsyncLocalStorage } from 'node:async_hooks'

const __dirname = dirname(fileURLToPath(import.meta.url))
try {
  const envPath = resolve(__dirname, '..', '.env')
  const lines = readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
} catch {}

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'
import { createServer, IncomingMessage } from 'node:http'
import { ConnectOptions, NodeWebSocketFactory, connect } from '@hcengineering/api-client'
import { loadConfig } from './config'
import { logger } from './logger'
import { errorResponse, successResponse } from './error-handler'
import { allDefinitions, allHandlers } from './tools'

export interface RequestCredentials {
  email: string
  password: string
}

export const credentialStore = new AsyncLocalStorage<RequestCredentials>()

const config = loadConfig()

const server = new Server(
  { name: 'huly-mcp-server', version: '1.0.0' },
  { capabilities: { tools: {} } }
)

const clientCache = new Map<string, { client: any; lastUsed: number }>()
const CLIENT_TTL = 5 * 60 * 1000

function clientCacheKey(email: string): string {
  return `${email}:${config.hulyWorkspace}`
}

async function getClient(credentials: RequestCredentials, retries = 3): Promise<any> {
  const key = clientCacheKey(credentials.email)
  const cached = clientCache.get(key)

  if (cached) {
    cached.lastUsed = Date.now()
    return cached.client
  }

  const options: ConnectOptions = {
    email: credentials.email,
    password: credentials.password,
    workspace: config.hulyWorkspace,
    socketFactory: NodeWebSocketFactory,
    connectionTimeout: 30000,
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      logger.info('Connecting to Huly', { url: config.hulyUrl, workspace: config.hulyWorkspace, email: credentials.email, attempt })
      const hulyClient = await connect(config.hulyUrl, options)
      logger.info('Connected to Huly', { email: credentials.email })
      clientCache.set(key, { client: hulyClient, lastUsed: Date.now() })
      return hulyClient
    } catch (error) {
      logger.warn('Connection attempt failed', { attempt, error: String(error) })
      if (attempt === retries) throw error
      await new Promise((r) => setTimeout(r, 1000 * attempt))
    }
  }
}

function cleanupStaleClients() {
  const now = Date.now()
  for (const [key, entry] of clientCache) {
    if (now - entry.lastUsed > CLIENT_TTL) {
      entry.client.close().catch(() => {})
      clientCache.delete(key)
      logger.info('Cleaned up stale client', { key })
    }
  }
}

setInterval(cleanupStaleClients, 60_000)

function extractCredentials(req: IncomingMessage): RequestCredentials | null {
  const header = req.headers['x-remi-credentials']
  if (!header) return null
  try {
    const parsed = JSON.parse(typeof header === 'string' ? header : header[0])
    if (parsed.email && parsed.password) {
      return { email: parsed.email, password: parsed.password }
    }
    return null
  } catch {
    return null
  }
}

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allDefinitions,
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  const handler = allHandlers[name]
  if (!handler) {
    return errorResponse(new Error(`Unknown tool: ${name}`))
  }

  try {
    const credentials = credentialStore.getStore()
    if (!credentials) {
      return errorResponse(new Error('No credentials provided. Send X-Remi-Credentials header.'))
    }

    const hulyClient = await getClient(credentials)
    const result = await handler(hulyClient, args || {})
    return successResponse(result)
  } catch (error) {
    if (error instanceof Error && error.message.includes('ECONNR')) {
      const credentials = credentialStore.getStore()
      if (credentials) {
        clientCache.delete(clientCacheKey(credentials.email))
      }
    }
    logger.error('Tool execution failed', { tool: name, error: String(error) })
    return errorResponse(error)
  }
})

async function main() {
  const mode = process.env.MCP_TRANSPORT || 'stdio'

  if (mode === 'http') {
    const port = parseInt(process.env.MCP_HTTP_PORT || '3001', 10)
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })

    const httpServer = createServer(async (req, res) => {
      if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ status: 'ok' }))
        return
      }
      if (req.url === '/mcp') {
        const credentials = extractCredentials(req)
        if (!credentials) {
          res.writeHead(401, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Missing or invalid X-Remi-Credentials header' }))
          return
        }
        credentialStore.run(credentials, () => {
          transport.handleRequest(req, res)
        })
        return
      }
      res.writeHead(404)
      res.end()
    })

    await server.connect(transport)
    httpServer.listen(port, () => {
      logger.info(`Huly MCP server running on http://0.0.0.0:${port}/mcp`)
    })
  } else {
    const transport = new StdioServerTransport()
    await server.connect(transport)
    logger.info('Huly MCP server running on stdio')
  }
}

function shutdown() {
  logger.info('Shutting down')
  for (const [, entry] of clientCache) {
    entry.client.close().catch(() => {})
  }
  clientCache.clear()
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

main().catch((error) => {
  logger.error('Fatal error', { error: String(error) })
  process.exit(1)
})
