import { MarkupNode } from '@hcengineering/text-core';
import { Extensions } from '@tiptap/core';
/**
 * @public
 */
export declare function parseMessageMarkdown(message: string | undefined, imageUrl: string, refUrl?: string, extensions?: Extensions): MarkupNode;
/**
 * @public
 */
export declare function serializeMessage(node: MarkupNode, refUrl: string, imageUrl: string): string;
/**
 * @public
 */
export declare function markupToMarkdown(markup: string, refUrl?: string, imageUrl?: string, preprocessor?: (nodes: MarkupNode) => Promise<void>): Promise<string>;
//# sourceMappingURL=index.d.ts.map