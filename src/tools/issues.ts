import { z } from 'zod'
import tracker, { IssuePriority } from '@hcengineering/tracker'
import core, { generateId, Ref, Class, Doc } from '@hcengineering/core'
import { makeRank } from '@hcengineering/rank'
import { NotFoundError } from '../errors'
import type { ToolDefinition, ToolHandler } from '../types'

const COMMENT_CLASS = 'chunter:class:ChatMessage' as Ref<Class<Doc>>

const priorityMap: Record<string, number> = {
  Urgent: IssuePriority.Urgent,
  High: IssuePriority.High,
  Medium: IssuePriority.Medium,
  Low: IssuePriority.Low,
  NoPriority: IssuePriority.NoPriority,
}

export const definitions: ToolDefinition[] = [
  {
    name: 'list_projects',
    description: 'List all projects in Huly workspace',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'list_issues',
    description: 'List issues with optional filters',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Filter by project ID' },
        status: { type: 'string', description: 'Filter by status' },
        assignee: { type: 'string', description: 'Filter by assignee' },
      },
    },
  },
  {
    name: 'get_issue',
    description: 'Get full details of a specific issue by ID',
    inputSchema: {
      type: 'object',
      properties: {
        issueId: { type: 'string', description: 'Issue ID to retrieve' },
      },
      required: ['issueId'],
    },
  },
  {
    name: 'create_issue',
    description: 'Create a new issue in a project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID where issue will be created' },
        title: { type: 'string', description: 'Issue title' },
        description: { type: 'string', description: 'Issue description (markdown supported)' },
        priority: {
          type: 'string',
          description: 'Priority: Urgent, High, Medium, Low, NoPriority',
          enum: ['Urgent', 'High', 'Medium', 'Low', 'NoPriority'],
        },
        assignee: { type: 'string', description: 'Assignee user ID (optional)' },
        status: { type: 'string', description: 'Status ID (optional, uses default if not provided)' },
        component: { type: 'string', description: 'Component ID (optional)' },
        milestone: { type: 'string', description: 'Milestone ID (optional)' },
      },
      required: ['projectId', 'title'],
    },
  },
  {
    name: 'update_issue',
    description: 'Update an existing issue',
    inputSchema: {
      type: 'object',
      properties: {
        issueId: { type: 'string', description: 'Issue ID to update' },
        title: { type: 'string', description: 'New title (optional)' },
        description: { type: 'string', description: 'New description (optional)' },
        status: { type: 'string', description: 'New status ID (optional)' },
        assignee: { type: 'string', description: 'New assignee ID (optional)' },
        priority: { type: 'string', description: 'New priority (optional)' },
        component: { type: 'string', description: 'Component ID (optional)' },
        milestone: { type: 'string', description: 'Milestone ID (optional)' },
      },
      required: ['issueId'],
    },
  },
  {
    name: 'add_comment',
    description: 'Add a comment to an issue',
    inputSchema: {
      type: 'object',
      properties: {
        issueId: { type: 'string', description: 'Issue ID to comment on' },
        comment: { type: 'string', description: 'Comment text (markdown supported)' },
      },
      required: ['issueId', 'comment'],
    },
  },
  {
    name: 'search_issues',
    description: 'Search issues by text query',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        projectId: { type: 'string', description: 'Limit to specific project (optional)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'delete_issue',
    description: 'Delete an issue',
    inputSchema: {
      type: 'object',
      properties: {
        issueId: { type: 'string', description: 'Issue ID to delete' },
      },
      required: ['issueId'],
    },
  },
  {
    name: 'add_issue_label',
    description: 'Add a label to an issue',
    inputSchema: {
      type: 'object',
      properties: {
        issueId: { type: 'string', description: 'Issue ID' },
        label: { type: 'string', description: 'Label name' },
        color: { type: 'number', description: 'Label color (optional)' },
      },
      required: ['issueId', 'label'],
    },
  },
  {
    name: 'list_issue_templates',
    description: 'List issue templates in a project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Filter by project ID (optional)' },
      },
    },
  },
  {
    name: 'get_issue_template',
    description: 'Get details of an issue template',
    inputSchema: {
      type: 'object',
      properties: {
        templateId: { type: 'string', description: 'Template ID to retrieve' },
      },
      required: ['templateId'],
    },
  },
  {
    name: 'create_issue_template',
    description: 'Create a new issue template in a project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
        title: { type: 'string', description: 'Template title' },
        description: { type: 'string', description: 'Template description (optional)' },
        priority: {
          type: 'string',
          description: 'Default priority',
          enum: ['Urgent', 'High', 'Medium', 'Low', 'NoPriority'],
        },
        assignee: { type: 'string', description: 'Default assignee (optional)' },
        component: { type: 'string', description: 'Default component (optional)' },
        milestone: { type: 'string', description: 'Default milestone (optional)' },
      },
      required: ['projectId', 'title'],
    },
  },
  {
    name: 'update_issue_template',
    description: 'Update an existing issue template',
    inputSchema: {
      type: 'object',
      properties: {
        templateId: { type: 'string', description: 'Template ID to update' },
        title: { type: 'string', description: 'New title (optional)' },
        description: { type: 'string', description: 'New description (optional)' },
        priority: { type: 'string', description: 'New priority (optional)' },
        assignee: { type: 'string', description: 'New assignee (optional)' },
        component: { type: 'string', description: 'New component (optional)' },
        milestone: { type: 'string', description: 'New milestone (optional)' },
      },
      required: ['templateId'],
    },
  },
  {
    name: 'delete_issue_template',
    description: 'Delete an issue template',
    inputSchema: {
      type: 'object',
      properties: {
        templateId: { type: 'string', description: 'Template ID to delete' },
      },
      required: ['templateId'],
    },
  },
  {
    name: 'create_issue_from_template',
    description: 'Create an issue using a template as defaults',
    inputSchema: {
      type: 'object',
      properties: {
        templateId: { type: 'string', description: 'Template ID to use' },
        projectId: { type: 'string', description: 'Project ID (optional, uses template project if not provided)' },
        title: { type: 'string', description: 'Override title (optional, uses template title)' },
        description: { type: 'string', description: 'Override description (optional)' },
        assignee: { type: 'string', description: 'Override assignee (optional)' },
        priority: { type: 'string', description: 'Override priority (optional)' },
      },
      required: ['templateId'],
    },
  },
]

