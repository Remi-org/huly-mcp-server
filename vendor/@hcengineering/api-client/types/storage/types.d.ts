import { Blob } from '@hcengineering/core';
import { Readable } from 'stream';
export interface StorageClient {
    stat: (objectName: string) => Promise<Blob | undefined>;
    get: (objectName: string) => Promise<Readable>;
    put: (objectName: string, stream: Readable | Buffer | string, contentType: string, size?: number) => Promise<Blob>;
    partial: (objectName: string, offset: number, length?: number) => Promise<Readable>;
    remove: (objectName: string) => Promise<void>;
}
//# sourceMappingURL=types.d.ts.map