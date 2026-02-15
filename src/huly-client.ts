import { ConnectOptions, NodeWebSocketFactory, connect, PlatformClient } from '@hcengineering/api-client'
import tracker, { Project, Issue } from '@hcengineering/tracker'
import core from '@hcengineering/core'

export interface HulyConfig {
  url: string
  email: string
  password: string
  workspace: string
}

export class HulyClient {
  private client: PlatformClient | null = null
  private config: HulyConfig

  constructor(config: HulyConfig) {
    this.config = config
  }

  async connect(): Promise<void> {
    const options: ConnectOptions = {
      email: this.config.email,
      password: this.config.password,
      workspace: this.config.workspace,
      socketFactory: NodeWebSocketFactory,
      connectionTimeout: 30000
    }

    this.client = await connect(this.config.url, options)
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
    }
  }

  private ensureConnected(): PlatformClient {
    if (!this.client) {
      throw new Error('Not connected. Call connect() first.')
    }
    return this.client
  }

  async listProjects(): Promise<Project[]> {
    const client = this.ensureConnected()
    return await client.findAll(tracker.class.Project, {})
  }

  async listIssues(filters?: {
    projectId?: string
    status?: string
    assignee?: string
  }): Promise<Issue[]> {
    const client = this.ensureConnected()
    const query: any = {}

    if (filters?.projectId) {
      query.space = filters.projectId
    }
    if (filters?.status) {
      query.status = filters.status
    }
    if (filters?.assignee) {
      query.assignee = filters.assignee
    }

    return await client.findAll(tracker.class.Issue, query)
  }

  async getIssue(issueId: string): Promise<Issue | undefined> {
    const client = this.ensureConnected()
    return await client.findOne(tracker.class.Issue, { _id: issueId as any })
  }
}
