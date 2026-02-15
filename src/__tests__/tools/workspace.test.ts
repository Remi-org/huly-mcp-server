import { describe, it, expect, beforeEach, vi } from 'vitest'
import { handlers, definitions } from '../../tools/workspace'
import { createMockClient } from '../helpers'
import { NotFoundError } from '../../errors'

describe('workspace tool definitions', () => {
  it('exports 10 tool definitions', () => {
    expect(definitions).toHaveLength(10)
  })

  it('has all expected tool names', () => {
    const names = definitions.map((d) => d.name)
    expect(names).toContain('list_workspace_members')
    expect(names).toContain('update_member_role')
    expect(names).toContain('get_workspace_info')
    expect(names).toContain('list_workspaces')
    expect(names).toContain('create_workspace')
    expect(names).toContain('delete_workspace')
    expect(names).toContain('get_user_profile')
    expect(names).toContain('update_user_profile')
    expect(names).toContain('update_guest_settings')
    expect(names).toContain('get_regions')
  })
})

describe('workspace handlers', () => {
  let client: ReturnType<typeof createMockClient>

  beforeEach(() => {
    client = createMockClient()
  })

  describe('list_workspace_members', () => {
    it('returns mapped members', async () => {
      client.findAll.mockResolvedValue([
        { _id: 'a1', email: 'user@test.com', role: 'USER' },
      ])
      const result: any = await handlers.list_workspace_members(client, {})
      expect(result).toEqual([{ id: 'a1', email: 'user@test.com', role: 'USER' }])
    })
  })

  describe('update_member_role', () => {
    it('updates member role', async () => {
      client.findOne.mockResolvedValue({ _id: 'a1', space: 'sp1' })
      const result: any = await handlers.update_member_role(client, { accountId: 'a1', role: 'MAINTAINER' })
      expect(result.success).toBe(true)
      expect(client.updateDoc).toHaveBeenCalledWith(
        expect.anything(), 'sp1', 'a1', { role: 'MAINTAINER' }
      )
    })

    it('throws NotFoundError for missing account', async () => {
      await expect(handlers.update_member_role(client, { accountId: 'missing', role: 'USER' }))
        .rejects.toThrow(NotFoundError)
    })

    it('throws on invalid role', async () => {
      await expect(handlers.update_member_role(client, { accountId: 'a1', role: 'INVALID' }))
        .rejects.toThrow()
    })
  })

  describe('get_workspace_info', () => {
    it('returns workspace info when method available', async () => {
      const info = { name: 'My Workspace', id: 'ws1' }
      ;(client as any).getWorkspaceInfo = vi.fn().mockResolvedValue(info)
      const result = await handlers.get_workspace_info(client, {})
      expect(result).toEqual(info)
    })

    it('returns error message when method unavailable', async () => {
      const result: any = await handlers.get_workspace_info(client, {})
      expect(result.success).toBe(false)
      expect(result.message).toContain('admin API')
    })
  })

  describe('list_workspaces', () => {
    it('returns workspaces when method available', async () => {
      const workspaces = [{ id: 'ws1', name: 'Test' }]
      ;(client as any).listWorkspaces = vi.fn().mockResolvedValue(workspaces)
      const result = await handlers.list_workspaces(client, {})
      expect(result).toEqual(workspaces)
    })

    it('returns error message when method unavailable', async () => {
      const result: any = await handlers.list_workspaces(client, {})
      expect(result.success).toBe(false)
    })
  })

  describe('create_workspace', () => {
    it('creates workspace when method available', async () => {
      ;(client as any).createWorkspace = vi.fn().mockResolvedValue({ id: 'ws2' })
      const result: any = await handlers.create_workspace(client, { name: 'New WS' })
      expect(result.id).toBe('ws2')
    })

    it('returns error message when method unavailable', async () => {
      const result: any = await handlers.create_workspace(client, { name: 'New WS' })
      expect(result.success).toBe(false)
    })

    it('throws on missing name', async () => {
      await expect(handlers.create_workspace(client, {})).rejects.toThrow()
    })
  })

  describe('delete_workspace', () => {
    it('deletes workspace when method available', async () => {
      ;(client as any).deleteWorkspace = vi.fn().mockResolvedValue({ success: true })
      const result: any = await handlers.delete_workspace(client, { workspaceId: 'ws1' })
      expect(result.success).toBe(true)
    })

    it('returns error message when method unavailable', async () => {
      const result: any = await handlers.delete_workspace(client, { workspaceId: 'ws1' })
      expect(result.success).toBe(false)
    })
  })

  describe('get_user_profile', () => {
    it('returns profile when method available', async () => {
      ;(client as any).getAccount = vi.fn().mockResolvedValue({ _id: 'u1', email: 'user@test.com', role: 'USER' })
      const result: any = await handlers.get_user_profile(client, {})
      expect(result).toEqual({ id: 'u1', email: 'user@test.com', role: 'USER' })
    })

    it('returns error message when method unavailable', async () => {
      const result: any = await handlers.get_user_profile(client, {})
      expect(result.success).toBe(false)
    })
  })

  describe('update_user_profile', () => {
    it('updates profile fields', async () => {
      client.findAll.mockResolvedValue([{ _id: 'pa1', space: 'sp1' }])
      const result: any = await handlers.update_user_profile(client, { name: 'New Name' })
      expect(result.success).toBe(true)
      expect(client.updateDoc).toHaveBeenCalled()
    })

    it('returns error when no person account found', async () => {
      const result: any = await handlers.update_user_profile(client, { name: 'New Name' })
      expect(result.success).toBe(false)
    })
  })

  describe('update_guest_settings', () => {
    it('returns error message when method unavailable', async () => {
      const result: any = await handlers.update_guest_settings(client, { readOnly: true, signUp: false })
      expect(result.success).toBe(false)
    })

    it('calls method when available', async () => {
      ;(client as any).updateGuestSettings = vi.fn().mockResolvedValue({ success: true })
      const result: any = await handlers.update_guest_settings(client, { readOnly: true, signUp: false })
      expect(result.success).toBe(true)
    })
  })

  describe('get_regions', () => {
    it('returns error message when method unavailable', async () => {
      const result: any = await handlers.get_regions(client, {})
      expect(result.success).toBe(false)
    })

    it('returns regions when method available', async () => {
      ;(client as any).getRegions = vi.fn().mockResolvedValue([{ id: 'us-east', name: 'US East' }])
      const result: any = await handlers.get_regions(client, {})
      expect(result).toEqual([{ id: 'us-east', name: 'US East' }])
    })
  })
})
