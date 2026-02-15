import { describe, it, expect, beforeEach } from 'vitest'
import { handlers, definitions } from '../../tools/contacts'
import { createMockClient } from '../helpers'
import { NotFoundError } from '../../errors'

describe('contacts tool definitions', () => {
  it('exports 8 tool definitions', () => {
    expect(definitions).toHaveLength(8)
  })

  it('has all expected tool names', () => {
    const names = definitions.map((d) => d.name)
    expect(names).toContain('list_persons')
    expect(names).toContain('get_person')
    expect(names).toContain('create_person')
    expect(names).toContain('update_person')
    expect(names).toContain('delete_person')
    expect(names).toContain('list_employees')
    expect(names).toContain('list_organizations')
    expect(names).toContain('create_organization')
  })
})

describe('contacts handlers', () => {
  let client: ReturnType<typeof createMockClient>

  beforeEach(() => {
    client = createMockClient()
  })

  describe('list_persons', () => {
    it('returns mapped person data', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'p1', name: 'Alice', city: 'NYC', createdOn: 1700000000 },
      ])
      const result: any = await handlers.list_persons(client, {})
      expect(result).toEqual([{
        id: 'p1', name: 'Alice', city: 'NYC', createdOn: 1700000000,
      }])
    })

    it('filters by name when provided', async () => {
      await handlers.list_persons(client, { name: 'Alice' })
      expect(client.findAll).toHaveBeenCalledWith(
        expect.anything(), expect.objectContaining({ name: 'Alice' })
      )
    })

    it('returns empty array when no persons', async () => {
      const result = await handlers.list_persons(client, {})
      expect(result).toEqual([])
    })
  })

  describe('get_person', () => {
    it('returns person when found', async () => {
      const person = { _id: 'p1', name: 'Alice' }
      client.findOne.mockResolvedValue(person)
      const result = await handlers.get_person(client, { personId: 'p1' })
      expect(result).toEqual(person)
    })

    it('throws NotFoundError when person missing', async () => {
      await expect(handlers.get_person(client, { personId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })

    it('throws on missing personId', async () => {
      await expect(handlers.get_person(client, {})).rejects.toThrow()
    })
  })

  describe('create_person', () => {
    it('creates person with required fields', async () => {
      const result: any = await handlers.create_person(client, { name: 'Alice' })
      expect(result.success).toBe(true)
      expect(result.personId).toBeDefined()
      expect(client.createDoc).toHaveBeenCalled()
    })

    it('creates person with city', async () => {
      const result: any = await handlers.create_person(client, { name: 'Alice', city: 'NYC' })
      expect(result.success).toBe(true)
      expect(client.createDoc).toHaveBeenCalledWith(
        expect.anything(), expect.anything(),
        expect.objectContaining({ name: 'Alice', city: 'NYC' }),
        expect.anything()
      )
    })

    it('throws on missing name', async () => {
      await expect(handlers.create_person(client, {})).rejects.toThrow()
    })

    it('throws on empty name', async () => {
      await expect(handlers.create_person(client, { name: '' })).rejects.toThrow()
    })
  })

  describe('update_person', () => {
    it('updates person name', async () => {
      const person = { _id: 'p1', name: 'Alice', space: 's1' }
      client.findOne.mockResolvedValue(person)

      const result: any = await handlers.update_person(client, { personId: 'p1', name: 'Bob' })
      expect(result.success).toBe(true)
      expect(client.updateDoc).toHaveBeenCalledWith(
        expect.anything(), 's1', 'p1', expect.objectContaining({ name: 'Bob' })
      )
    })

    it('throws NotFoundError for missing person', async () => {
      await expect(handlers.update_person(client, { personId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })

    it('throws on missing personId', async () => {
      await expect(handlers.update_person(client, {})).rejects.toThrow()
    })
  })

  describe('delete_person', () => {
    it('deletes person', async () => {
      const person = { _id: 'p1', name: 'Alice', space: 's1' }
      client.findOne.mockResolvedValue(person)

      const result: any = await handlers.delete_person(client, { personId: 'p1' })
      expect(result.success).toBe(true)
      expect(client.removeDoc).toHaveBeenCalled()
    })

    it('throws NotFoundError for missing person', async () => {
      await expect(handlers.delete_person(client, { personId: 'missing' }))
        .rejects.toThrow(NotFoundError)
    })
  })

  describe('list_employees', () => {
    it('returns mapped employee data', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'e1', name: 'Alice', department: 'Engineering', active: true },
      ])
      const result: any = await handlers.list_employees(client, {})
      expect(result).toEqual([{
        id: 'e1', name: 'Alice', department: 'Engineering', active: true,
      }])
    })

    it('queries with active filter', async () => {
      await handlers.list_employees(client, {})
      expect(client.findAll).toHaveBeenCalledWith(
        expect.anything(), expect.objectContaining({ active: true })
      )
    })
  })

  describe('list_organizations', () => {
    it('returns mapped organization data', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'o1', name: 'Acme', city: 'SF', members: ['u1'] },
      ])
      const result: any = await handlers.list_organizations(client, {})
      expect(result).toEqual([{
        id: 'o1', name: 'Acme', city: 'SF', members: ['u1'],
      }])
    })
  })

  describe('create_organization', () => {
    it('creates organization with required fields', async () => {
      const result: any = await handlers.create_organization(client, { name: 'Acme' })
      expect(result.success).toBe(true)
      expect(result.orgId).toBeDefined()
      expect(client.createDoc).toHaveBeenCalled()
    })

    it('creates organization with city', async () => {
      await handlers.create_organization(client, { name: 'Acme', city: 'SF' })
      expect(client.createDoc).toHaveBeenCalledWith(
        expect.anything(), expect.anything(),
        expect.objectContaining({ name: 'Acme', city: 'SF' }),
        expect.anything()
      )
    })

    it('throws on missing name', async () => {
      await expect(handlers.create_organization(client, {})).rejects.toThrow()
    })
  })
})
