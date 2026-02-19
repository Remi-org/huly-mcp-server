import { WorkspaceUuid, Blob } from '@hcengineering/core';
import { Readable } from 'stream';
import { StorageClient } from './types';
import { ServerConfig } from '../config';
import { AuthOptions } from '../types';
export declare class StorageClientImpl implements StorageClient {
    readonly filesUrl: string;
    readonly uploadUrl: string;
    readonly workspace: WorkspaceUuid;
    private readonly headers;
    constructor(filesUrl: string, uploadUrl: string, token: string, workspace: WorkspaceUuid);
    getObjectUrl(objectName: string): string;
    stat(objectName: string): Promise<Blob | undefined>;
    get(objectName: string): Promise<Readable>;
    put(objectName: string, stream: Readable | Buffer | string, contentType: string, size?: number): Promise<Blob>;
    partial(objectName: string, offset: number, length?: number): Promise<Readable>;
    remove(objectName: string): Promise<void>;
}
export declare function createStorageClient(filesUrl: string, uploadUrl: string, token: string, workspace: WorkspaceUuid): StorageClient;
export declare function connectStorage(url: string, options: AuthOptions, config?: ServerConfig): Promise<StorageClient>;
//# sourceMappingURL=client.d.ts.map