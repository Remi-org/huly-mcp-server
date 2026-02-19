import { type Account, type Class, type Doc, type DocumentQuery, type FindOptions, type FindResult, Hierarchy, ModelDb, type Ref, type SearchOptions, type SearchQuery, type SearchResult, type Tx, type TxResult, type WithLookup } from '@hcengineering/core';
import type { RestClient } from './types';
export declare function createRestClient(endpoint: string, workspaceId: string, token: string): RestClient;
export declare class RestClientImpl implements RestClient {
    readonly workspace: string;
    readonly token: string;
    endpoint: string;
    constructor(endpoint: string, workspace: string, token: string);
    jsonHeaders(): Record<string, string>;
    requestInit(): RequestInit;
    findAll<T extends Doc>(_class: Ref<Class<T>>, query: DocumentQuery<T>, options?: FindOptions<T>): Promise<FindResult<T>>;
    getAccount(): Promise<Account>;
    getModel(): Promise<{
        hierarchy: Hierarchy;
        model: ModelDb;
    }>;
    findOne<T extends Doc>(_class: Ref<Class<T>>, query: DocumentQuery<T>, options?: FindOptions<T>): Promise<WithLookup<T> | undefined>;
    tx(tx: Tx): Promise<TxResult>;
    searchFulltext(query: SearchQuery, options: SearchOptions): Promise<SearchResult>;
}
//# sourceMappingURL=rest.d.ts.map