import { MarkupMark, MarkupNode } from './model';
export declare function traverseNode(node: MarkupNode, fn: (el: MarkupNode, parent: MarkupNode | undefined) => boolean | undefined): void;
export declare function traverseNodeMarks(node: MarkupNode, f: (el: MarkupMark) => void): void;
export declare function traverseNodeContent(node: MarkupNode, f: (el: MarkupNode) => void): void;
export declare function traverseAllMarks(node: MarkupNode, f: (el: MarkupNode, mark: MarkupMark) => void): void;
//# sourceMappingURL=traverse.d.ts.map