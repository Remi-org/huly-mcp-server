import { describe, it, expect, beforeEach } from 'vitest'
import { handlers, definitions } from '../../tools/issues'
import { createMockClient } from '../helpers'
import { NotFoundError } from '../../errors'

describe('issues tool definitions', () => {
  it('exports 7 tool definitions', () => {
    expect(definitions).toHaveLength(7)
  })

  it('has all expected tool names', () => {
    const names = definitions.map((d) => d.name)
    expect(names).toContain('list_projects')
    expect(names).toContain('list_issues')
    expect(names).toContain('get_issue')
    expect(names).toContain('create_issue')
    expect(names).toContain('update_issue')
    expect(names).toContain('add_comment')
    expect(names).toContain('search_issues')
  })

  it('all definitions have required schema fields', () => {
    for (const def of definitions) {
      expect(def.inputSchema.type).toBe('object')
      expect(def.inputSchema.properties).toBeDefined()
    }
  })
})

describe('issues handlers', () => {
  let client: ReturnType<typeof createMockClient>

  beforeEach(() => {
    client = createMockClient()
  })

  describe('list_projects', () => {
    it('returns mapped project data', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'p1', identifier: 'PROJ', name: 'Project 1', description: 'desc', defaultIssueStatus: 's1' },
      ])
      const result = await handlers.list_projects(client, {})
      expect(result).toEqual([{
        id: 'p1', identifier: 'PROJ', name: 'Project 1', description: 'desc', defaultStatus: 's1',
      }])
    })

    it('returns empty array when no projects', async () => {
      const result = await handlers.list_projects(client, {})
      expect(result).toEqual([])
    })
  })

  describe('list_issues', () => {
    it('returns mapped issue data', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'i1', identifier: 'PROJ-1', title: 'Bug', status: 's1', priority: 1, assignee: null, dueDate: null },
      ])
      const result = await handlers.list_issues(client, {})
      expect(result).toEqual([{
        id: 'i1', identifier: 'PROJ-1', title: 'Bug', status: 's1', priority: 1, assignee: null, dueDate: null,
      }])
    })

    it('passes projectId filter', async () => {
      await handlers.list_issues(client, { projectId: 'p1' })
      expect(client.findAll).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ space: 'p1' }))
    })

    it('passes status filter', async () => {
      await handlers.list_issues(client, { status: 's1' })
      expect(client.findAll).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ status: 's1' }))
    })

    it('passes assignee filter', async () => {
      await handlers.list_issues(client, { assignee: 'u1' })
      expect(client.findAll).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ assignee: 'u1' }))
    })
  })

  describe('get_issue', () => {
    it('returns issue when found', async () => {
      const issue = { _id: 'i1', title: 'Bug', description: null }
      client.findOne.mockResolvedValue(issue)
      const result = await handlers.get_issue(client, { issueId: 'i1' })
      expect(result).toEqual(issue)
    })

    it('fetches description markup when available', async () => {
      const issue = { _id: 'i1', title: 'Bug', description: 'blob:ref' }
      client.findOne.mockResolvedValue(issue)
      await handlers.get_issue(client, { issueId: 'i1' })
      expect(client.markup.fetchMarkup).toHaveBeenCalled()
    })

    it('throws NotFoundError when issue missing', async () => {
      await expect(handlers.get_issue(client, { issueId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })

    it('throws on missing issueId', async () => {
      await expect(handlers.get_issue(client, {})).rejects.toThrow()
    })
  })

  describe('create_issue', () => {
    it('creates issue with required fields', async () => {
      const project = { _id: 'p1', identifier: 'PROJ', defaultIssueStatus: 's1', _class: 'tracker:class:Project' }
      client.findOne.mockResolvedValueOnce(project).mockResolvedValueOnce(null)
      client.updateDoc.mockResolvedValue({ object: { sequence: 42 } })

      const result: any = await handlers.create_issue(client, { projectId: 'p1', title: 'New bug' })
      expect(result.success).toBe(true)
      expect(result.identifier).toBe('PROJ-42')
      expect(client.addCollection).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing project', async () => {
      await expect(handlers.create_issue(client, { projectId: 'missing', title: 'Bug' }))
        .rejects.toThrow(NotFoundError)
    })

    it('throws on missing title', async () => {
      await expect(handlers.create_issue(client, { projectId: 'p1' })).rejects.toThrow()
    })

    it('uploads description markup when provided', async () => {
      const project = { _id: 'p1', identifier: 'PROJ', defaultIssueStatus: 's1', _class: 'tracker:class:Project' }
      client.findOne.mockResolvedValueOnce(project).mockResolvedValueOnce(null)
      client.updateDoc.mockResolvedValue({ object: { sequence: 1 } })

      await handlers.create_issue(client, { projectId: 'p1', title: 'Bug', description: '# Hello' })
      expect(client.uploadMarkup).toHaveBeenCalled()
    })
  })

  describe('update_issue', () => {
    it('updates issue fields', async () => {
      const issue = { _id: 'i1', identifier: 'PROJ-1', space: 'p1', description: null }
      client.findOne.mockResolvedValue(issue)

      const result: any = await handlers.update_issue(client, { issueId: 'i1', title: 'Updated' })
      expect(result.success).toBe(true)
      expect(client.updateDoc).toHaveBeenCalledWith(
        expect.anything(), 'p1', 'i1', expect.objectContaining({ title: 'Updated' })
      )
    })

    it('throws NotFoundError for missing issue', async () => {
      await expect(handlers.update_issue(client, { issueId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('add_comment', () => {
    it('adds comment to issue', async () => {
      const issue = { _id: 'i1', identifier: 'PROJ-1', space: 'p1' }
      client.findOne.mockResolvedValue(issue)

      const result: any = await handlers.add_comment(client, { issueId: 'i1', comment: 'Hello' })
      expect(result.success).toBe(true)
      expect(client.uploadMarkup).toHaveBeenCalled()
      expect(client.addCollection).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing issue', async () => {
      await expect(handlers.add_comment(client, { issueId: 'missing', comment: 'Hi' }))
        .rejects.toThrow(NotFoundError)
    })

    it('throws on empty comment', async () => {
      await expect(handlers.add_comment(client, { issueId: 'i1', comment: '' })).rejects.toThrow()
    })
  })

  describe('search_issues', () => {
    it('searches with query', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'i1', identifier: 'PROJ-1', title: 'Bug', status: 's1' },
      ])
      const result: any = await handlers.search_issues(client, { query: 'bug' })
      expect(result).toHaveLength(1)
      expect(client.findAll).toHaveBeenCalledWith(
        expect.anything(), expect.objectContaining({ $search: 'bug' })
      )
    })

    it('filters by project when provided', async () => {
      await handlers.search_issues(client, { query: 'bug', projectId: 'p1' })
      expect(client.findAll).toHaveBeenCalledWith(
        expect.anything(), expect.objectContaining({ $search: 'bug', space: 'p1' })
      )
    })

    it('throws on empty query', async () => {
      await expect(handlers.search_issues(client, { query: '' })).rejects.toThrow()
    })
  })
})
