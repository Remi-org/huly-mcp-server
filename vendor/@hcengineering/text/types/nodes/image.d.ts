import type { Blob, Ref } from '@hcengineering/core';
import { Node } from '@tiptap/core';
/**
 * @public
 */
export interface ImageOptions {
    inline: boolean;
    HTMLAttributes: Record<string, any>;
    loadingImgSrc?: string;
    getBlobRef: (fileId: Ref<Blob>, filename?: string, size?: number) => Promise<{
        src: string;
        srcset: string;
    }>;
}
/**
 * @public
 */
export declare const ImageNode: Node<ImageOptions, any>;
//# sourceMappingURL=image.d.ts.map