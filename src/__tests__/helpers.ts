import { vi } from 'vitest'

export function createMockClient(overrides: Record<string, any> = {}) {
  return {
    findAll: vi.fn().mockResolvedValue([]),
    findOne: vi.fn().mockResolvedValue(null),
    createDoc: vi.fn().mockResolvedValue(undefined),
    updateDoc: vi.fn().mockResolvedValue(undefined),
    removeDoc: vi.fn().mockResolvedValue(undefined),
    addCollection: vi.fn().mockResolvedValue(undefined),
    removeCollection: vi.fn().mockResolvedValue(undefined),
    uploadMarkup: vi.fn().mockResolvedValue('blob:markup-ref'),
    markup: {
      fetchMarkup: vi.fn().mockResolvedValue('# Fetched content'),
      collaborator: {
        updateMarkup: vi.fn().mockResolvedValue(undefined),
      },
    },
    ...overrides,
  }
}
