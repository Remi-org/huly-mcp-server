import { Extension } from '@tiptap/core';
import type { CodeBlockOptions } from '@tiptap/extension-code-block';
import type { CodeOptions } from '@tiptap/extension-code';
import { Level } from '@tiptap/extension-heading';
export interface DefaultKitOptions {
    codeBlock?: Partial<CodeBlockOptions> | false;
    code?: Partial<CodeOptions> | false;
    heading?: {
        levels?: Level[];
    };
    history?: false;
}
export declare const DefaultKit: Extension<DefaultKitOptions, any>;
//# sourceMappingURL=default-kit.d.ts.map