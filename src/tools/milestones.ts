import { z } from 'zod'
import { generateId } from '@hcengineering/core'
import tracker from '@hcengineering/tracker'
import { NotFoundError } from '../errors'
import type { ToolDefinition, ToolHandler } from '../types'

const milestoneStatusMap: Record<string, number> = {
  Planned: 0,
  InProgress: 1,
  Completed: 2,
  Canceled: 3,
}

export const definitions: ToolDefinition[] = [
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
  {
    name: 'get_milestone',
    description: 'Get full details of a specific milestone by ID',
    inputSchema: {
      type: 'object',
      properties: {
        milestoneId: { type: 'string', description: 'Milestone ID to retrieve' },
      },
      required: ['milestoneId'],
    },
  },
  {
    name: 'create_milestone',
    description: 'Create a new milestone in a project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID where milestone will be created' },
        label: { type: 'string', description: 'Milestone label' },
        description: { type: 'string', description: 'Milestone description (optional)' },
        targetDate: { type: 'string', description: 'Target date ISO string (optional)' },
        status: {
          type: 'string',
          description: 'Status: Planned, InProgress, Completed, Canceled',
          enum: ['Planned', 'InProgress', 'Completed', 'Canceled'],
        },
      },
      required: ['projectId', 'label'],
    },
  },
  {
    name: 'update_milestone',
    description: 'Update an existing milestone',
    inputSchema: {
      type: 'object',
      properties: {
        milestoneId: { type: 'string', description: 'Milestone ID to update' },
        label: { type: 'string', description: 'New label (optional)' },
        description: { type: 'string', description: 'New description (optional)' },
        targetDate: { type: 'string', description: 'New target date ISO string (optional)' },
        status: {
          type: 'string',
          description: 'New status: Planned, InProgress, Completed, Canceled',
          enum: ['Planned', 'InProgress', 'Completed', 'Canceled'],
        },
      },
      required: ['milestoneId'],
    },
  },
  {
    name: 'delete_milestone',
    description: 'Delete a milestone',
    inputSchema: {
      type: 'object',
      properties: {
        milestoneId: { type: 'string', description: 'Milestone ID to delete' },
      },
      required: ['milestoneId'],
    },
  },
]

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

const getMilestone: ToolHandler = async (client, args) => {
  const { milestoneId } = z.object({ milestoneId: z.string() }).parse(args)
  const milestone = await client.findOne(tracker.class.Milestone, { _id: milestoneId })
  if (!milestone) throw new NotFoundError('Milestone', milestoneId)
  return milestone
}

const createMilestone: ToolHandler = async (client, args) => {
  const input = z.object({
    projectId: z.string(),
    label: z.string().min(1),
    description: z.string().optional(),
    targetDate: z.string().optional(),
    status: z.enum(['Planned', 'InProgress', 'Completed', 'Canceled']).optional(),
  }).parse(args)

  const milestoneId = generateId()
  await client.createDoc(tracker.class.Milestone, input.projectId, {
    label: input.label,
    description: input.description || '',
    targetDate: input.targetDate || null,
    status: milestoneStatusMap[input.status || 'Planned'],
  }, milestoneId)

  return { success: true, milestoneId, message: `Created milestone ${input.label}` }
}

const updateMilestone: ToolHandler = async (client, args) => {
  const input = z.object({
    milestoneId: z.string(),
    label: z.string().optional(),
    description: z.string().optional(),
    targetDate: z.string().optional(),
    status: z.enum(['Planned', 'InProgress', 'Completed', 'Canceled']).optional(),
  }).parse(args)

  const milestone = await client.findOne(tracker.class.Milestone, { _id: input.milestoneId })
  if (!milestone) throw new NotFoundError('Milestone', input.milestoneId)

  const updates: any = {}
  if (input.label) updates.label = input.label
  if (input.description !== undefined) updates.description = input.description
  if (input.targetDate !== undefined) updates.targetDate = input.targetDate
  if (input.status) updates.status = milestoneStatusMap[input.status]

  if (Object.keys(updates).length > 0) {
    await client.updateDoc(tracker.class.Milestone, milestone.space, input.milestoneId, updates)
  }

  return { success: true, milestoneId: input.milestoneId, message: `Updated milestone ${milestone.label}` }
}

const deleteMilestone: ToolHandler = async (client, args) => {
  const { milestoneId } = z.object({ milestoneId: z.string() }).parse(args)
  const milestone = await client.findOne(tracker.class.Milestone, { _id: milestoneId })
  if (!milestone) throw new NotFoundError('Milestone', milestoneId)

  await client.removeDoc(tracker.class.Milestone, milestone.space, milestoneId)
  return { success: true, milestoneId, message: `Deleted milestone ${milestone.label}` }
}

export const handlers: Record<string, ToolHandler> = {
  list_milestones: listMilestones,
  get_milestone: getMilestone,
  create_milestone: createMilestone,
  update_milestone: updateMilestone,
  delete_milestone: deleteMilestone,
}
