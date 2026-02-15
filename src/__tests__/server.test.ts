import { describe, it, expect } from 'vitest'
import { allDefinitions, allHandlers } from '../tools'

describe('tool registry', () => {
  const expectedTools = [
    'list_projects', 'list_issues', 'get_issue', 'create_issue',
    'update_issue', 'add_comment', 'search_issues',
    'list_statuses', 'list_components', 'list_milestones',
    'list_card_spaces', 'list_cards', 'get_card', 'create_card',
    'update_card', 'delete_card',
    'list_teamspaces', 'list_documents', 'get_document', 'create_document',
    'update_document', 'delete_document',
    'list_attachments', 'delete_attachment',
  ]

  it('registers all 24 tools', () => {
    expect(allDefinitions).toHaveLength(24)
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
