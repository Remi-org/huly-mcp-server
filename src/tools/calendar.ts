import { z } from 'zod'
import { Ref, Class, Doc, generateId } from '@hcengineering/core'
import { NotFoundError } from '../errors'
import type { ToolDefinition, ToolHandler } from '../types'

const EVENT_CLASS = 'calendar:class:Event' as Ref<Class<Doc>>
const RECURRING_EVENT_CLASS = 'calendar:class:ReccuringEvent' as Ref<Class<Doc>>
const RECURRING_INSTANCE_CLASS = 'calendar:class:ReccuringInstance' as Ref<Class<Doc>>
const CALENDAR_SPACE = 'calendar:space:Calendar' as any

export const definitions: ToolDefinition[] = [
  {
    name: 'list_events',
    description: 'List calendar events with optional date range filter',
    inputSchema: {
      type: 'object',
      properties: {
        startDate: { type: 'number', description: 'Start date timestamp (optional)' },
        endDate: { type: 'number', description: 'End date timestamp (optional)' },
        participant: { type: 'string', description: 'Filter by participant (optional)' },
      },
    },
  },
  {
    name: 'get_event',
    description: 'Get full details of a calendar event',
    inputSchema: {
      type: 'object',
      properties: {
        eventId: { type: 'string', description: 'Event ID to retrieve' },
      },
      required: ['eventId'],
    },
  },
  {
    name: 'create_event',
    description: 'Create a new calendar event',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Event title' },
        date: { type: 'number', description: 'Start date timestamp' },
        dueDate: { type: 'number', description: 'End date timestamp' },
        description: { type: 'string', description: 'Event description (optional)' },
        location: { type: 'string', description: 'Event location (optional)' },
        participants: { type: 'array', items: { type: 'string' }, description: 'Participant IDs (optional)' },
        allDay: { type: 'boolean', description: 'All day event (optional)' },
        visibility: { type: 'string', enum: ['public', 'private', 'freeBusy'], description: 'Event visibility (optional)' },
      },
      required: ['title', 'date', 'dueDate'],
    },
  },
  {
    name: 'update_event',
    description: 'Update an existing calendar event',
    inputSchema: {
      type: 'object',
      properties: {
        eventId: { type: 'string', description: 'Event ID to update' },
        title: { type: 'string', description: 'New title (optional)' },
        date: { type: 'number', description: 'New start date (optional)' },
        dueDate: { type: 'number', description: 'New end date (optional)' },
        description: { type: 'string', description: 'New description (optional)' },
        location: { type: 'string', description: 'New location (optional)' },
        participants: { type: 'array', items: { type: 'string' }, description: 'New participants (optional)' },
        allDay: { type: 'boolean', description: 'All day event (optional)' },
      },
      required: ['eventId'],
    },
  },
  {
    name: 'delete_event',
    description: 'Delete a calendar event',
    inputSchema: {
      type: 'object',
      properties: {
        eventId: { type: 'string', description: 'Event ID to delete' },
      },
      required: ['eventId'],
    },
  },
  {
    name: 'list_recurring_events',
    description: 'List all recurring calendar events',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'create_recurring_event',
    description: 'Create a new recurring calendar event',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Event title' },
        date: { type: 'number', description: 'Start date timestamp' },
        rules: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              freq: { type: 'string', description: 'Frequency (daily, weekly, monthly, yearly)' },
              interval: { type: 'number', description: 'Interval between recurrences' },
              count: { type: 'number', description: 'Number of occurrences (optional)' },
              endDate: { type: 'number', description: 'End date for recurrence (optional)' },
            },
          },
          description: 'Recurrence rules',
        },
      },
      required: ['title', 'date', 'rules'],
    },
  },
  {
    name: 'list_event_instances',
    description: 'List instances of a recurring event',
    inputSchema: {
      type: 'object',
      properties: {
        recurringEventId: { type: 'string', description: 'Recurring event ID' },
      },
      required: ['recurringEventId'],
    },
  },
]

const listEvents: ToolHandler = async (client, args) => {
  const input = z.object({
    startDate: z.number().optional(),
    endDate: z.number().optional(),
    participant: z.string().optional(),
  }).parse(args)

  const query: any = {}
  if (input.startDate || input.endDate) {
    query.date = {}
    if (input.startDate) query.date.$gte = input.startDate
    if (input.endDate) query.date.$lte = input.endDate
  }
  if (input.participant) query.participants = input.participant

  const events = await client.findAll(EVENT_CLASS, query)
  return events.map((e: any) => ({
    id: e._id,
    title: e.title,
    date: e.date,
    dueDate: e.dueDate,
    location: e.location,
    participants: e.participants,
    allDay: e.allDay,
  }))
}

const getEvent: ToolHandler = async (client, args) => {
  const { eventId } = z.object({ eventId: z.string() }).parse(args)
  const event = await client.findOne(EVENT_CLASS, { _id: eventId })
  if (!event) throw new NotFoundError('Event', eventId)
  return event
}

