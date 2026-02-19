import { type Account, type Class, type Doc, type DocumentQuery, type FindOptions, type Hierarchy, type ModelDb, type Ref, type Storage, type WithLookup } from '@hcengineering/core';
export interface RestClient extends Storage {
    getAccount: () => Promise<Account>;
    findOne: <T extends Doc>(_class: Ref<Class<T>>, query: DocumentQuery<T>, options?: FindOptions<T>) => Promise<WithLookup<T> | undefined>;
    getModel: () => Promise<{
        hierarchy: Hierarchy;
        model: ModelDb;
    }>;
}
//# sourceMappingURL=types.d.ts.map