import { MarkupMark, MarkupMarkType, MarkupNode } from '@hcengineering/text-core';
export declare function traverseMarks(node: MarkupNode, f: (el: MarkupMark) => void): void;
export declare function markAttrs(mark: MarkupMark): Record<string, string>;
export declare function isInSet(mark: MarkupMark, marks: MarkupMark[]): boolean;
export declare function addToSet(mark: MarkupMark, marks: MarkupMark[]): MarkupMark[];
export declare function removeFromSet(markType: MarkupMarkType, marks: MarkupMark[]): MarkupMark[];
export declare function sameSet(a?: MarkupMark[], b?: MarkupMark[]): boolean;
export declare function markEq(first: MarkupMark, other: MarkupMark): boolean;
//# sourceMappingURL=marks.d.ts.map