import { Extension } from '@tiptap/core';
import { FileOptions } from '../nodes/file';
import { ImageOptions } from '../nodes/image';
import { DefaultKitOptions } from './default-kit';
export interface ServerKitOptions extends DefaultKitOptions {
    file: Partial<FileOptions> | false;
    image: Partial<ImageOptions> | false;
}
export declare const ServerKit: Extension<ServerKitOptions, any>;
//# sourceMappingURL=server-kit.d.ts.map