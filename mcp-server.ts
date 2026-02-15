#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'
import { ConnectOptions, NodeWebSocketFactory, connect } from '@hcengineering/api-client'
import tracker, { IssuePriority, Component, Milestone } from '@hcengineering/tracker'
import core, { generateId, Ref, Class, Doc } from '@hcengineering/core'
import { makeRank } from '@hcengineering/rank'

// Huly class types
type CardClass = Class<Doc>
type CardSpaceClass = Class<Doc>
type DocumentClass = Class<Doc>
type FileClass = Class<Doc>
type TeamspaceClass = Class<Doc>
type AttachmentClass = Class<Doc>

// Custom card types
type UserJourneyClass = Class<Doc>
type FlowStepClass = Class<Doc>
type ScreenClass = Class<Doc>
type DomainClass = Class<Doc>
type EventClass = Class<Doc>

// Base class identifiers (Huly runtime strings)
const CARD_CLASS = 'card:class:Card' as Ref<CardClass>
const CARD_SPACE_CLASS = 'card:class:CardSpace' as Ref<CardSpaceClass>
const DOCUMENT_CLASS = 'document:class:Document' as Ref<DocumentClass>  // Real documents in teamspaces
const FILE_CLASS = 'card:types:File' as Ref<FileClass>
const TEAMSPACE_CLASS = 'document:class:Teamspace' as Ref<TeamspaceClass>
const ATTACHMENT_CLASS = 'attachment:class:Attachment' as Ref<AttachmentClass>

// Custom card type identifiers (from Product card space)
const USER_JOURNEY_CLASS = '68602f2b7facf7f9736d6ff2' as Ref<UserJourneyClass>
const FLOW_STEP_CLASS = '68602f377facf7f9736d7006' as Ref<FlowStepClass>
const SCREEN_CLASS = '68602f3f7facf7f9736d701a' as Ref<ScreenClass>
const DOMAIN_CLASS = '6860fe6708c98aae415d41f5' as Ref<DomainClass>
const EVENT_CLASS = '6860f28f08c98aae415d3bde' as Ref<EventClass>

const server = new Server(
  { name: 'huly-mcp-server', version: '1.0.0' },
  { capabilities: { tools: {} } }
)

let client: any = null

