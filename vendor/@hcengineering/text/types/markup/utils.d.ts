import { Markup } from '@hcengineering/core';
import { Editor, Extensions } from '@tiptap/core';
import { Node as ProseMirrorNode, Schema } from '@tiptap/pm/model';
import { MarkupNode } from '@hcengineering/text-core';
/** @public */
export declare function getMarkup(editor?: Editor): Markup;
/** @public */
export declare function pmNodeToMarkup(node: ProseMirrorNode): Markup;
/** @public */
export declare function markupToPmNode(markup: Markup, schema?: Schema, extensions?: Extensions): ProseMirrorNode;
/** @public */
export declare function markupHtmlToJSON(markup: Markup): MarkupNode;
/** @public */
export declare function jsonToPmNode(json: MarkupNode, schema?: Schema, extensions?: Extensions): ProseMirrorNode;
/** @public */
export declare function pmNodeToJSON(node: ProseMirrorNode): MarkupNode;
/** @public */
export declare function jsonToText(node: MarkupNode, schema?: Schema, extensions?: Extensions): string;
/** @public */
export declare function pmNodeToText(node: ProseMirrorNode): string;
/** @public */
export declare function htmlToMarkup(html: string, extensions?: Extensions): Markup;
/** @public */
export declare function htmlToJSON(html: string, extensions?: Extensions): MarkupNode;
/** @public */
export declare function jsonToHTML(json: MarkupNode, extensions?: Extensions): string;
/** @public */
export declare function htmlToPmNode(html: string, schema?: Schema, extensions?: Extensions): ProseMirrorNode;
/** @public */
export declare function pmNodeToHTML(node: ProseMirrorNode, extensions?: Extensions): string;
//# sourceMappingURL=utils.d.ts.map