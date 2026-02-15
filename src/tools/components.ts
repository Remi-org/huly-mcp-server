import { z } from 'zod'
import { generateId } from '@hcengineering/core'
import tracker from '@hcengineering/tracker'
import { NotFoundError } from '../errors'
import type { ToolDefinition, ToolHandler } from '../types'

export const definitions: ToolDefinition[] = [
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
    name: 'get_component',
    description: 'Get full details of a specific component by ID',
    inputSchema: {
      type: 'object',
      properties: {
        componentId: { type: 'string', description: 'Component ID to retrieve' },
      },
      required: ['componentId'],
    },
  },
  {
    name: 'create_component',
    description: 'Create a new component in a project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID where component will be created' },
        label: { type: 'string', description: 'Component label' },
        description: { type: 'string', description: 'Component description (optional)' },
        lead: { type: 'string', description: 'Lead user ID (optional)' },
      },
      required: ['projectId', 'label'],
    },
  },
  {
    name: 'update_component',
    description: 'Update an existing component',
    inputSchema: {
      type: 'object',
      properties: {
        componentId: { type: 'string', description: 'Component ID to update' },
        label: { type: 'string', description: 'New label (optional)' },
        description: { type: 'string', description: 'New description (optional)' },
        lead: { type: 'string', description: 'New lead user ID (optional)' },
      },
      required: ['componentId'],
    },
  },
  {
    name: 'delete_component',
    description: 'Delete a component',
    inputSchema: {
      type: 'object',
      properties: {
        componentId: { type: 'string', description: 'Component ID to delete' },
      },
      required: ['componentId'],
    },
  },
]

const listComponents: ToolHandler = async (client, args) => {
  const { projectId } = z.object({ projectId: z.string() }).parse(args)
  const components = await client.findAll(tracker.class.Component, { space: projectId })
  return components.map((c: any) => ({
    id: c._id,
    label: c.label,
    description: c.description,
  }))
}

const getComponent: ToolHandler = async (client, args) => {
  const { componentId } = z.object({ componentId: z.string() }).parse(args)
  const component = await client.findOne(tracker.class.Component, { _id: componentId })
  if (!component) throw new NotFoundError('Component', componentId)
  return component
}

const createComponent: ToolHandler = async (client, args) => {
  const input = z.object({
    projectId: z.string(),
    label: z.string().min(1),
    description: z.string().optional(),
    lead: z.string().optional(),
  }).parse(args)

  const componentId = generateId()
  await client.createDoc(tracker.class.Component, input.projectId, {
    label: input.label,
    description: input.description || '',
    lead: input.lead || null,
  }, componentId)

  return { success: true, componentId, message: `Created component ${input.label}` }
}

const updateComponent: ToolHandler = async (client, args) => {
  const input = z.object({
    componentId: z.string(),
    label: z.string().optional(),
    description: z.string().optional(),
    lead: z.string().optional(),
  }).parse(args)

  const component = await client.findOne(tracker.class.Component, { _id: input.componentId })
  if (!component) throw new NotFoundError('Component', input.componentId)

  const updates: any = {}
  if (input.label) updates.label = input.label
  if (input.description !== undefined) updates.description = input.description
  if (input.lead !== undefined) updates.lead = input.lead || null

  if (Object.keys(updates).length > 0) {
    await client.updateDoc(tracker.class.Component, component.space, input.componentId, updates)
  }

  return { success: true, componentId: input.componentId, message: `Updated component ${component.label}` }
}

const deleteComponent: ToolHandler = async (client, args) => {
  const { componentId } = z.object({ componentId: z.string() }).parse(args)
  const component = await client.findOne(tracker.class.Component, { _id: componentId })
  if (!component) throw new NotFoundError('Component', componentId)

  await client.removeDoc(tracker.class.Component, component.space, componentId)
  return { success: true, componentId, message: `Deleted component ${component.label}` }
}

export const handlers: Record<string, ToolHandler> = {
  list_components: listComponents,
  get_component: getComponent,
  create_component: createComponent,
  update_component: updateComponent,
  delete_component: deleteComponent,
}
