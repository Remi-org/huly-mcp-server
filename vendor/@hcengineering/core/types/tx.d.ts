import type { KeysByType } from 'simplytyped';
import type { Account, Arr, AttachedDoc, Class, Data, Doc, Domain, Mixin, PropertyType, Ref, Space, Timestamp } from './classes';
import type { DocumentQuery, TxResult } from './storage';
/**
 * @public
 */
export interface Tx extends Doc {
    objectSpace: Ref<Space>;
}
/**
 * @public
 */
export declare enum WorkspaceEvent {
    UpgradeScheduled = 0,
    IndexingUpdate = 1,
    SecurityChange = 2,
    MaintenanceNotification = 3,
    BulkUpdate = 4,
    LastTx = 5
}
/**
 * Event to be send by server during model upgrade procedure.
 * @public
 */
export interface TxWorkspaceEvent<T = any> extends Tx {
    event: WorkspaceEvent;
    params: T;
}
/**
 * @public
 */
export interface IndexingUpdateEvent {
    _class: Ref<Class<Doc>>[];
}
/**
 * @public
 */
export interface BulkUpdateEvent {
    _class: Ref<Class<Doc>>[];
}
/**
 * @public
 */
export interface TxModelUpgrade extends Tx {
}
/**
 * @public
 */
export interface TxCUD<T extends Doc> extends Tx {
    objectId: Ref<T>;
    objectClass: Ref<Class<T>>;
    attachedTo?: Ref<Doc>;
    attachedToClass?: Ref<Class<Doc>>;
    collection?: string;
}
/**
 * @public
 */
export interface TxCreateDoc<T extends Doc> extends TxCUD<T> {
    attributes: Data<T>;
}
/**
 * @public
 */
export interface DocumentClassQuery<T extends Doc> {
    _class: Ref<Class<T>>;
    query: DocumentQuery<T>;
}
/**
 * @public
 * Apply set of transactions in sequential manner with verification of set of queries.
 */
export interface TxApplyIf extends Tx {
    scope?: string;
    match?: DocumentClassQuery<Doc>[];
    notMatch?: DocumentClassQuery<Doc>[];
    txes: TxCUD<Doc>[];
    notify?: boolean;
    extraNotify?: Ref<Class<Doc>>[];
    measureName?: string;
}
export interface TxApplyResult {
    success: boolean;
    serverTime: number;
}
/**
 * @public
 */
export type MixinData<D extends Doc, M extends D> = Omit<M, keyof D> & PushOptions<Omit<M, keyof D>> & IncOptions<Omit<M, keyof D>>;
/**
 * @public
 */
export type MixinUpdate<D extends Doc, M extends D> = Partial<Omit<M, keyof D>> & PushOptions<Omit<M, keyof D>> & IncOptions<Omit<M, keyof D>>;
/**
 * Define Create/Update for mixin attributes.
 * @public
 */
export interface TxMixin<D extends Doc, M extends D> extends TxCUD<D> {
    mixin: Ref<Mixin<M>>;
    attributes: MixinUpdate<D, M>;
}
/**
 * @public
 */
export type ArrayAsElement<T> = {
    [P in keyof T]: T[P] extends Arr<infer X> ? Partial<X> | PullArray<X> | X : never;
};
/**
 * @public
 */
export interface Position<X extends PropertyType> {
    $each: X[];
    $position: number;
}
/**
 * @public
 */
export interface QueryUpdate<X extends PropertyType> {
    $query: Partial<X>;
    $update: Partial<X>;
}
/**
 * @public
 */
export interface PullArray<X extends PropertyType> {
    $in: X[];
}
/**
 * @public
 */
export interface MoveDescriptor<X extends PropertyType> {
    $value: X;
    $position: number;
}
/**
 * @public
 */
export type ArrayAsElementPosition<T extends object> = {
    [P in keyof T]-?: T[P] extends Arr<infer X> ? X | Position<X> : never;
};
/**
 * @public
 */
export type ArrayAsElementUpdate<T extends object> = {
    [P in keyof T]-?: T[P] extends Arr<infer X> ? X | QueryUpdate<X> : never;
};
/**
 * @public
 */
export type ArrayMoveDescriptor<T extends object> = {
    [P in keyof T]: T[P] extends Arr<infer X> ? MoveDescriptor<X> : never;
};
/**
 * @public
 */
export type NumberProperties<T extends object> = {
    [P in keyof T]: T[P] extends number | undefined | null ? T[P] : never;
};
/**
 * @public
 */
export type OmitNever<T extends object> = Omit<T, KeysByType<T, never>>;
/**
 * @public
 */
export interface PushOptions<T extends object> {
    $push?: Partial<OmitNever<ArrayAsElementPosition<Required<T>>>>;
    $pull?: Partial<OmitNever<ArrayAsElement<Required<T>>>>;
}
/**
 * @public
 */
