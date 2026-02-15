import { z } from 'zod'
import tracker from '@hcengineering/tracker'
import type { ToolDefinition, ToolHandler } from '../types'

export const definitions: ToolDefinition[] = [
  {
    name: 'list_statuses',
    description: 'List all available issue statuses for a project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'list_components',
    description: 'List all components in a project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'list_milestones',
    description: 'List all milestones in a project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
      },
      required: ['projectId'],
    },
  },
]

const listStatuses: ToolHandler = async (client, args) => {
  const { projectId } = z.object({ projectId: z.string() }).parse(args)
  const statuses = await client.findAll(tracker.class.IssueStatus, { space: projectId })
  return statuses.map((s: any) => ({
    id: s._id,
    name: s.name,
    category: s.category,
  }))
}

const listComponents: ToolHandler = async (client, args) => {
  const { projectId } = z.object({ projectId: z.string() }).parse(args)
  const components = await client.findAll(tracker.class.Component, { space: projectId })
  return components.map((c: any) => ({
    id: c._id,
    label: c.label,
    description: c.description,
  }))
}

const listMilestones: ToolHandler = async (client, args) => {
  const { projectId } = z.object({ projectId: z.string() }).parse(args)
  const milestones = await client.findAll(tracker.class.Milestone, { space: projectId })
  return milestones.map((m: any) => ({
    id: m._id,
    label: m.label,
    description: m.description,
    targetDate: m.targetDate,
    status: m.status,
  }))
}

export const handlers: Record<string, ToolHandler> = {
  list_statuses: listStatuses,
  list_components: listComponents,
  list_milestones: listMilestones,
}
