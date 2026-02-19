import { Markup } from '@hcengineering/core';
import { MarkupMark, MarkupNode } from './model';
/** @public */
export declare const EmptyMarkup: Markup;
/** @public */
export declare function isEmptyMarkup(markup: Markup | undefined): boolean;
/** @public */
export declare function areEqualMarkups(markup1: Markup, markup2: Markup): boolean;
/** @public */
export declare function areEqualJson(json1: MarkupNode, json2: MarkupNode): boolean;
export declare function equalMarks(a: MarkupMark, b: MarkupMark): boolean;
/** @public */
export declare function isEmptyNode(node: MarkupNode): boolean;
/** @public */
export declare function jsonToMarkup(json: MarkupNode): Markup;
/** @public */
export declare function markupToJSON(markup: Markup): MarkupNode;
/** @public */
export declare function stripTags(markup: Markup, textLimit?: number): string;
export declare function markupToHTML(markup: Markup): string;
export declare function markupToText(markup: Markup): string;
//# sourceMappingURL=utils.d.ts.map