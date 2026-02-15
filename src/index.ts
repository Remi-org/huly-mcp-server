#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'
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

async function ensureConnected() {
  if (!client) {
    logger.info('Connecting to Huly', { url: config.hulyUrl, workspace: config.hulyWorkspace })
    const options: ConnectOptions = {
      email: config.hulyEmail,
      password: config.hulyPassword,
      workspace: config.hulyWorkspace,
      socketFactory: NodeWebSocketFactory,
      connectionTimeout: 30000,
    }
    client = await connect(config.hulyUrl, options)
    logger.info('Connected to Huly')
  }
  return client
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
    logger.error('Tool execution failed', { tool: name, error: String(error) })
    return errorResponse(error)
  }
})

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  logger.info('Huly MCP server running on stdio')
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