const listProjects: ToolHandler = async (client) => {
  const projects = await client.findAll(tracker.class.Project, {})
  return projects.map((p: any) => ({
    id: p._id,
    identifier: p.identifier,
    name: p.name,
    description: p.description,
    defaultStatus: p.defaultIssueStatus,
  }))
}

const listIssues: ToolHandler = async (client, args) => {
  const input = z.object({
    projectId: z.string().optional(),
    status: z.string().optional(),
    assignee: z.string().optional(),
  }).parse(args)

  const query: any = {}
  if (input.projectId) query.space = input.projectId
  if (input.status) query.status = input.status
  if (input.assignee) query.assignee = input.assignee

  const issues = await client.findAll(tracker.class.Issue, query)
  return issues.map((i: any) => ({
    id: i._id,
    identifier: i.identifier,
    title: i.title,
    status: i.status,
    priority: i.priority,
    assignee: i.assignee,
    dueDate: i.dueDate,
  }))
}

const getIssue: ToolHandler = async (client, args) => {
  const { issueId } = z.object({ issueId: z.string() }).parse(args)

  const issue = await client.findOne(tracker.class.Issue, { _id: issueId })
  if (!issue) throw new NotFoundError('Issue', issueId)

  if (issue.description && client.markup?.fetchMarkup) {
    try {
      issue.descriptionContent = await client.markup.fetchMarkup(
        tracker.class.Issue, issueId, 'description', issue.description, 'markdown'
      )
    } catch (e) {
      issue.descriptionContent = `[Error fetching description: ${e}]`
    }
  }

  return issue
}

