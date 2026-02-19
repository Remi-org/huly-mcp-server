import type { Account } from '@hcengineering/core';
import { Status } from '@hcengineering/platform';
import { Packr } from 'msgpackr';
/**
 * @public
 */
export type ReqId = string | number;
/**
 * @public
 */
export interface Request<P extends any[]> {
    id?: ReqId;
    method: string;
    params: P;
    time?: number;
}
/**
 * @public
 */
export interface HelloRequest extends Request<any[]> {
    binary?: boolean;
    compression?: boolean;
}
/**
 * @public
 */
export interface HelloResponse extends Response<any> {
    binary: boolean;
    reconnect?: boolean;
    serverVersion: string;
    lastTx?: string;
    lastHash?: string;
    account: Account;
    useCompression?: boolean;
}
export declare function rpcJSONReplacer(key: string, value: any): any;
export declare function rpcJSONReceiver(key: string, value: any): any;
/**
 * Response object define a server response on transaction request.
 * Also used to inform other clients about operations being performed by server.
 *
 * @public
 */
export interface Response<R> {
    result?: R;
    id?: ReqId;
    error?: Status;
    terminate?: boolean;
    chunk?: {
        index: number;
        final: boolean;
    };
    time?: number;
    bfst?: number;
    queue?: number;
}
export declare class RPCHandler {
    packr: Packr;
    protoSerialize(object: object, binary: boolean): any;
    protoDeserialize(data: any, binary: boolean): any;
    /**
     * @public
     * @param object -
     * @returns
     */
    serialize(object: Request<any> | Response<any>, binary: boolean): any;
    /**
     * @public
     * @param response -
     * @returns
     */
    readResponse<D>(response: any, binary: boolean): Response<D>;
    /**
     * @public
     * @param request -
     * @returns
     */
    readRequest<P extends any[]>(request: any, binary: boolean): Request<P>;
}
/**
 * @public
 * @param status -
 * @param id -
 * @returns
 */
export declare function fromStatus(status: Status, id?: ReqId): Response<any>;
//# sourceMappingURL=rpc.d.ts.map