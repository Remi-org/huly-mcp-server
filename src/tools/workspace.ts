import { z } from 'zod'
import { Ref, Class, Doc } from '@hcengineering/core'
import type { ToolDefinition, ToolHandler } from '../types'

export const definitions: ToolDefinition[] = [
  {
    name: 'list_workspace_members',
    description: 'List all workspace members',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'update_member_role',
    description: 'Update a workspace member role',
    inputSchema: {
      type: 'object',
      properties: {
        accountId: { type: 'string', description: 'Account ID' },
        role: { type: 'string', enum: ['GUEST', 'USER', 'MAINTAINER', 'OWNER'], description: 'New role' },
      },
      required: ['accountId', 'role'],
    },
  },
  {
    name: 'get_workspace_info',
    description: 'Get current workspace information',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'list_workspaces',
    description: 'List available workspaces',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'create_workspace',
    description: 'Create a new workspace',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Workspace name' },
        region: { type: 'string', description: 'Region (optional)' },
      },
      required: ['name'],
    },
  },
  {
    name: 'delete_workspace',
    description: 'Delete a workspace',
    inputSchema: {
      type: 'object',
      properties: {
        workspaceId: { type: 'string', description: 'Workspace ID to delete' },
      },
      required: ['workspaceId'],
    },
  },
  {
    name: 'get_user_profile',
    description: 'Get current user profile',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'update_user_profile',
    description: 'Update current user profile',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Display name (optional)' },
        city: { type: 'string', description: 'City (optional)' },
        bio: { type: 'string', description: 'Bio (optional)' },
      },
    },
  },
  {
    name: 'update_guest_settings',
    description: 'Update guest access settings',
    inputSchema: {
      type: 'object',
      properties: {
        readOnly: { type: 'boolean', description: 'Read-only access' },
        signUp: { type: 'boolean', description: 'Allow sign-up' },
      },
      required: ['readOnly', 'signUp'],
    },
  },
  {
    name: 'get_regions',
    description: 'Get available workspace regions',
    inputSchema: { type: 'object', properties: {} },
  },
]

const listWorkspaceMembers: ToolHandler = async (client) => {
  const members = await client.findAll('contact:class:Employee' as Ref<Class<Doc>>, { active: true })
  return members.map((m: any) => ({
    id: m._id,
    name: m.name,
    active: m.active,
  }))
}

const updateMemberRole: ToolHandler = async (client, args) => {
  const input = z.object({
    accountId: z.string(),
    role: z.enum(['GUEST', 'USER', 'MAINTAINER', 'OWNER']),
  }).parse(args)

  return { success: false, message: 'Role management is handled by the accounts service in v7' }
}

const getWorkspaceInfo: ToolHandler = async (client) => {
  try {
    if (client.getWorkspaceInfo) {
      return await client.getWorkspaceInfo()
    }
  } catch (_) {}
  return { success: false, message: 'This operation requires admin API access' }
}

const listWorkspaces: ToolHandler = async (client) => {
  try {
    if (client.listWorkspaces) {
      return await client.listWorkspaces()
    }
  } catch (_) {}
  return { success: false, message: 'This operation requires admin API access' }
}

const createWorkspace: ToolHandler = async (client, args) => {
  const input = z.object({
    name: z.string().min(1),
    region: z.string().optional(),
  }).parse(args)

  try {
    if (client.createWorkspace) {
      return await client.createWorkspace(input.name, input.region)
    }
  } catch (_) {}
  return { success: false, message: 'This operation requires admin API access' }
}

const deleteWorkspace: ToolHandler = async (client, args) => {
  const { workspaceId } = z.object({ workspaceId: z.string() }).parse(args)

  try {
    if (client.deleteWorkspace) {
      return await client.deleteWorkspace(workspaceId)
    }
  } catch (_) {}
  return { success: false, message: 'This operation requires admin API access' }
}

const getUserProfile: ToolHandler = async (client) => {
  try {
    if (client.getAccount) {
      const account = await client.getAccount()
      return { id: account._id, email: account.email, role: account.role }
    }
  } catch (_) {}
  return { success: false, message: 'This operation requires admin API access' }
}

const updateUserProfile: ToolHandler = async (client, args) => {
  const input = z.object({
    name: z.string().optional(),
    city: z.string().optional(),
    bio: z.string().optional(),
  }).parse(args)

  const PERSON_ACCOUNT_CLASS = 'contact:class:PersonAccount' as Ref<Class<Doc>>
  const accounts = await client.findAll(PERSON_ACCOUNT_CLASS, {})
  if (accounts.length === 0) return { success: false, message: 'No person account found' }

  const account = accounts[0] as any
  const updates: any = {}
  if (input.name) updates.name = input.name
  if (input.city) updates.city = input.city
  if (input.bio) updates.bio = input.bio

  if (Object.keys(updates).length > 0) {
    await client.updateDoc(PERSON_ACCOUNT_CLASS, account.space, account._id, updates)
  }

  return { success: true, message: 'Profile updated' }
}

const updateGuestSettings: ToolHandler = async (client, args) => {
  const input = z.object({
    readOnly: z.boolean(),
    signUp: z.boolean(),
  }).parse(args)

  try {
    if (client.updateGuestSettings) {
      return await client.updateGuestSettings(input.readOnly, input.signUp)
    }
  } catch (_) {}
  return { success: false, message: 'This operation requires admin API access' }
}

const getRegions: ToolHandler = async (client) => {
  try {
    if (client.getRegions) {
      return await client.getRegions()
    }
  } catch (_) {}
  return { success: false, message: 'This operation requires admin API access' }
}

export const handlers: Record<string, ToolHandler> = {
  list_workspace_members: listWorkspaceMembers,
  update_member_role: updateMemberRole,
  get_workspace_info: getWorkspaceInfo,
  list_workspaces: listWorkspaces,
  create_workspace: createWorkspace,
  delete_workspace: deleteWorkspace,
  get_user_profile: getUserProfile,
  update_user_profile: updateUserProfile,
  update_guest_settings: updateGuestSettings,
  get_regions: getRegions,
}