const createIssue: ToolHandler = async (client, args) => {
  const input = z.object({
    projectId: z.string(),
    title: z.string().min(1),
    description: z.string().optional(),
    priority: z.enum(['Urgent', 'High', 'Medium', 'Low', 'NoPriority']).optional(),
    assignee: z.string().optional(),
    status: z.string().optional(),
    component: z.string().optional(),
    milestone: z.string().optional(),
  }).parse(args)

  const project = await client.findOne(tracker.class.Project, { _id: input.projectId })
  if (!project) throw new NotFoundError('Project', input.projectId)

  const issueId = generateId()

  const seqResult = await client.updateDoc(
    tracker.class.Project, core.space.Space, project._id,
    { $inc: { sequence: 1 } }, true
  )
  const number = (seqResult as any).object.sequence

  const lastIssue = await client.findOne(
    tracker.class.Issue, { space: project._id }, { sort: { rank: -1 } }
  )

  const descriptionMarkup = input.description
    ? await client.uploadMarkup(
        tracker.class.Issue, issueId, 'description', input.description, 'markdown'
      )
    : null

  await client.addCollection(
    tracker.class.Issue, project._id, project._id, project._class, 'issues',
    {
      title: input.title,
      description: descriptionMarkup,
      status: input.status || project.defaultIssueStatus,
      number,
      kind: tracker.taskTypes.Issue,
      identifier: `${project.identifier}-${number}`,
      priority: priorityMap[input.priority || 'NoPriority'] || IssuePriority.NoPriority,
      assignee: input.assignee || null,
      component: input.component || null,
      milestone: input.milestone || null,
      estimation: 0,
      remainingTime: 0,
      reportedTime: 0,
      reports: 0,
      subIssues: 0,
      parents: [],
      childInfo: [],
      dueDate: null,
      rank: makeRank(lastIssue?.rank, undefined),
    },
    issueId
  )

  return {
    success: true,
    issueId,
    identifier: `${project.identifier}-${number}`,
    message: `Created issue ${project.identifier}-${number}`,
  }
}

const updateIssue: ToolHandler = async (client, args) => {
  const input = z.object({
    issueId: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    status: z.string().optional(),
    assignee: z.string().optional(),
    priority: z.enum(['Urgent', 'High', 'Medium', 'Low', 'NoPriority']).optional(),
    component: z.string().optional(),
    milestone: z.string().optional(),
  }).parse(args)

  const issue = await client.findOne(tracker.class.Issue, { _id: input.issueId })
  if (!issue) throw new NotFoundError('Issue', input.issueId)

  const updates: any = {}
  if (input.title) updates.title = input.title
  if (input.status) updates.status = input.status
  if (input.assignee !== undefined) updates.assignee = input.assignee || null
  if (input.component !== undefined) updates.component = input.component || null
  if (input.milestone !== undefined) updates.milestone = input.milestone || null
  if (input.priority) updates.priority = priorityMap[input.priority]

  if (input.description) {
    if (issue.description) {
      const { parseMessageMarkdown, jsonToMarkup } = await import('@hcengineering/text')
      const parsed = parseMessageMarkdown(input.description, '', '')
      const markup = jsonToMarkup(parsed)
      await client.markup.collaborator.updateMarkup(
        { objectClass: tracker.class.Issue, objectId: input.issueId, objectAttr: 'description' },
        markup
      )
    } else {
      updates.description = await client.uploadMarkup(
        tracker.class.Issue, input.issueId, 'description', input.description, 'markdown'
      )
    }
  }

  if (Object.keys(updates).length > 0) {
    await client.updateDoc(tracker.class.Issue, issue.space, input.issueId, updates)
  }

  return {
    success: true,
    issueId: input.issueId,
    identifier: issue.identifier,
    message: `Updated issue ${issue.identifier}`,
  }
}