export type UnsetProperties = Record<string, any>;
/**
 * @public
 */
export interface UnsetOptions {
    $unset?: UnsetProperties;
}
/**
 * @public
 */
export interface SetEmbeddedOptions<T extends object> {
    $update?: Partial<OmitNever<ArrayAsElementUpdate<Required<T>>>>;
}
/**
 * @public
 */
export interface IncOptions<T extends object> {
    $inc?: Partial<OmitNever<NumberProperties<T>>>;
}
/**
 * @public
 */
export interface SpaceUpdate {
    space?: Ref<Space>;
}
/**
 * @public
 */
export type DocumentUpdate<T extends Doc> = Partial<Data<T>> & PushOptions<T> & SetEmbeddedOptions<T> & IncOptions<T> & UnsetOptions & SpaceUpdate;
/**
 * @public
 */
export interface TxUpdateDoc<T extends Doc> extends TxCUD<T> {
    operations: DocumentUpdate<T>;
    retrieve?: boolean;
}
/**
 * @public
 */
export interface TxRemoveDoc<T extends Doc> extends TxCUD<T> {
}
/**
 * @public
 */
export declare const DOMAIN_TX: Domain;
/**
 * @public
 */
export interface WithTx {
    tx: (...txs: Tx[]) => Promise<TxResult[]>;
}
/**
 * @public
 */
export declare abstract class TxProcessor implements WithTx {
    tx(...txes: Tx[]): Promise<TxResult[]>;
    static createDoc2Doc<T extends Doc>(tx: TxCreateDoc<T>, doClone?: boolean): T;
    static updateDoc2Doc<T extends Doc>(rawDoc: T, tx: TxUpdateDoc<T>): T;
    static applyUpdate<T extends Doc>(doc: T, ops: any): void;
    static updateMixin4Doc<D extends Doc, M extends D>(rawDoc: D, tx: TxMixin<D, M>): D;
    static buildDoc2Doc<D extends Doc>(txes: Tx[]): D | undefined;
    static isExtendsCUD(_class: Ref<Class<Doc>>): boolean;
    static txHasUpdate<T extends Doc>(tx: TxUpdateDoc<T>, attribute: string): boolean;
    protected abstract txCreateDoc(tx: TxCreateDoc<Doc>): Promise<TxResult>;
    protected abstract txUpdateDoc(tx: TxUpdateDoc<Doc>): Promise<TxResult>;
    protected abstract txRemoveDoc(tx: TxRemoveDoc<Doc>): Promise<TxResult>;
    protected abstract txMixin(tx: TxMixin<Doc, Doc>): Promise<TxResult>;
}
/**
 * @public
 */
export declare class TxFactory {
    readonly account: Ref<Account>;
    readonly isDerived: boolean;
    private readonly txSpace;
    constructor(account: Ref<Account>, isDerived?: boolean);
    createTxCreateDoc<T extends Doc>(_class: Ref<Class<T>>, space: Ref<Space>, attributes: Data<T>, objectId?: Ref<T>, modifiedOn?: Timestamp, modifiedBy?: Ref<Account>): TxCreateDoc<T>;
    createTxCollectionCUD<T extends Doc, P extends AttachedDoc>(_class: Ref<Class<T>>, objectId: Ref<T>, space: Ref<Space>, collection: string, tx: TxCUD<P>, modifiedOn?: Timestamp, modifiedBy?: Ref<Account>): TxCUD<P>;
    createTxUpdateDoc<T extends Doc>(_class: Ref<Class<T>>, space: Ref<Space>, objectId: Ref<T>, operations: DocumentUpdate<T>, retrieve?: boolean, modifiedOn?: Timestamp, modifiedBy?: Ref<Account>): TxUpdateDoc<T>;
    createTxRemoveDoc<T extends Doc>(_class: Ref<Class<T>>, space: Ref<Space>, objectId: Ref<T>, modifiedOn?: Timestamp, modifiedBy?: Ref<Account>): TxRemoveDoc<T>;
    createTxMixin<D extends Doc, M extends D>(objectId: Ref<D>, objectClass: Ref<Class<D>>, objectSpace: Ref<Space>, mixin: Ref<Mixin<M>>, attributes: MixinUpdate<D, M>, modifiedOn?: Timestamp, modifiedBy?: Ref<Account>): TxMixin<D, M>;
    createTxApplyIf(space: Ref<Space>, scope: string | undefined, match: DocumentClassQuery<Doc>[], notMatch: DocumentClassQuery<Doc>[], txes: TxCUD<Doc>[], measureName: string | undefined, notify?: boolean, extraNotify?: Ref<Class<Doc>>[], modifiedOn?: Timestamp, modifiedBy?: Ref<Account>): TxApplyIf;
}
//# sourceMappingURL=tx.d.ts.map