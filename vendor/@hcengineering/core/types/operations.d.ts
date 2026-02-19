import { DocumentUpdate, Hierarchy, MixinData, MixinUpdate, ModelDb } from '.';
import type { Account, AnyAttribute, AttachedData, AttachedDoc, Class, Data, Doc, Mixin, Ref, Space, Timestamp } from './classes';
import { Client } from './client';
import type { DocumentQuery, FindOptions, FindResult, SearchOptions, SearchQuery, SearchResult, TxResult, WithLookup } from './storage';
import { DocumentClassQuery, Tx, TxCUD, TxFactory } from './tx';
/**
 * @public
 *
 * High Level operations with client, will create low level transactions.
 *
 * `notify` is not supported by TxOperations.
 */
export declare class TxOperations implements Omit<Client, 'notify'> {
    readonly client: Client;
    readonly user: Ref<Account>;
    readonly isDerived: boolean;
    readonly txFactory: TxFactory;
    constructor(client: Client, user: Ref<Account>, isDerived?: boolean);
    getHierarchy(): Hierarchy;
    getModel(): ModelDb;
    close(): Promise<void>;
    findAll<T extends Doc>(_class: Ref<Class<T>>, query: DocumentQuery<T>, options?: FindOptions<T> | undefined): Promise<FindResult<T>>;
    findOne<T extends Doc>(_class: Ref<Class<T>>, query: DocumentQuery<T>, options?: FindOptions<T> | undefined): Promise<WithLookup<T> | undefined>;
    searchFulltext(query: SearchQuery, options: SearchOptions): Promise<SearchResult>;
    tx(tx: Tx): Promise<TxResult>;
    createDoc<T extends Doc>(_class: Ref<Class<T>>, space: Ref<Space>, attributes: Data<T>, id?: Ref<T>, modifiedOn?: Timestamp, modifiedBy?: Ref<Account>): Promise<Ref<T>>;
    addCollection<T extends Doc, P extends AttachedDoc>(_class: Ref<Class<P>>, space: Ref<Space>, attachedTo: Ref<T>, attachedToClass: Ref<Class<T>>, collection: Extract<keyof T, string> | string, attributes: AttachedData<P>, id?: Ref<P>, modifiedOn?: Timestamp, modifiedBy?: Ref<Account>): Promise<Ref<P>>;
    updateCollection<T extends Doc, P extends AttachedDoc>(_class: Ref<Class<P>>, space: Ref<Space>, objectId: Ref<P>, attachedTo: Ref<T>, attachedToClass: Ref<Class<T>>, collection: Extract<keyof T, string> | string, operations: DocumentUpdate<P>, retrieve?: boolean, modifiedOn?: Timestamp, modifiedBy?: Ref<Account>): Promise<Ref<T>>;
    removeCollection<T extends Doc, P extends AttachedDoc>(_class: Ref<Class<P>>, space: Ref<Space>, objectId: Ref<P>, attachedTo: Ref<T>, attachedToClass: Ref<Class<T>>, collection: Extract<keyof T, string> | string, modifiedOn?: Timestamp, modifiedBy?: Ref<Account>): Promise<Ref<T>>;
    updateDoc<T extends Doc>(_class: Ref<Class<T>>, space: Ref<Space>, objectId: Ref<T>, operations: DocumentUpdate<T>, retrieve?: boolean, modifiedOn?: Timestamp, modifiedBy?: Ref<Account>): Promise<TxResult>;
    removeDoc<T extends Doc>(_class: Ref<Class<T>>, space: Ref<Space>, objectId: Ref<T>, modifiedOn?: Timestamp, modifiedBy?: Ref<Account>): Promise<TxResult>;
    createMixin<D extends Doc, M extends D>(objectId: Ref<D>, objectClass: Ref<Class<D>>, objectSpace: Ref<Space>, mixin: Ref<Mixin<M>>, attributes: MixinData<D, M>, modifiedOn?: Timestamp, modifiedBy?: Ref<Account>): Promise<TxResult>;
    updateMixin<D extends Doc, M extends D>(objectId: Ref<D>, objectClass: Ref<Class<D>>, objectSpace: Ref<Space>, mixin: Ref<Mixin<M>>, attributes: MixinUpdate<D, M>, modifiedOn?: Timestamp, modifiedBy?: Ref<Account>): Promise<TxResult>;
    update<T extends Doc>(doc: T, update: DocumentUpdate<T>, retrieve?: boolean, modifiedOn?: Timestamp, modifiedBy?: Ref<Account>): Promise<TxResult>;
    remove<T extends Doc>(doc: T, modifiedOn?: Timestamp, modifiedBy?: Ref<Account>): Promise<TxResult>;
    apply(scope?: string, measure?: string, derived?: boolean): ApplyOperations;
    diffUpdate<T extends Doc = Doc>(doc: T, update: T | Data<T> | DocumentUpdate<T>, date?: Timestamp, account?: Ref<Account>): Promise<T>;
    mixinDiffUpdate(doc: Doc, raw: Doc | Data<Doc>, mixin: Ref<Class<Mixin<Doc>>>, modifiedBy: Ref<Account>, modifiedOn: Timestamp): Promise<Doc>;
}
export declare function getDiffUpdate<T extends Doc>(doc: T, update: T | Data<T> | DocumentUpdate<T>): DocumentUpdate<T>;
export declare function splitMixinUpdate<T extends Doc>(hierarchy: Hierarchy, update: DocumentUpdate<T>, mixClass: Ref<Class<T>>, baseClass: Ref<Class<T>>): Map<Ref<Class<Doc>>, DocumentUpdate<T>>;
export interface CommitResult {
    result: boolean;
    time: number;
    serverTime: number;
}
/**
 * @public
 *
 * Builder for ApplyOperation, with same syntax as TxOperations.
 *
 * Will send real command on commit and will return boolean of operation success.
 */
export declare class ApplyOperations extends TxOperations {
    readonly ops: TxOperations;
    readonly scope?: string | undefined;
    readonly measureName?: string | undefined;
    txes: TxCUD<Doc>[];
    matches: DocumentClassQuery<Doc>[];
    notMatches: DocumentClassQuery<Doc>[];
    constructor(ops: TxOperations, scope?: string | undefined, measureName?: string | undefined, isDerived?: boolean);
    match<T extends Doc>(_class: Ref<Class<T>>, query: DocumentQuery<T>): ApplyOperations;
    notMatch<T extends Doc>(_class: Ref<Class<T>>, query: DocumentQuery<T>): ApplyOperations;
    commit(notify?: boolean, extraNotify?: Ref<Class<Doc>>[]): Promise<CommitResult>;
    apply(scope?: string, measure?: string): ApplyOperations;
}
/**
 * @public
 *
 * Builder for TxOperations.
 */
export declare class TxBuilder extends TxOperations {
    readonly hierarchy: Hierarchy;
    readonly modelDb: ModelDb;
    txes: TxCUD<Doc>[];
    matches: DocumentClassQuery<Doc>[];
    constructor(hierarchy: Hierarchy, modelDb: ModelDb, user: Ref<Account>);
}
/**
 * @public
 */
export declare function updateAttribute(client: TxOperations, object: Doc, _class: Ref<Class<Doc>>, attribute: {
    key: string;
    attr: AnyAttribute;
}, value: any, saveModified?: boolean, analyticsProps?: Record<string, any>): Promise<void>;
//# sourceMappingURL=operations.d.ts.map