const addComment: ToolHandler = async (client, args) => {
  const input = z.object({
    issueId: z.string(),
    comment: z.string().min(1),
  }).parse(args)

  const issue = await client.findOne(tracker.class.Issue, { _id: input.issueId })
  if (!issue) throw new NotFoundError('Issue', input.issueId)

  const commentId = generateId()
  const commentMarkup = await client.uploadMarkup(
    COMMENT_CLASS, commentId, 'message', input.comment, 'markdown'
  )

  await client.addCollection(
    COMMENT_CLASS, issue.space, input.issueId, tracker.class.Issue, 'comments',
    { message: commentMarkup },
    commentId
  )

  return {
    success: true,
    commentId,
    issueId: input.issueId,
    message: `Added comment to ${issue.identifier}`,
  }
}

const searchIssues: ToolHandler = async (client, args) => {
  const input = z.object({
    query: z.string().min(1),
    projectId: z.string().optional(),
  }).parse(args)

  const searchQuery: any = { $search: input.query }
  if (input.projectId) searchQuery.space = input.projectId

  const issues = await client.findAll(tracker.class.Issue, searchQuery)
  return issues.map((i: any) => ({
    id: i._id,
    identifier: i.identifier,
    title: i.title,
    status: i.status,
  }))
}

const TAG_REFERENCE_CLASS = 'tags:class:TagReference' as Ref<Class<Doc>>

const deleteIssue: ToolHandler = async (client, args) => {
  const { issueId } = z.object({ issueId: z.string() }).parse(args)
  const issue = await client.findOne(tracker.class.Issue, { _id: issueId })
  if (!issue) throw new NotFoundError('Issue', issueId)

  await client.removeDoc(tracker.class.Issue, issue.space, issueId)
  return { success: true, issueId, identifier: issue.identifier, message: `Deleted issue ${issue.identifier}` }
}

const addIssueLabel: ToolHandler = async (client, args) => {
  const input = z.object({
    issueId: z.string(),
    label: z.string().min(1),
    color: z.number().optional(),
  }).parse(args)

  const issue = await client.findOne(tracker.class.Issue, { _id: input.issueId })
  if (!issue) throw new NotFoundError('Issue', input.issueId)

  const tagId = generateId()
  await client.addCollection(
    TAG_REFERENCE_CLASS, issue.space, input.issueId, tracker.class.Issue, 'labels',
    { title: input.label, color: input.color || 0, tag: tagId },
    tagId
  )

  return { success: true, issueId: input.issueId, label: input.label, message: `Added label "${input.label}" to ${issue.identifier}` }
}

const listIssueTemplates: ToolHandler = async (client, args) => {
  const input = z.object({ projectId: z.string().optional() }).parse(args)
  const query: any = {}
  if (input.projectId) query.space = input.projectId

  const templates = await client.findAll(tracker.class.IssueTemplate, query)
  return templates.map((t: any) => ({
    id: t._id,
    title: t.title,
    priority: t.priority,
    assignee: t.assignee,
    component: t.component,
    milestone: t.milestone,
    space: t.space,
  }))
}

const getIssueTemplate: ToolHandler = async (client, args) => {
  const { templateId } = z.object({ templateId: z.string() }).parse(args)
  const template = await client.findOne(tracker.class.IssueTemplate, { _id: templateId })
  if (!template) throw new NotFoundError('Issue template', templateId)
  return template
}

