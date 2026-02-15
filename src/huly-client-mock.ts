export interface HulyConfig {
  url: string
  email: string
  password: string
  workspace: string
}

export interface Project {
  _id: string
  identifier: string
  name: string
  description: string
}

export interface Issue {
  _id: string
  identifier: string
  title: string
  status: string
  assignee: string | null
  number: number
}

export class HulyClient {
  private config: HulyConfig

  constructor(config: HulyConfig) {
    this.config = config
  }

  async connect(): Promise<void> {
    console.error(`Mock: Connected to ${this.config.url}`)
  }

  async disconnect(): Promise<void> {
    console.error('Mock: Disconnected')
  }

  async listProjects(): Promise<Project[]> {
    return [
      {
        _id: 'proj1',
        identifier: 'REM',
        name: 'Remi Project',
        description: 'Main remi project',
      },
      {
        _id: 'proj2',
        identifier: 'TEST',
        name: 'Test Project',
        description: 'Test project for development',
      },
    ]
  }

  async listIssues(filters?: {
    projectId?: string
    status?: string
    assignee?: string
  }): Promise<Issue[]> {
    const allIssues: Issue[] = [
      {
        _id: 'issue1',
        identifier: 'REM-1',
        title: 'Setup MCP server',
        status: 'In Progress',
        assignee: null,
        number: 1,
      },
      {
        _id: 'issue2',
        identifier: 'REM-2',
        title: 'Test connection to Huly',
        status: 'Done',
        assignee: 'denis@goremi.co.uk',
        number: 2,
      },
      {
        _id: 'issue3',
        identifier: 'TEST-1',
        title: 'Sample test issue',
        status: 'Todo',
        assignee: null,
        number: 1,
      },
    ]

    if (!filters) return allIssues

    return allIssues.filter((issue) => {
      if (filters.projectId && !issue.identifier.startsWith(filters.projectId)) {
        return false
      }
      if (filters.status && issue.status !== filters.status) {
        return false
      }
      if (filters.assignee && issue.assignee !== filters.assignee) {
        return false
      }
      return true
    })
  }

  async getIssue(issueId: string): Promise<Issue | undefined> {
    const issues = await this.listIssues()
    return issues.find((i) => i._id === issueId)
  }
}
