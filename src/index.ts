#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

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
import { createServer } from 'node:http'
import { ConnectOptions, NodeWebSocketFactory, connect } from '@hcengineering/api-client'
import { loadConfig } from './config'
import { logger } from './logger'
import { errorResponse, successResponse } from './error-handler'
import { allDefinitions, allHandlers } from './tools'

const config = loadConfig()

const server = new Server(
  { name: 'huly-mcp-server', version: '1.0.0' },
  { capabilities: { tools: {} } }
)

let client: any = null

async function ensureConnected(retries = 3) {
  if (client) return client

  const options: ConnectOptions = {
    email: config.hulyEmail,
    password: config.hulyPassword,
    workspace: config.hulyWorkspace,
    socketFactory: NodeWebSocketFactory,
    connectionTimeout: 30000,
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      logger.info('Connecting to Huly', { url: config.hulyUrl, workspace: config.hulyWorkspace, attempt })
      client = await connect(config.hulyUrl, options)
      logger.info('Connected to Huly')
      return client
    } catch (error) {
      logger.warn('Connection attempt failed', { attempt, error: String(error) })
      if (attempt === retries) throw error
      await new Promise((r) => setTimeout(r, 1000 * attempt))
    }
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
    const hulyClient = await ensureConnected()
    const result = await handler(hulyClient, args || {})
    return successResponse(result)
  } catch (error) {
    if (error instanceof Error && error.message.includes('ECONNR')) {
      client = null
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
        await transport.handleRequest(req, res)
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
  if (client) {
    client.close().catch(() => {})
  }
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

main().catch((error) => {
  logger.error('Fatal error', { error: String(error) })
  process.exit(1)
})
