import { IntlString } from '@hcengineering/platform';
import { Account, AccountRole, AnyAttribute, Class, Doc, DocData, FullTextSearchContext, Obj, Permission, Ref, Space, TypedSpace, WorkspaceMode, type PluginConfiguration } from './classes';
import { Hierarchy } from './hierarchy';
import { TxOperations } from './operations';
import { Branding, BrandingMap } from './server';
import { DocumentQuery, FindResult } from './storage';
import { type Tx } from './tx';
/**
 * @public
 * @returns
 */
export declare function generateId<T extends Doc>(join?: string): Ref<T>;
/** @public */
export declare function isId(value: any): value is Ref<any>;
/**
 * @public
 * @returns
 */
export declare function getCurrentAccount(): Account;
/**
 * @public
 * @param account -
 */
export declare function setCurrentAccount(account: Account): void;
/**
 * @public
 */
export declare function escapeLikeForRegexp(value: string): string;
/**
 * @public
 */
export declare function toFindResult<T extends Doc>(docs: T[], total?: number, lookupMap?: Record<string, Doc>): FindResult<T>;
/**
 * @public
 */
export interface WorkspaceId {
    name: string;
    uuid?: string;
}
/**
 * @public
 */
export interface WorkspaceIdWithUrl extends WorkspaceId {
    workspaceUrl: string;
    workspaceName: string;
}
/**
 * @public
 *
 * Previously was combining workspace with productId, if not equal ''
 * Now just returning workspace as is. Keeping it to simplify further refactoring of ws id.
 */
export declare function getWorkspaceId(workspace: string): WorkspaceId;
/**
 * @public
 */
export declare function toWorkspaceString(id: WorkspaceId): string;
/**
 * @public
 */
export declare function isWorkspaceCreating(mode?: WorkspaceMode): boolean;
/**
 * @public
 */
export declare function docKey(name: string, _class?: Ref<Class<Doc>>): string;
/**
 * @public
 */
export declare function isFullTextAttribute(attr: AnyAttribute): boolean;
/**
 * @public
 */
export declare function isIndexedAttribute(attr: AnyAttribute): boolean;
/**
 * @public
 */
export interface IdMap<T extends Doc> extends Map<Ref<T>, T> {
}
/**
 * @public
 */
export declare function toIdMap<T extends Doc>(arr: T[]): IdMap<T>;
/**
 * @public
 */
export declare function concatLink(host: string, path: string): string;
/**
 * @public
 */
export declare function fillDefaults<T extends Doc>(hierarchy: Hierarchy, object: DocData<T> | T, _class: Ref<Class<T>>): DocData<T> | T;
/**
 * @public
 */
export declare class AggregateValueData {
    readonly name: string;
    readonly _id: Ref<Doc>;
    readonly space: Ref<Space>;
    readonly rank?: string | undefined;
    readonly category?: Ref<Doc<Space>> | undefined;
    constructor(name: string, _id: Ref<Doc>, space: Ref<Space>, rank?: string | undefined, category?: Ref<Doc<Space>> | undefined);
    getRank(): string;
}
/**
 * @public
 */
export declare class AggregateValue {
    readonly name: string | undefined;
    readonly values: AggregateValueData[];
    constructor(name: string | undefined, values: AggregateValueData[]);
}
/**
 * @public
 */
export type CategoryType = number | string | undefined | Ref<Doc> | AggregateValue;
export interface IDocManager<T extends Doc> {
    get: (ref: Ref<T>) => T | undefined;
    getDocs: () => T[];
    getIdMap: () => IdMap<T>;
    filter: (predicate: (value: T) => boolean) => T[];
}
/**
 * @public
 */
export declare class DocManager<T extends Doc> implements IDocManager<T> {
    protected readonly docs: T[];
    protected readonly byId: IdMap<T>;
    constructor(docs: T[]);
    get(ref: Ref<T>): T | undefined;
    getDocs(): T[];
    getIdMap(): IdMap<T>;
    filter(predicate: (value: T) => boolean): T[];
}
/**
 * @public
 */
export declare class RateLimiter {
    idCounter: number;
    processingQueue: Map<number, Promise<void>>;
    last: number;
    rate: number;
    queue: (() => Promise<void>)[];
    constructor(rate: number);
    notify: (() => void)[];
    exec<T, B extends Record<string, any> = any>(op: (args?: B) => Promise<T>, args?: B): Promise<T>;
    add<T, B extends Record<string, any> = any>(op: (args?: B) => Promise<T>, args?: B): Promise<void>;
    waitProcessing(): Promise<void>;
}
export declare function mergeQueries<T extends Doc>(query1: DocumentQuery<T>, query2: DocumentQuery<T>): DocumentQuery<T>;
export declare function cutObjectArray(obj: any): any;
export declare const isEnum: <T>(e: T) => (token: any) => token is T[keyof T];
export declare function checkPermission(client: TxOperations, _id: Ref<Permission>, _space: Ref<TypedSpace>, space?: TypedSpace): Promise<boolean>;
/**
 * @public
 */
export declare function getRoleAttributeLabel(roleName: string): IntlString;
/**
 * @public
 */
export declare function getFullTextIndexableAttributes(hierarchy: Hierarchy, clazz: Ref<Class<Obj>>, skipDocs?: boolean): AnyAttribute[];
/**
 * @public
 */
export declare function getFullTextContext(hierarchy: Hierarchy, objectClass: Ref<Class<Doc>>, contexts: Map<Ref<Class<Doc>>, FullTextSearchContext>): Omit<FullTextSearchContext, keyof Class<Doc>>;
/**
 * @public
 */
export declare function isClassIndexable(hierarchy: Hierarchy, c: Ref<Class<Doc>>, contexts: Map<Ref<Class<Doc>>, FullTextSearchContext>): boolean;
type ReduceParameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
/**
 * Utility method to skip middle update calls, optimistically if update function is called multiple times with few different parameters, only the last variant will be executed.
 * The last invocation is executed after a few cycles, allowing to skip middle ones.
 *
 * This method can be used inside Svelte components to collapse complex update logic and handle interactions.
 */
export declare function reduceCalls<T extends (...args: ReduceParameters<T>) => Promise<void>>(operation: T): (...args: ReduceParameters<T>) => Promise<void>;
export declare function isOwnerOrMaintainer(): boolean;
export declare function hasAccountRole(acc: Account, targerRole: AccountRole): boolean;
export declare function getBranding(brandings: BrandingMap, key: string | undefined): Branding | null;
export declare function fillConfiguration(systemTx: Tx[], configs: Map<Ref<PluginConfiguration>, PluginConfiguration>): void;
export declare function pluginFilterTx(excludedPlugins: PluginConfiguration[], configs: Map<Ref<PluginConfiguration>, PluginConfiguration>, systemTx: Tx[]): Tx[];
/**
 * @public
 */
export declare class TimeRateLimiter {
    idCounter: number;
    active: number;
    last: number;
    rate: number;
    period: number;
    executions: {
        time: number;
        running: boolean;
    }[];
    queue: (() => Promise<void>)[];
    notify: (() => void)[];
    constructor(rate: number, period?: number);
    private cleanupExecutions;
    exec<T, B extends Record<string, any> = any>(op: (args?: B) => Promise<T>, args?: B): Promise<T>;
    waitProcessing(): Promise<void>;
}
export declare function combineAttributes(attributes: any[], key: string, operator: '$push' | '$pull', arrayKey: '$each' | '$in'): any[];
export {};
//# sourceMappingURL=utils.d.ts.map