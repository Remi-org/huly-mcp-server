export interface ToolDefinition {
  name: string
  description: string
  inputSchema: {
    type: 'object'
    properties: Record<string, unknown>
    required?: string[]
  }
}

export type ToolHandler = (client: any, args: Record<string, unknown>) => Promise<unknown>

export interface ToolModule {
  definitions: ToolDefinition[]
  handlers: Record<string, ToolHandler>
}
