import { MeasureContext } from '.';
import type { Account, Class, Doc, Ref } from './classes';
import { Hierarchy } from './hierarchy';
import type { DocumentQuery, FindOptions, FindResult, Storage, TxResult, WithLookup } from './storage';
import type { Tx, TxCreateDoc, TxMixin, TxRemoveDoc, TxUpdateDoc } from './tx';
import { TxProcessor } from './tx';
/**
 * @public
 */
export declare abstract class MemDb extends TxProcessor implements Storage {
    protected readonly hierarchy: Hierarchy;
    private readonly objectsByClass;
    private readonly objectById;
    private readonly accountByPersonId;
    private readonly accountByEmail;
    constructor(hierarchy: Hierarchy);
    private getObjectsByClass;
    private cleanObjectByClass;
    private getByIdQuery;
    getObject<T extends Doc>(_id: Ref<T>): T;
    getAccountByPersonId(ref: Ref<Doc>): Account[];
    getAccountByEmail(email: Account['email']): Account | undefined;
    findObject<T extends Doc>(_id: Ref<T>): T | undefined;
    private getLookupValue;
    private getReverseLookupValue;
    private lookup;
    private fillAssociations;
    private getAssoctionValue;
    findAll<T extends Doc>(_class: Ref<Class<T>>, query: DocumentQuery<T>, options?: FindOptions<T>): Promise<FindResult<T>>;
    findOne<T extends Doc>(_class: Ref<Class<T>>, query: DocumentQuery<T>, options?: FindOptions<T>): Promise<WithLookup<T> | undefined>;
    /**
     * Only in model find without lookups and sorting.
     * Do not clone results, so be aware modifications are not allowed.
     */
    findAllSync<T extends Doc>(_class: Ref<Class<T>>, query: DocumentQuery<T>, options?: FindOptions<T>): FindResult<T>;
    addAccount(account: Account): void;
    addDoc(doc: Doc): void;
    delAccount(account: Account): void;
    delDoc(_id: Ref<Doc>): void;
    updateDoc(_id: Ref<Doc>, doc: Doc, update: TxUpdateDoc<Doc> | TxMixin<Doc, Doc>): void;
}
/**
 * Hold transactions
 *
 * @public
 */
export declare class TxDb extends MemDb {
    protected txCreateDoc(tx: TxCreateDoc<Doc>): Promise<TxResult>;
    protected txUpdateDoc(tx: TxUpdateDoc<Doc>): Promise<TxResult>;
    protected txRemoveDoc(tx: TxRemoveDoc<Doc>): Promise<TxResult>;
    protected txMixin(tx: TxMixin<Doc, Doc>): Promise<TxResult>;
    tx(tx: Tx): Promise<TxResult[]>;
}
/**
 * Hold model objects and classes
 *
 * @public
 */
export declare class ModelDb extends MemDb {
    protected txCreateDoc(tx: TxCreateDoc<Doc>): Promise<TxResult>;
    addTxes(ctx: MeasureContext, txes: Tx[], clone: boolean): void;
    protected txUpdateDoc(tx: TxUpdateDoc<Doc>): Promise<TxResult>;
    protected txRemoveDoc(tx: TxRemoveDoc<Doc>): Promise<TxResult>;
    protected txMixin(tx: TxMixin<Doc, Doc>): Promise<TxResult>;
}
//# sourceMappingURL=memdb.d.ts.map