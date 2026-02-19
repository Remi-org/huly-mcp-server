import type { Account, Doc, DocIndexState, Domain, Ref } from './classes';
import { MeasureContext } from './measurements';
import { DocumentQuery, FindOptions } from './storage';
import type { DocumentUpdate, Tx } from './tx';
import type { WorkspaceIdWithUrl } from './utils';
/**
 * @public
 */
export interface DocInfo {
    id: string;
    hash: string;
    size?: number;
}
/**
 * @public
 */
export interface StorageIterator {
    next: (ctx: MeasureContext) => Promise<DocInfo[]>;
    close: (ctx: MeasureContext) => Promise<void>;
}
export type BroadcastTargets = Record<string, (tx: Tx) => string[] | undefined>;
export interface SessionData {
    broadcast: {
        txes: Tx[];
        targets: BroadcastTargets;
    };
    contextCache: Map<string, any>;
    removedMap: Map<Ref<Doc>, Doc>;
    userEmail: string;
    sessionId: string;
    admin?: boolean;
    isTriggerCtx?: boolean;
    account: Account;
    getAccount: (account: Ref<Account>) => Account | undefined;
    workspace: WorkspaceIdWithUrl;
    branding: Branding | null;
    fulltextUpdates?: Map<Ref<DocIndexState>, DocIndexState>;
    asyncRequests?: (() => Promise<void>)[];
}
/**
 * @public
 */
export interface LowLevelStorage {
    find: (ctx: MeasureContext, domain: Domain) => StorageIterator;
    load: (ctx: MeasureContext, domain: Domain, docs: Ref<Doc>[]) => Promise<Doc[]>;
    upload: (ctx: MeasureContext, domain: Domain, docs: Doc[]) => Promise<void>;
    clean: (ctx: MeasureContext, domain: Domain, docs: Ref<Doc>[]) => Promise<void>;
    groupBy: <T, P extends Doc>(ctx: MeasureContext, domain: Domain, field: string, query?: DocumentQuery<P>) => Promise<Map<T, number>>;
    rawFindAll: <T extends Doc>(domain: Domain, query: DocumentQuery<T>, options?: FindOptions<T>) => Promise<T[]>;
    rawUpdate: <T extends Doc>(domain: Domain, query: DocumentQuery<T>, operations: DocumentUpdate<T>) => Promise<void>;
    rawDeleteMany: <T extends Doc>(domain: Domain, query: DocumentQuery<T>) => Promise<void>;
    traverse: <T extends Doc>(domain: Domain, query: DocumentQuery<T>, options?: Pick<FindOptions<T>, 'sort' | 'limit' | 'projection'>) => Promise<Iterator<T>>;
    getDomainHash: (ctx: MeasureContext, domain: Domain) => Promise<string>;
}
export interface Iterator<T extends Doc> {
    next: (count: number) => Promise<T[] | null>;
    close: () => Promise<void>;
}
export interface Branding {
    key?: string;
    front?: string;
    title?: string;
    language?: string;
    initWorkspace?: string;
    lastNameFirst?: string;
    protocol?: string;
}
export type BrandingMap = Record<string, Branding>;
//# sourceMappingURL=server.d.ts.map