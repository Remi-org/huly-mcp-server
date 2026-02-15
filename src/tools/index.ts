import type { ToolDefinition, ToolHandler } from '../types'
import * as issues from './issues'
import * as organization from './organization'
import * as cards from './cards'
import * as documents from './documents'
import * as attachments from './attachments'
import * as components from './components'
import * as milestones from './milestones'
import * as comments from './comments'
import * as search from './search'
import * as contacts from './contacts'
import * as storage from './storage'
import * as channels from './channels'
import * as timeTracking from './time-tracking'
import * as calendar from './calendar'
import * as activity from './activity'
import * as notifications from './notifications'
import * as workspace from './workspace'

const modules = [
  issues, organization, cards, documents, attachments,
  components, milestones, comments, search,
  contacts, storage, channels,
  timeTracking, calendar, activity, notifications, workspace,
]

export const allDefinitions: ToolDefinition[] = modules.flatMap((m) => m.definitions)

export const allHandlers: Record<string, ToolHandler> = Object.assign(
  {},
  ...modules.map((m) => m.handlers)
)
