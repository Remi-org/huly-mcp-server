export interface ServerConfig {
  transport: 'stdio' | 'http'
  httpPort: number
}

export function loadConfig(): ServerConfig {
  return {
    transport: (process.env.MCP_TRANSPORT as 'stdio' | 'http') || 'stdio',
    httpPort: parseInt(process.env.MCP_HTTP_PORT || '3001', 10),
  }
}
