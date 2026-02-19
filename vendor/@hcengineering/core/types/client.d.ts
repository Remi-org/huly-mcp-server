import { BackupClient } from './backup';
import { Account, Class, Doc, Ref, Timestamp } from './classes';
import { Hierarchy } from './hierarchy';
import { MeasureContext } from './measurements';
import { ModelDb } from './memdb';
import type { DocumentQuery, FindOptions, FulltextStorage, Storage, WithLookup } from './storage';
import { Tx } from './tx';
/**
 * @public
 */
export type TxHandler = (...tx: Tx[]) => void;
/**
 * @public
 */
export interface Client extends Storage, FulltextStorage {
    notify?: (...tx: Tx[]) => void;
    getHierarchy: () => Hierarchy;
    getModel: () => ModelDb;
    findOne: <T extends Doc>(_class: Ref<Class<T>>, query: DocumentQuery<T>, options?: FindOptions<T>) => Promise<WithLookup<T> | undefined>;
    close: () => Promise<void>;
}
/**
 * @public
 */
export interface AccountClient extends Client {
    getAccount: () => Promise<Account>;
}
/**
 * @public
 */
export interface LoadModelResponse {
    transactions: Tx[];
    hash: string;
    full: boolean;
}
/**
 * @public
 */
export declare enum ClientConnectEvent {
    Connected = 0,// In case we just connected to server, and receive a full model
    Reconnected = 1,// In case we re-connected to server and receive and apply diff.
    Upgraded = 2,// In case client code receive a full new model and need to be rebuild.
    Refresh = 3,// In case we detect query refresh is required
    Maintenance = 4
}
/**
 * @public
 */
export interface ClientConnection extends Storage, FulltextStorage, BackupClient {
    isConnected: () => boolean;
    close: () => Promise<void>;
    onConnect?: (event: ClientConnectEvent, lastTx: string | undefined, data: any) => Promise<void>;
    loadModel: (last: Timestamp, hash?: string) => Promise<Tx[] | LoadModelResponse>;
    getAccount: () => Promise<Account>;
    getLastHash?: (ctx: MeasureContext) => Promise<string | undefined>;
}
/**
 * @public
 */
export interface TxPersistenceStore {
    load: () => Promise<LoadModelResponse>;
    store: (model: LoadModelResponse) => Promise<void>;
}
export type ModelFilter = (tx: Tx[]) => Tx[];
/**
 * @public
 */
export declare function createClient(connect: (txHandler: TxHandler) => Promise<ClientConnection>, modelFilter?: ModelFilter, txPersistence?: TxPersistenceStore, _ctx?: MeasureContext): Promise<AccountClient>;
export declare function buildModel(ctx: MeasureContext, transactions: Tx[], modelFilter: ModelFilter | undefined, hierarchy: Hierarchy, model: ModelDb): void;
//# sourceMappingURL=client.d.ts.map