async function ensureConnected() {
  if (!client) {
    const options: ConnectOptions = {
      email: process.env.HULY_EMAIL!,
      password: process.env.HULY_PASSWORD!,
      workspace: process.env.HULY_WORKSPACE!,
      socketFactory: NodeWebSocketFactory,
      connectionTimeout: 30000
    }
    client = await connect(process.env.HULY_URL!, options)
  }
  return client
}

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'list_projects',
      description: 'List all projects in Huly workspace',
      inputSchema: { type: 'object', properties: {} }
    },
    {
      name: 'list_issues',
      description: 'List issues with optional filters',
      inputSchema: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'Filter by project ID' },
          status: { type: 'string', description: 'Filter by status' },
          assignee: { type: 'string', description: 'Filter by assignee' }
        }
      }
    },
    {
      name: 'get_issue',
      description: 'Get full details of a specific issue by ID',
      inputSchema: {
        type: 'object',
        properties: {
          issueId: { type: 'string', description: 'Issue ID to retrieve' }
        },
        required: ['issueId']
      }
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
            enum: ['Urgent', 'High', 'Medium', 'Low', 'NoPriority']
          },
          assignee: { type: 'string', description: 'Assignee user ID (optional)' },
          status: { type: 'string', description: 'Status ID (optional, uses default if not provided)' },
          component: { type: 'string', description: 'Component ID (optional)' },
          milestone: { type: 'string', description: 'Milestone ID (optional)' }
        },
        required: ['projectId', 'title']
      }
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
          milestone: { type: 'string', description: 'Milestone ID (optional)' }
        },
        required: ['issueId']
      }
    },
    {
      name: 'add_comment',
      description: 'Add a comment to an issue',
      inputSchema: {
        type: 'object',
        properties: {
          issueId: { type: 'string', description: 'Issue ID to comment on' },
          comment: { type: 'string', description: 'Comment text (markdown supported)' }
        },
        required: ['issueId', 'comment']
      }
    },
    {
      name: 'search_issues',
      description: 'Search issues by text query',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          projectId: { type: 'string', description: 'Limit to specific project (optional)' }
        },
        required: ['query']
      }
    },
    {
      name: 'list_statuses',
      description: 'List all available issue statuses for a project',
      inputSchema: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'Project ID' }
        },
        required: ['projectId']
      }
    },
    {
      name: 'list_components',
      description: 'List all components in a project',
      inputSchema: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'Project ID' }
        },
        required: ['projectId']
      }
    },
    {
      name: 'list_milestones',
      description: 'List all milestones in a project',
      inputSchema: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'Project ID' }
        },
        required: ['projectId']
      }
    },
    {
      name: 'list_cards',
      description: 'List all cards in workspace or card space',
      inputSchema: {
        type: 'object',
        properties: {
          cardSpaceId: { type: 'string', description: 'Filter by card space ID (optional)' }
        }
      }
    },
    {
      name: 'list_card_spaces',
      description: 'List all card spaces in the workspace',
      inputSchema: { type: 'object', properties: {} }
    },
    {
      name: 'get_card',
      description: 'Get full details of a specific card by ID',
      inputSchema: {
        type: 'object',
        properties: {
          cardId: { type: 'string', description: 'Card ID to retrieve' }
        },
        required: ['cardId']
      }
    },
    {
      name: 'create_card',
      description: 'Create a new card in a card space',
      inputSchema: {
        type: 'object',
        properties: {
          cardSpaceId: { type: 'string', description: 'Card space ID where card will be created' },
          title: { type: 'string', description: 'Card title' },
          content: { type: 'string', description: 'Card content (markdown supported)' },
          type: { type: 'string', description: 'Card type ID (optional)' }
        },
        required: ['cardSpaceId', 'title']
      }
    },
    {
      name: 'update_card',
      description: 'Update an existing card',
      inputSchema: {
        type: 'object',
        properties: {
          cardId: { type: 'string', description: 'Card ID to update' },
          title: { type: 'string', description: 'New title (optional)' },
          content: { type: 'string', description: 'New content (optional)' }
        },
        required: ['cardId']
      }
    },
    {
      name: 'delete_card',
      description: 'Delete a card',
      inputSchema: {
        type: 'object',
        properties: {
          cardId: { type: 'string', description: 'Card ID to delete' }
        },
        required: ['cardId']
      }
    },
    {
      name: 'list_attachments',
      description: 'List attachments on an issue or card',
      inputSchema: {
        type: 'object',
        properties: {
          attachedTo: { type: 'string', description: 'ID of issue or card' },
          attachedToClass: { type: 'string', description: 'Class (tracker:class:Issue or card:class:Card)' }
        },
        required: ['attachedTo', 'attachedToClass']
      }
    },
    {
      name: 'delete_attachment',
      description: 'Delete an attachment',
      inputSchema: {
        type: 'object',
        properties: {
          attachmentId: { type: 'string', description: 'Attachment ID to delete' }
        },
        required: ['attachmentId']
      }
    },
    {
      name: 'list_teamspaces',
      description: 'List all teamspaces (document containers)',
      inputSchema: { type: 'object', properties: {} }
    },
    {
      name: 'list_documents',
      description: 'List documents in a teamspace or all documents',
      inputSchema: {
        type: 'object',
        properties: {
          teamspaceId: { type: 'string', description: 'Filter by teamspace ID (optional)' }
        }
      }
    },
    {
      name: 'get_document',
      description: 'Get full details of a specific document by ID with content',
      inputSchema: {
        type: 'object',
        properties: {
          documentId: { type: 'string', description: 'Document ID to retrieve' }
        },
        required: ['documentId']
      }
    },
    {
      name: 'create_document',
      description: 'Create a new document in a teamspace',
      inputSchema: {
        type: 'object',
        properties: {
          teamspaceId: { type: 'string', description: 'Teamspace ID where document will be created' },
          title: { type: 'string', description: 'Document title' },
          content: { type: 'string', description: 'Document content (markdown supported)' }
        },
        required: ['teamspaceId', 'title']
      }
    },
    {
      name: 'update_document',
      description: 'Update an existing document',
      inputSchema: {
        type: 'object',
        properties: {
          documentId: { type: 'string', description: 'Document ID to update' },
          title: { type: 'string', description: 'New title (optional)' },
          content: { type: 'string', description: 'New content (optional)' }
        },
        required: ['documentId']
      }
    },
    {
      name: 'delete_document',
      description: 'Delete a document',
      inputSchema: {
        type: 'object',
        properties: {
          documentId: { type: 'string', description: 'Document ID to delete' }
        },
        required: ['documentId']
      }
    }
  ]
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const huly = await ensureConnected()
    const { name, arguments: args } = request.params

    if (name === 'list_projects') {
      const projects = await huly.findAll(tracker.class.Project, {})
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(projects.map((p: any) => ({
            id: p._id,
            identifier: p.identifier,
            name: p.name,
            description: p.description,
            defaultStatus: p.defaultIssueStatus
          })), null, 2)
        }]
      }
    }

    if (name === 'list_issues') {
      const query: any = {}
      if (args && typeof args === 'object') {
        const filters = args as { projectId?: string; status?: string; assignee?: string }
        if (filters.projectId) query.space = filters.projectId
        if (filters.status) query.status = filters.status
        if (filters.assignee) query.assignee = filters.assignee
      }
      const issues = await huly.findAll(tracker.class.Issue, query)
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(issues.map((i: any) => ({
            id: i._id,
            identifier: i.identifier,
            title: i.title,
            status: i.status,
            priority: i.priority,
            assignee: i.assignee,
            dueDate: i.dueDate
          })), null, 2)
        }]
      }
    }

    if (name === 'get_issue') {
      const { issueId } = args as { issueId: string }
      const issue = await huly.findOne(tracker.class.Issue, { _id: issueId })
      if (!issue) {
        return {
          content: [{ type: 'text', text: `Issue ${issueId} not found` }],
          isError: true
        }
      }

      // Fetch actual description content if it exists
      if (issue.description && huly.markup && huly.markup.fetchMarkup) {
        try {
          const descriptionContent = await huly.markup.fetchMarkup(
            tracker.class.Issue,
            issueId,
            'description',
            issue.description,
            'markdown'
          )
          issue.descriptionContent = descriptionContent
        } catch (e) {
          issue.descriptionContent = `[Error fetching description: ${e}]`
        }
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(issue, null, 2)
        }]
      }
    }

    if (name === 'create_issue') {
      const { projectId, title, description, priority, assignee, status, component, milestone } = args as {
        projectId: string
        title: string
        description?: string
        priority?: string
        assignee?: string
        status?: string
        component?: string
        milestone?: string
      }

      const project = await huly.findOne(tracker.class.Project, { _id: projectId })
      if (!project) {
        return {
          content: [{ type: 'text', text: `Project ${projectId} not found` }],
          isError: true
        }
      }

      const issueId = generateId()

      const seqResult = await huly.updateDoc(
        tracker.class.Project,
        core.space.Space,
        project._id,
        { $inc: { sequence: 1 } },
        true
      )
      const number = (seqResult as any).object.sequence

      let lastIssue = await huly.findOne(
        tracker.class.Issue,
        { space: project._id },
        { sort: { rank: -1 } }
      )

      const descriptionMarkup = description
        ? await huly.uploadMarkup(
            tracker.class.Issue,
            issueId,
            'description',
            description,
            'markdown'
          )
        : null

      const priorityMap: Record<string, number> = {
        'Urgent': IssuePriority.Urgent,
        'High': IssuePriority.High,
        'Medium': IssuePriority.Medium,
        'Low': IssuePriority.Low,
        'NoPriority': IssuePriority.NoPriority
      }

      await huly.addCollection(
        tracker.class.Issue,
        project._id,
        project._id,
        project._class,
        'issues',
        {
          title,
          description: descriptionMarkup,
          status: status || project.defaultIssueStatus,
          number,
          kind: tracker.taskTypes.Issue,
          identifier: `${project.identifier}-${number}`,
          priority: priorityMap[priority || 'NoPriority'] || IssuePriority.NoPriority,
          assignee: assignee || null,
          component: component || null,
          milestone: milestone || null,
          estimation: 0,
          remainingTime: 0,
          reportedTime: 0,
          reports: 0,
          subIssues: 0,
          parents: [],
          childInfo: [],
          dueDate: null,
          rank: makeRank(lastIssue?.rank, undefined)
        },
        issueId
      )

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            issueId,
            identifier: `${project.identifier}-${number}`,
            message: `Created issue ${project.identifier}-${number}`
          }, null, 2)
        }]
      }
    }

    if (name === 'update_issue') {
      const { issueId, title, description, status, assignee, priority, component, milestone } = args as {
        issueId: string
        title?: string
        description?: string
        status?: string
        assignee?: string
        priority?: string
        component?: string
        milestone?: string
      }

      const issue = await huly.findOne(tracker.class.Issue, { _id: issueId })
      if (!issue) {
        return {
          content: [{ type: 'text', text: `Issue ${issueId} not found` }],
          isError: true
        }
      }

      const updates: any = {}
      if (title) updates.title = title
      if (status) updates.status = status
      if (assignee !== undefined) updates.assignee = assignee || null
      if (component !== undefined) updates.component = component || null
      if (milestone !== undefined) updates.milestone = milestone || null

      if (priority) {
        const priorityMap: Record<string, number> = {
          'Urgent': IssuePriority.Urgent,
          'High': IssuePriority.High,
          'Medium': IssuePriority.Medium,
          'Low': IssuePriority.Low,
          'NoPriority': IssuePriority.NoPriority
        }
        updates.priority = priorityMap[priority]
      }

      if (description) {
        // For existing issues with descriptions, use updateMarkup (not createMarkup)
        // This updates the blob in S3 instead of creating a new orphaned ref
        if (issue.description) {
          // Import text conversion functions
          const { parseMessageMarkdown, jsonToMarkup } = await import('@hcengineering/text')
          const parsed = parseMessageMarkdown(description, '', '')
          const markup = jsonToMarkup(parsed)

          await huly.markup.collaborator.updateMarkup(
            {
              objectClass: tracker.class.Issue,
              objectId: issueId,
              objectAttr: 'description'
            },
            markup
          )
          // Don't update the ref - it stays the same
        } else {
          // No existing description - create new one
          updates.description = await huly.uploadMarkup(
            tracker.class.Issue,
            issueId,
            'description',
            description,
            'markdown'
          )
        }
      }

      if (Object.keys(updates).length > 0) {
        await huly.updateDoc(
          tracker.class.Issue,
          issue.space,
          issueId,
          updates
        )
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            issueId,
            identifier: issue.identifier,
            message: `Updated issue ${issue.identifier}`
          }, null, 2)
        }]
      }
    }

    if (name === 'add_comment') {
      const { issueId, comment } = args as { issueId: string; comment: string }

      const issue = await huly.findOne(tracker.class.Issue, { _id: issueId })
      if (!issue) {
        return {
          content: [{ type: 'text', text: `Issue ${issueId} not found` }],
          isError: true
        }
      }

      const commentId = generateId()
      const commentMarkup = await huly.uploadMarkup(
        tracker.class.Comment,
        commentId,
        'message',
        comment,
        'markdown'
      )

      await huly.addCollection(
        tracker.class.Comment,
        issue.space,
        issueId,
        tracker.class.Issue,
        'comments',
        {
          message: commentMarkup
        },
        commentId
      )

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            commentId,
            issueId,
            message: `Added comment to ${issue.identifier}`
          }, null, 2)
        }]
      }
    }

    if (name === 'search_issues') {
      const { query, projectId } = args as { query: string; projectId?: string }

      const searchQuery: any = {
        $search: query
      }
      if (projectId) searchQuery.space = projectId

      const issues = await huly.findAll(tracker.class.Issue, searchQuery)
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(issues.map((i: any) => ({
            id: i._id,
            identifier: i.identifier,
            title: i.title,
            status: i.status
          })), null, 2)
        }]
      }
    }

    if (name === 'list_statuses') {
      const { projectId } = args as { projectId: string }
      const statuses = await huly.findAll(tracker.class.IssueStatus, { space: projectId })
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(statuses.map((s: any) => ({
            id: s._id,
            name: s.name,
            category: s.category
          })), null, 2)
        }]
      }
    }

    if (name === 'list_components') {
      const { projectId } = args as { projectId: string }
      const components = await huly.findAll(tracker.class.Component, { space: projectId })
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(components.map((c: any) => ({
            id: c._id,
            label: c.label,
            description: c.description
          })), null, 2)
        }]
      }
    }

    if (name === 'list_milestones') {
      const { projectId } = args as { projectId: string }
      const milestones = await huly.findAll(tracker.class.Milestone, { space: projectId })
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(milestones.map((m: any) => ({
            id: m._id,
            label: m.label,
            description: m.description,
            targetDate: m.targetDate,
            status: m.status
          })), null, 2)
        }]
      }
    }

    if (name === 'list_cards') {
      const query: any = {}
      if (args && typeof args === 'object') {
        const { cardSpaceId } = args as { cardSpaceId?: string }
        if (cardSpaceId) query.space = cardSpaceId
      }
      const cards = await huly.findAll(CARD_CLASS, query)
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(cards.map((c: any) => ({
            id: c._id,
            title: c.title,
            space: c.space,
            type: c._class,
            createdOn: c.createdOn
          })), null, 2)
        }]
      }
    }

    if (name === 'list_card_spaces') {
      const cardSpaces = await huly.findAll(CARD_SPACE_CLASS, {})
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(cardSpaces.map((cs: any) => ({
            id: cs._id,
            name: cs.name,
            description: cs.description,
            members: cs.members,
            owners: cs.owners
          })), null, 2)
        }]
      }
    }

    if (name === 'get_card') {
      const { cardId } = args as { cardId: string }
      const card = await huly.findOne(CARD_CLASS, { _id: cardId })
      if (!card) {
        return {
          content: [{ type: 'text', text: `Card ${cardId} not found` }],
          isError: true
        }
      }
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(card, null, 2)
        }]
      }
    }

    if (name === 'create_card') {
      const { cardSpaceId, title, content, type } = args as {
        cardSpaceId: string
        title: string
        content?: string
        type?: string
      }

      const cardSpace = await huly.findOne(CARD_SPACE_CLASS, { _id: cardSpaceId })
      if (!cardSpace) {
        return {
          content: [{ type: 'text', text: `Card space ${cardSpaceId} not found` }],
          isError: true
        }
      }

      const cardId = generateId()
      const lastCard = await huly.findOne(
        CARD_CLASS,
        { space: cardSpaceId },
        { sort: { rank: -1 } }
      )

      const cardClass = (type as Ref<CardClass>) || CARD_CLASS

      // Upload content as markup blob if provided
      let contentRef
      if (content) {
        contentRef = await huly.uploadMarkup(
          cardClass,
          cardId,
          'content',
          content,
          'markdown'
        )
      }

      await huly.createDoc(
        cardClass,
        cardSpaceId,
        {
          title,
          content: contentRef || '',
          rank: makeRank(lastCard?.rank, undefined),
          parentInfo: [],
          blobs: {}
        },
        cardId
      )

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            cardId,
            message: `Created card ${title}`
          }, null, 2)
        }]
      }
    }

    if (name === 'update_card') {
      const { cardId, title, content } = args as {
        cardId: string
        title?: string
        content?: string
      }

      const card = await huly.findOne(CARD_CLASS, { _id: cardId })
      if (!card) {
        return {
          content: [{ type: 'text', text: `Card ${cardId} not found` }],
          isError: true
        }
      }

      const updates: any = {}
      if (title) updates.title = title

      if (content !== undefined) {
        // Handle content using markup system (same pattern as issues)
        if (card.content) {
          // Update existing content blob
          const { parseMessageMarkdown, jsonToMarkup } = await import('@hcengineering/text')
          const parsed = parseMessageMarkdown(content, '', '')
          const markup = jsonToMarkup(parsed)

          await huly.markup.collaborator.updateMarkup(
            {
              objectClass: card._class,
              objectId: cardId,
              objectAttr: 'content'
            },
            markup
          )
          // Don't update the ref - it stays the same
        } else {
          // No existing content - create new one
          updates.content = await huly.uploadMarkup(
            card._class,
            cardId,
            'content',
            content,
            'markdown'
          )
        }
      }

      if (Object.keys(updates).length > 0) {
        await huly.updateDoc(
          CARD_CLASS,
          card.space,
          cardId,
          updates
        )
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            cardId,
            message: `Updated card ${card.title}`
          }, null, 2)
        }]
      }
    }

    if (name === 'delete_card') {
      const { cardId } = args as { cardId: string }

      const card = await huly.findOne(CARD_CLASS, { _id: cardId })
      if (!card) {
        return {
          content: [{ type: 'text', text: `Card ${cardId} not found` }],
          isError: true
        }
      }

      await huly.removeDoc(
        CARD_CLASS,
        card.space,
        cardId
      )

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            cardId,
            message: `Deleted card ${card.title}`
          }, null, 2)
        }]
      }
    }

    if (name === 'list_attachments') {
      const { attachedTo, attachedToClass } = args as {
        attachedTo: string
        attachedToClass: string
      }

      const attachments = await huly.findAll(ATTACHMENT_CLASS, {
        attachedTo,
        attachedToClass
      })

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(attachments.map((a: any) => ({
            id: a._id,
            name: a.name,
            file: a.file,
            size: a.size,
            type: a.type,
            lastModified: a.lastModified,
            metadata: a.metadata
          })), null, 2)
        }]
      }
    }

    if (name === 'delete_attachment') {
      const { attachmentId } = args as { attachmentId: string }

      const attachment = await huly.findOne(ATTACHMENT_CLASS, { _id: attachmentId })
      if (!attachment) {
        return {
          content: [{ type: 'text', text: `Attachment ${attachmentId} not found` }],
          isError: true
        }
      }

      await huly.removeDoc(
        ATTACHMENT_CLASS,
        attachment.space,
        attachmentId
      )

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            attachmentId,
            message: `Deleted attachment ${attachment.name}`
          }, null, 2)
        }]
      }
    }

    if (name === 'list_teamspaces') {
      const teamspaces = await huly.findAll(TEAMSPACE_CLASS, {})
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(teamspaces.map((ts: any) => ({
            id: ts._id,
            name: ts.name,
            description: ts.description,
            private: ts.private,
            members: ts.members,
            archived: ts.archived
          })), null, 2)
        }]
      }
    }

    if (name === 'list_documents') {
      const query: any = {}
      if (args && typeof args === 'object') {
        const { teamspaceId } = args as { teamspaceId?: string }
        if (teamspaceId) query.space = teamspaceId
      }
      const documents = await huly.findAll(DOCUMENT_CLASS, query)
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(documents.map((d: any) => ({
            id: d._id,
            title: d.title,
            teamspace: d.space,
            createdOn: d.createdOn,
            modifiedOn: d.modifiedOn,
            createdBy: d.createdBy,
            modifiedBy: d.modifiedBy
          })), null, 2)
        }]
      }
    }

    if (name === 'get_document') {
      const { documentId } = args as { documentId: string }
      const document = await huly.findOne(DOCUMENT_CLASS, { _id: documentId })
      if (!document) {
        return {
          content: [{ type: 'text', text: `Document ${documentId} not found` }],
          isError: true
        }
      }

      // Fetch actual content if it exists
      if (document.content && huly.markup && huly.markup.fetchMarkup) {
        try {
          const contentMarkdown = await huly.markup.fetchMarkup(
            DOCUMENT_CLASS,
            documentId,
            'content',
            document.content,
            'markdown'
          )
          document.contentMarkdown = contentMarkdown
        } catch (e) {
          document.contentMarkdown = `[Error fetching content: ${e}]`
        }
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(document, null, 2)
        }]
      }
    }

    if (name === 'create_document') {
      const { teamspaceId, title, content } = args as {
        teamspaceId: string
        title: string
        content?: string
      }

      const teamspace = await huly.findOne(TEAMSPACE_CLASS, { _id: teamspaceId })
      if (!teamspace) {
        return {
          content: [{ type: 'text', text: `Teamspace ${teamspaceId} not found` }],
          isError: true
        }
      }

      const documentId = generateId()
      const lastDoc = await huly.findOne(
        DOCUMENT_CLASS,
        { space: teamspaceId },
        { sort: { rank: -1 } }
      )

      // Upload content as markup blob if provided
      let contentRef
      if (content) {
        contentRef = await huly.uploadMarkup(
          DOCUMENT_CLASS,
          documentId,
          'content',
          content,
          'markdown'
        )
      }

      await huly.createDoc(
        DOCUMENT_CLASS,
        teamspaceId,
        {
          title,
          content: contentRef || '',
          attachments: 0,
          embeddings: 0,
          labels: 0,
          comments: 0,
          references: 0,
          rank: makeRank(lastDoc?.rank, undefined),
          parent: 'document:ids:NoParent'
        },
        documentId
      )

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            documentId,
            teamspaceId,
            message: `Created document ${title}`
          }, null, 2)
        }]
      }
    }

    if (name === 'update_document') {
      const { documentId, title, content } = args as {
        documentId: string
        title?: string
        content?: string
      }

      const document = await huly.findOne(DOCUMENT_CLASS, { _id: documentId })
      if (!document) {
        return {
          content: [{ type: 'text', text: `Document ${documentId} not found` }],
          isError: true
        }
      }

      const updates: any = {}
      if (title) updates.title = title

      if (content !== undefined) {
        // Handle content using markup system (same pattern as issues and cards)
        if (document.content) {
          // Update existing content blob
          const { parseMessageMarkdown, jsonToMarkup } = await import('@hcengineering/text')
          const parsed = parseMessageMarkdown(content, '', '')
          const markup = jsonToMarkup(parsed)

          await huly.markup.collaborator.updateMarkup(
            {
              objectClass: DOCUMENT_CLASS,
              objectId: documentId,
              objectAttr: 'content'
            },
            markup
          )
          // Don't update the ref - it stays the same
        } else {
          // No existing content - create new one
          updates.content = await huly.uploadMarkup(
            DOCUMENT_CLASS,
            documentId,
            'content',
            content,
            'markdown'
          )
        }
      }

      if (Object.keys(updates).length > 0) {
        await huly.updateDoc(
          DOCUMENT_CLASS,
          document.space,
          documentId,
          updates
        )
      }

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            documentId,
            message: `Updated document ${document.title}`
          }, null, 2)
        }]
      }
    }

    if (name === 'delete_document') {
      const { documentId } = args as { documentId: string }

      const document = await huly.findOne(DOCUMENT_CLASS, { _id: documentId })
      if (!document) {
        return {
          content: [{ type: 'text', text: `Document ${documentId} not found` }],
          isError: true
        }
      }

      await huly.removeDoc(
        DOCUMENT_CLASS,
        document.space,
        documentId
      )

      return {
        content: [{
          type: 'text',
          text: JSON.stringify({
            success: true,
            documentId,
            message: `Deleted document ${document.title}`
          }, null, 2)
        }]
      }
    }

    return {
      content: [{ type: 'text', text: `Unknown tool: ${name}` }],
      isError: true
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error}` }],
      isError: true
    }
  }
})

const transport = new StdioServerTransport()
server.connect(transport)
