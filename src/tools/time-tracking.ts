import { z } from 'zod'
import { Ref, Class, Doc, generateId } from '@hcengineering/core'
import { NotFoundError } from '../errors'
import type { ToolDefinition, ToolHandler } from '../types'

const TIME_SPEND_REPORT_CLASS = 'tracker:class:TimeSpendReport' as Ref<Class<Doc>>
const WORK_SLOT_CLASS = 'time:class:WorkSlot' as Ref<Class<Doc>>
const ISSUE_CLASS = 'tracker:class:Issue' as Ref<Class<Doc>>

export const definitions: ToolDefinition[] = [
  {
    name: 'log_time',
    description: 'Log time spent on an issue',
    inputSchema: {
      type: 'object',
      properties: {
        issueId: { type: 'string', description: 'Issue ID to log time against' },
        value: { type: 'number', description: 'Time spent in minutes' },
        description: { type: 'string', description: 'Description of work done (optional)' },
        employee: { type: 'string', description: 'Employee ID (optional)' },
        date: { type: 'number', description: 'Date timestamp (optional, defaults to now)' },
      },
      required: ['issueId', 'value'],
    },
  },
  {
    name: 'get_time_report',
    description: 'Get a specific time spend report by ID',
    inputSchema: {
      type: 'object',
      properties: {
        reportId: { type: 'string', description: 'Time report ID' },
      },
      required: ['reportId'],
    },
  },
  {
    name: 'list_time_spend_reports',
    description: 'List time spend reports with optional filters',
    inputSchema: {
      type: 'object',
      properties: {
        issueId: { type: 'string', description: 'Filter by issue ID (optional)' },
        employee: { type: 'string', description: 'Filter by employee (optional)' },
      },
    },
  },
  {
    name: 'get_detailed_time_report',
    description: 'Get aggregated time report for a project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: { type: 'string', description: 'Project ID' },
        startDate: { type: 'number', description: 'Start date timestamp (optional)' },
        endDate: { type: 'number', description: 'End date timestamp (optional)' },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'list_work_slots',
    description: 'List work slots with optional filters',
    inputSchema: {
      type: 'object',
      properties: {
        employee: { type: 'string', description: 'Filter by employee (optional)' },
        startDate: { type: 'number', description: 'Start date timestamp (optional)' },
        endDate: { type: 'number', description: 'End date timestamp (optional)' },
      },
    },
  },
  {
    name: 'create_work_slot',
    description: 'Create a new work slot',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Work slot title' },
        date: { type: 'number', description: 'Start date timestamp' },
        dueDate: { type: 'number', description: 'End date timestamp' },
        employee: { type: 'string', description: 'Employee ID (optional)' },
      },
      required: ['title', 'date', 'dueDate'],
    },
  },
  {
    name: 'start_timer',
    description: 'Start a timer for an issue',
    inputSchema: {
      type: 'object',
      properties: {
        issueId: { type: 'string', description: 'Issue ID to start timer for' },
      },
      required: ['issueId'],
    },
  },
  {
    name: 'stop_timer',
    description: 'Stop a timer and calculate elapsed time',
    inputSchema: {
      type: 'object',
      properties: {
        issueId: { type: 'string', description: 'Issue ID to stop timer for' },
        startedAt: { type: 'number', description: 'Timer start timestamp' },
      },
      required: ['issueId', 'startedAt'],
    },
  },
]

const logTime: ToolHandler = async (client, args) => {
  const input = z.object({
    issueId: z.string(),
    value: z.number().positive(),
    description: z.string().optional(),
    employee: z.string().optional(),
    date: z.number().optional(),
  }).parse(args)

  const issue = await client.findOne(ISSUE_CLASS, { _id: input.issueId })
  if (!issue) throw new NotFoundError('Issue', input.issueId)

  const reportId = generateId()
  await client.addCollection(TIME_SPEND_REPORT_CLASS, issue.space, input.issueId, ISSUE_CLASS, 'reports', {
    employee: input.employee || null,
    date: input.date || Date.now(),
    value: input.value,
    description: input.description || '',
  }, reportId)

  return { success: true, reportId, message: `Logged ${input.value} minutes` }
}

