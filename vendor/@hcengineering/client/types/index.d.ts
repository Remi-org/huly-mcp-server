import type { AccountClient, ClientConnectEvent, MeasureContext, TxPersistenceStore } from '@hcengineering/core';
import { type Plugin, type Resource, type Metadata } from '@hcengineering/platform';
/**
 * @public
 */
export declare const clientId: Plugin;
/**
 * @public
 */
export type ClientSocketFactory = (url: string) => ClientSocket;
/**
 * @public
 */
export interface ClientSocket {
    onmessage?: ((this: ClientSocket, ev: MessageEvent) => any) | null;
    onclose?: ((this: ClientSocket, ev: CloseEvent) => any) | null;
    onopen?: ((this: ClientSocket, ev: Event) => any) | null;
    onerror?: ((this: ClientSocket, ev: Event) => any) | null;
    send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
    close: (code?: number) => void;
    readyState: ClientSocketReadyState;
    bufferedAmount?: number;
}
/**
 * @public
 */
export declare enum ClientSocketReadyState {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3
}
export interface ClientFactoryOptions {
    socketFactory?: ClientSocketFactory;
    useBinaryProtocol?: boolean;
    useProtocolCompression?: boolean;
    connectionTimeout?: number;
    onHello?: (serverVersion?: string) => boolean;
    onUpgrade?: () => void;
    onUnauthorized?: () => void;
    onArchived?: () => void;
    onMigration?: () => void;
    onConnect?: (event: ClientConnectEvent, lastTx: string | undefined, data: any) => Promise<void>;
    ctx?: MeasureContext;
    onDialTimeout?: () => void | Promise<void>;
    useGlobalRPCHandler?: boolean;
}
/**
 * @public
 */
export type ClientFactory = (token: string, endpoint: string, opt?: ClientFactoryOptions) => Promise<AccountClient>;
export type FilterMode = 'none' | 'client' | 'ui';
export declare const pingConst = "ping";
export declare const pongConst = "pong!";
declare const _default: {
    metadata: {
        ClientSocketFactory: Metadata<ClientSocketFactory>;
        FilterModel: Metadata<FilterMode>;
        ExtraPlugins: Metadata<Plugin[]>;
        UseBinaryProtocol: Metadata<boolean>;
        UseProtocolCompression: Metadata<boolean>;
        ConnectionTimeout: Metadata<number>;
        OverridePersistenceStore: Metadata<TxPersistenceStore>;
    };
    function: {
        GetClient: Resource<ClientFactory>;
    };
    event: {
        NetworkRequests: Metadata<string>;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map