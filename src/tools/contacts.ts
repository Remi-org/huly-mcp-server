import { z } from 'zod'
import { Ref, Class, Doc, generateId } from '@hcengineering/core'
import { NotFoundError } from '../errors'
import type { ToolDefinition, ToolHandler } from '../types'

const PERSON_CLASS = 'contact:class:Person' as Ref<Class<Doc>>
const EMPLOYEE_MIXIN = 'contact:mixin:Employee' as Ref<Class<Doc>>
const ORGANIZATION_CLASS = 'contact:class:Organization' as Ref<Class<Doc>>
const CONTACTS_SPACE = 'contact:space:Contacts' as any

export const definitions: ToolDefinition[] = [
  {
    name: 'list_persons',
    description: 'List all persons in the workspace',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Filter by name (optional)' },
      },
    },
  },
  {
    name: 'get_person',
    description: 'Get full details of a specific person by ID',
    inputSchema: {
      type: 'object',
      properties: {
        personId: { type: 'string', description: 'Person ID to retrieve' },
      },
      required: ['personId'],
    },
  },
  {
    name: 'create_person',
    description: 'Create a new person contact',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Person name' },
        city: { type: 'string', description: 'City (optional)' },
      },
      required: ['name'],
    },
  },
  {
    name: 'update_person',
    description: 'Update an existing person',
    inputSchema: {
      type: 'object',
      properties: {
        personId: { type: 'string', description: 'Person ID to update' },
        name: { type: 'string', description: 'New name (optional)' },
        city: { type: 'string', description: 'New city (optional)' },
      },
      required: ['personId'],
    },
  },
  {
    name: 'delete_person',
    description: 'Delete a person contact',
    inputSchema: {
      type: 'object',
      properties: {
        personId: { type: 'string', description: 'Person ID to delete' },
      },
      required: ['personId'],
    },
  },
  {
    name: 'list_employees',
    description: 'List all active employees in the workspace',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'list_organizations',
    description: 'List all organizations in the workspace',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'create_organization',
    description: 'Create a new organization',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Organization name' },
        city: { type: 'string', description: 'City (optional)' },
      },
      required: ['name'],
    },
  },
]

const listPersons: ToolHandler = async (client, args) => {
  const input = z.object({ name: z.string().optional() }).parse(args)
  const query: any = {}
  if (input.name) query.name = input.name

  const persons = await client.findAll(PERSON_CLASS, query)
  return persons.map((p: any) => ({
    id: p._id,
    name: p.name,
    city: p.city,
    createdOn: p.createdOn,
  }))
}

const getPerson: ToolHandler = async (client, args) => {
  const { personId } = z.object({ personId: z.string() }).parse(args)
  const person = await client.findOne(PERSON_CLASS, { _id: personId })
  if (!person) throw new NotFoundError('Person', personId)
  return person
}

const createPerson: ToolHandler = async (client, args) => {
  const input = z.object({
    name: z.string().min(1),
    city: z.string().optional(),
  }).parse(args)

  const personId = generateId()
  await client.createDoc(PERSON_CLASS, CONTACTS_SPACE, {
    name: input.name,
    city: input.city || null,
  }, personId)

  return { success: true, personId, message: `Created person ${input.name}` }
}

const updatePerson: ToolHandler = async (client, args) => {
  const input = z.object({
    personId: z.string(),
    name: z.string().optional(),
    city: z.string().optional(),
  }).parse(args)

  const person = await client.findOne(PERSON_CLASS, { _id: input.personId })
  if (!person) throw new NotFoundError('Person', input.personId)

  const updates: any = {}
  if (input.name) updates.name = input.name
  if (input.city !== undefined) updates.city = input.city

  if (Object.keys(updates).length > 0) {
    await client.updateDoc(PERSON_CLASS, person.space, input.personId, updates)
  }

  return { success: true, personId: input.personId, message: `Updated person ${person.name}` }
}

const deletePerson: ToolHandler = async (client, args) => {
  const { personId } = z.object({ personId: z.string() }).parse(args)
  const person = await client.findOne(PERSON_CLASS, { _id: personId })
  if (!person) throw new NotFoundError('Person', personId)

  await client.removeDoc(PERSON_CLASS, person.space, personId)
  return { success: true, personId, message: `Deleted person ${person.name}` }
}

const listEmployees: ToolHandler = async (client) => {
  const employees = await client.findAll(EMPLOYEE_MIXIN, { active: true })
  return employees.map((e: any) => ({
    id: e._id,
    name: e.name,
    department: e.department,
    active: e.active,
  }))
}

const listOrganizations: ToolHandler = async (client) => {
  const orgs = await client.findAll(ORGANIZATION_CLASS, {})
  return orgs.map((o: any) => ({
    id: o._id,
    name: o.name,
    city: o.city,
    members: o.members,
  }))
}

const createOrganization: ToolHandler = async (client, args) => {
  const input = z.object({
    name: z.string().min(1),
    city: z.string().optional(),
  }).parse(args)

  const orgId = generateId()
  await client.createDoc(ORGANIZATION_CLASS, CONTACTS_SPACE, {
    name: input.name,
    city: input.city || null,
  }, orgId)

  return { success: true, orgId, message: `Created organization ${input.name}` }
}

export const handlers: Record<string, ToolHandler> = {
  list_persons: listPersons,
  get_person: getPerson,
  create_person: createPerson,
  update_person: updatePerson,
  delete_person: deletePerson,
  list_employees: listEmployees,
  list_organizations: listOrganizations,
  create_organization: createOrganization,
}
