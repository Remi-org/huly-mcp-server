import { describe, it, expect } from 'vitest'
import { allDefinitions, allHandlers } from '../tools'

describe('tool registry', () => {
  const expectedTools = [
    // Issues (15)
    'list_projects', 'list_issues', 'get_issue', 'create_issue',
    'update_issue', 'add_comment', 'search_issues',
    'delete_issue', 'add_issue_label',
    'list_issue_templates', 'get_issue_template', 'create_issue_template',
    'update_issue_template', 'delete_issue_template', 'create_issue_from_template',
    // Organization (1)
    'list_statuses',
    // Cards (6)
    'list_card_spaces', 'list_cards', 'get_card', 'create_card',
    'update_card', 'delete_card',
    // Documents (6)
    'list_teamspaces', 'list_documents', 'get_document', 'create_document',
    'update_document', 'delete_document',
    // Attachments (7)
    'list_attachments', 'delete_attachment', 'get_attachment', 'add_attachment',
    'update_attachment', 'pin_attachment', 'download_attachment',
    // Components (5)
    'list_components', 'get_component', 'create_component', 'update_component', 'delete_component',
    // Milestones (5)
    'list_milestones', 'get_milestone', 'create_milestone', 'update_milestone', 'delete_milestone',
    // Comments (3)
    'list_comments', 'update_comment', 'delete_comment',
    // Search (1)
    'fulltext_search',
    // Contacts (8)
    'list_persons', 'get_person', 'create_person', 'update_person', 'delete_person',
    'list_employees', 'list_organizations', 'create_organization',
    // Storage (1)
    'upload_file',
    // Channels (11)
    'list_channels', 'get_channel', 'create_channel', 'update_channel', 'delete_channel',
    'list_channel_messages', 'send_channel_message', 'list_direct_messages',
    'list_thread_replies', 'add_thread_reply', 'delete_thread_reply',
    // Time tracking (8)
    'log_time', 'get_time_report', 'list_time_spend_reports', 'get_detailed_time_report',
    'list_work_slots', 'create_work_slot', 'start_timer', 'stop_timer',
    // Calendar (8)
    'list_events', 'get_event', 'create_event', 'update_event', 'delete_event',
    'list_recurring_events', 'create_recurring_event', 'list_event_instances',
    // Activity (8)
    'list_activity', 'add_reaction', 'remove_reaction', 'list_reactions',
    'save_message', 'unsave_message', 'list_saved_messages', 'list_mentions',
    // Notifications (13)
    'list_notifications', 'get_notification', 'mark_notification_read', 'mark_all_notifications_read',
    'archive_notification', 'archive_all_notifications', 'delete_notification',
    'get_notification_context', 'list_notification_contexts', 'pin_notification_context',
    'list_notification_settings', 'update_notification_provider_setting', 'get_unread_notification_count',
    // Workspace (10)
    'list_workspace_members', 'update_member_role', 'get_workspace_info', 'list_workspaces',
    'create_workspace', 'delete_workspace', 'get_user_profile', 'update_user_profile',
    'update_guest_settings', 'get_regions',
  ]

  it('registers all 116 tools', () => {
    expect(allDefinitions).toHaveLength(116)
  })

  it('has a handler for every definition', () => {
    for (const def of allDefinitions) {
      expect(allHandlers[def.name]).toBeDefined()
    }
  })

  it('has no orphan handlers', () => {
    const definedNames = new Set(allDefinitions.map((d) => d.name))
    for (const name of Object.keys(allHandlers)) {
      expect(definedNames.has(name)).toBe(true)
    }
  })

  it('includes all expected tool names', () => {
    const names = allDefinitions.map((d) => d.name)
    for (const tool of expectedTools) {
      expect(names).toContain(tool)
    }
  })

  it('all definitions have valid schema structure', () => {
    for (const def of allDefinitions) {
      expect(def.name).toBeTruthy()
      expect(def.description).toBeTruthy()
      expect(def.inputSchema.type).toBe('object')
      expect(def.inputSchema.properties).toBeDefined()
    }
  })

  it('no duplicate tool names', () => {
    const names = allDefinitions.map((d) => d.name)
    expect(new Set(names).size).toBe(names.length)
  })
})