const createEvent: ToolHandler = async (client, args) => {
  const input = z.object({
    title: z.string().min(1),
    date: z.number(),
    dueDate: z.number(),
    description: z.string().optional(),
    location: z.string().optional(),
    participants: z.array(z.string()).optional(),
    allDay: z.boolean().optional(),
    visibility: z.enum(['public', 'private', 'freeBusy']).optional(),
  }).parse(args)

  const eventId = generateId()

  let descriptionRef
  if (input.description) {
    descriptionRef = await client.uploadMarkup(
      EVENT_CLASS, eventId, 'description', input.description, 'markdown'
    )
  }

  await client.createDoc(EVENT_CLASS, CALENDAR_SPACE, {
    title: input.title,
    date: input.date,
    dueDate: input.dueDate,
    description: descriptionRef || '',
    location: input.location || '',
    participants: input.participants || [],
    allDay: input.allDay || false,
    visibility: input.visibility || 'public',
  }, eventId)

  return { success: true, eventId, message: `Created event ${input.title}` }
}

const updateEvent: ToolHandler = async (client, args) => {
  const input = z.object({
    eventId: z.string(),
    title: z.string().optional(),
    date: z.number().optional(),
    dueDate: z.number().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    participants: z.array(z.string()).optional(),
    allDay: z.boolean().optional(),
  }).parse(args)

  const event = await client.findOne(EVENT_CLASS, { _id: input.eventId })
  if (!event) throw new NotFoundError('Event', input.eventId)

  const updates: any = {}
  if (input.title) updates.title = input.title
  if (input.date) updates.date = input.date
  if (input.dueDate) updates.dueDate = input.dueDate
  if (input.location !== undefined) updates.location = input.location
  if (input.participants) updates.participants = input.participants
  if (input.allDay !== undefined) updates.allDay = input.allDay

  if (input.description !== undefined) {
    if (event.description) {
      const { parseMessageMarkdown, jsonToMarkup } = await import('@hcengineering/text')
      const parsed = parseMessageMarkdown(input.description, '', '')
      const markup = jsonToMarkup(parsed)
      await client.markup.collaborator.updateMarkup(
        { objectClass: EVENT_CLASS, objectId: input.eventId, objectAttr: 'description' },
        markup
      )
    } else {
      updates.description = await client.uploadMarkup(
        EVENT_CLASS, input.eventId, 'description', input.description, 'markdown'
      )
    }
  }

  if (Object.keys(updates).length > 0) {
    await client.updateDoc(EVENT_CLASS, event.space, input.eventId, updates)
  }

  return { success: true, eventId: input.eventId, message: `Updated event ${event.title}` }
}

const deleteEvent: ToolHandler = async (client, args) => {
  const { eventId } = z.object({ eventId: z.string() }).parse(args)
  const event = await client.findOne(EVENT_CLASS, { _id: eventId })
  if (!event) throw new NotFoundError('Event', eventId)

  await client.removeDoc(EVENT_CLASS, event.space, eventId)
  return { success: true, eventId, message: `Deleted event ${event.title}` }
}

const listRecurringEvents: ToolHandler = async (client) => {
  const events = await client.findAll(RECURRING_EVENT_CLASS, {})
  return events.map((e: any) => ({
    id: e._id,
    title: e.title,
    date: e.date,
    rules: e.rules,
    exdate: e.exdate,
  }))
}

const createRecurringEvent: ToolHandler = async (client, args) => {
  const input = z.object({
    title: z.string().min(1),
    date: z.number(),
    rules: z.array(z.object({
      freq: z.string(),
      interval: z.number().optional(),
      count: z.number().optional(),
      endDate: z.number().optional(),
    })),
  }).parse(args)

  const eventId = generateId()
  await client.createDoc(RECURRING_EVENT_CLASS, CALENDAR_SPACE, {
    title: input.title,
    date: input.date,
    rules: input.rules,
    exdate: [],
  }, eventId)

  return { success: true, eventId, message: `Created recurring event ${input.title}` }
}

const listEventInstances: ToolHandler = async (client, args) => {
  const { recurringEventId } = z.object({ recurringEventId: z.string() }).parse(args)

  const instances = await client.findAll(RECURRING_INSTANCE_CLASS, { recurringEventId })
  return instances.map((i: any) => ({
    id: i._id,
    title: i.title,
    date: i.date,
    dueDate: i.dueDate,
    originalStartTime: i.originalStartTime,
  }))
}

export const handlers: Record<string, ToolHandler> = {
  list_events: listEvents,
  get_event: getEvent,
  create_event: createEvent,
  update_event: updateEvent,
  delete_event: deleteEvent,
  list_recurring_events: listRecurringEvents,
  create_recurring_event: createRecurringEvent,
  list_event_instances: listEventInstances,
}