const getTimeReport: ToolHandler = async (client, args) => {
  const { reportId } = z.object({ reportId: z.string() }).parse(args)
  const report = await client.findOne(TIME_SPEND_REPORT_CLASS, { _id: reportId })
  if (!report) throw new NotFoundError('Time report', reportId)
  return report
}

const listTimeSpendReports: ToolHandler = async (client, args) => {
  const input = z.object({
    issueId: z.string().optional(),
    employee: z.string().optional(),
  }).parse(args)

  const query: any = {}
  if (input.issueId) query.attachedTo = input.issueId
  if (input.employee) query.employee = input.employee

  const reports = await client.findAll(TIME_SPEND_REPORT_CLASS, query)
  return reports.map((r: any) => ({
    id: r._id,
    employee: r.employee,
    date: r.date,
    value: r.value,
    description: r.description,
  }))
}

const getDetailedTimeReport: ToolHandler = async (client, args) => {
  const input = z.object({
    projectId: z.string(),
    startDate: z.number().optional(),
    endDate: z.number().optional(),
  }).parse(args)

  const query: any = { space: input.projectId }
  if (input.startDate || input.endDate) {
    query.date = {}
    if (input.startDate) query.date.$gte = input.startDate
    if (input.endDate) query.date.$lte = input.endDate
  }

  const reports = await client.findAll(TIME_SPEND_REPORT_CLASS, query)

  const grouped: Record<string, Record<string, number>> = {}
  for (const r of reports as any[]) {
    const issueKey = r.attachedTo || 'unknown'
    const empKey = r.employee || 'unassigned'
    if (!grouped[issueKey]) grouped[issueKey] = {}
    grouped[issueKey][empKey] = (grouped[issueKey][empKey] || 0) + (r.value || 0)
  }

  return {
    projectId: input.projectId,
    startDate: input.startDate,
    endDate: input.endDate,
    totalReports: reports.length,
    byIssue: grouped,
  }
}

const listWorkSlots: ToolHandler = async (client, args) => {
  const input = z.object({
    employee: z.string().optional(),
    startDate: z.number().optional(),
    endDate: z.number().optional(),
  }).parse(args)

  const query: any = {}
  if (input.employee) query.employee = input.employee
  if (input.startDate || input.endDate) {
    query.date = {}
    if (input.startDate) query.date.$gte = input.startDate
    if (input.endDate) query.date.$lte = input.endDate
  }

  const slots = await client.findAll(WORK_SLOT_CLASS, query)
  return slots.map((s: any) => ({
    id: s._id,
    title: s.title,
    date: s.date,
    dueDate: s.dueDate,
    employee: s.employee,
  }))
}

const createWorkSlot: ToolHandler = async (client, args) => {
  const input = z.object({
    title: z.string().min(1),
    date: z.number(),
    dueDate: z.number(),
    employee: z.string().optional(),
  }).parse(args)

  const slotId = generateId()
  await client.createDoc(WORK_SLOT_CLASS, '' as any, {
    title: input.title,
    date: input.date,
    dueDate: input.dueDate,
    employee: input.employee || null,
  }, slotId)

  return { success: true, slotId, message: `Created work slot ${input.title}` }
}

const startTimer: ToolHandler = async (client, args) => {
  const { issueId } = z.object({ issueId: z.string() }).parse(args)

  const issue = await client.findOne(ISSUE_CLASS, { _id: issueId })
  if (!issue) throw new NotFoundError('Issue', issueId)

  return { success: true, issueId, startedAt: Date.now(), message: 'Timer started' }
}

const stopTimer: ToolHandler = async (_client, args) => {
  const input = z.object({
    issueId: z.string(),
    startedAt: z.number(),
  }).parse(args)

  const elapsed = Math.round((Date.now() - input.startedAt) / 60000)
  return { success: true, issueId: input.issueId, elapsed, message: 'Timer stopped, use log_time to record' }
}

export const handlers: Record<string, ToolHandler> = {
  log_time: logTime,
  get_time_report: getTimeReport,
  list_time_spend_reports: listTimeSpendReports,
  get_detailed_time_report: getDetailedTimeReport,
  list_work_slots: listWorkSlots,
  create_work_slot: createWorkSlot,
  start_timer: startTimer,
  stop_timer: stopTimer,
}
