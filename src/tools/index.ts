import type { ToolDefinition, ToolHandler } from '../types'
import * as issues from './issues'
import * as organization from './organization'
import * as cards from './cards'
import * as documents from './documents'
import * as attachments from './attachments'

const modules = [issues, organization, cards, documents, attachments]

export const allDefinitions: ToolDefinition[] = modules.flatMap((m) => m.definitions)

export const allHandlers: Record<string, ToolHandler> = Object.assign(
  {},
  ...modules.map((m) => m.handlers)
)