const createIssueTemplate: ToolHandler = async (client, args) => {
  const input = z.object({
    projectId: z.string(),
    title: z.string().min(1),
    description: z.string().optional(),
    priority: z.enum(['Urgent', 'High', 'Medium', 'Low', 'NoPriority']).optional(),
    assignee: z.string().optional(),
    component: z.string().optional(),
    milestone: z.string().optional(),
  }).parse(args)

  const project = await client.findOne(tracker.class.Project, { _id: input.projectId })
  if (!project) throw new NotFoundError('Project', input.projectId)

  const templateId = generateId()
  await client.createDoc(tracker.class.IssueTemplate, input.projectId, {
    title: input.title,
    description: input.description || '',
    priority: priorityMap[input.priority || 'NoPriority'] || IssuePriority.NoPriority,
    assignee: input.assignee || null,
    component: input.component || null,
    milestone: input.milestone || null,
    estimation: 0,
    labels: [],
    children: [],
    comments: 0,
  }, templateId)

  return { success: true, templateId, message: `Created issue template "${input.title}"` }
}

const updateIssueTemplate: ToolHandler = async (client, args) => {
  const input = z.object({
    templateId: z.string(),
    title: z.string().optional(),
    description: z.string().optional(),
    priority: z.enum(['Urgent', 'High', 'Medium', 'Low', 'NoPriority']).optional(),
    assignee: z.string().optional(),
    component: z.string().optional(),
    milestone: z.string().optional(),
  }).parse(args)

  const template = await client.findOne(tracker.class.IssueTemplate, { _id: input.templateId })
  if (!template) throw new NotFoundError('Issue template', input.templateId)

  const updates: any = {}
  if (input.title) updates.title = input.title
  if (input.description !== undefined) updates.description = input.description
  if (input.priority) updates.priority = priorityMap[input.priority]
  if (input.assignee !== undefined) updates.assignee = input.assignee || null
  if (input.component !== undefined) updates.component = input.component || null
  if (input.milestone !== undefined) updates.milestone = input.milestone || null

  if (Object.keys(updates).length > 0) {
    await client.updateDoc(tracker.class.IssueTemplate, template.space, input.templateId, updates)
  }

  return { success: true, templateId: input.templateId, message: `Updated issue template "${template.title}"` }
}

const deleteIssueTemplate: ToolHandler = async (client, args) => {
  const { templateId } = z.object({ templateId: z.string() }).parse(args)
  const template = await client.findOne(tracker.class.IssueTemplate, { _id: templateId })
  if (!template) throw new NotFoundError('Issue template', templateId)

  await client.removeDoc(tracker.class.IssueTemplate, template.space, templateId)
  return { success: true, templateId, message: `Deleted issue template "${template.title}"` }
}

const createIssueFromTemplate: ToolHandler = async (client, args) => {
  const input = z.object({
    templateId: z.string(),
    projectId: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    assignee: z.string().optional(),
    priority: z.enum(['Urgent', 'High', 'Medium', 'Low', 'NoPriority']).optional(),
  }).parse(args)

  const template = await client.findOne(tracker.class.IssueTemplate, { _id: input.templateId })
  if (!template) throw new NotFoundError('Issue template', input.templateId)

  return createIssue(client, {
    projectId: input.projectId || template.space,
    title: input.title || template.title,
    description: input.description || template.description || undefined,
    priority: input.priority || Object.entries(priorityMap).find(([, v]) => v === template.priority)?.[0],
    assignee: input.assignee || template.assignee || undefined,
    component: template.component || undefined,
    milestone: template.milestone || undefined,
  })
}

export const handlers: Record<string, ToolHandler> = {
  list_projects: listProjects,
  list_issues: listIssues,
  get_issue: getIssue,
  create_issue: createIssue,
  update_issue: updateIssue,
  add_comment: addComment,
  search_issues: searchIssues,
  delete_issue: deleteIssue,
  add_issue_label: addIssueLabel,
  list_issue_templates: listIssueTemplates,
  get_issue_template: getIssueTemplate,
  create_issue_template: createIssueTemplate,
  update_issue_template: updateIssueTemplate,
  delete_issue_template: deleteIssueTemplate,
  create_issue_from_template: createIssueFromTemplate,
}
