import { MarkupNode } from './model';
export declare function nodeDoc(...content: MarkupNode[]): MarkupNode;
export declare function nodeParagraph(...content: MarkupNode[]): MarkupNode;
export declare function nodeText(text: string): MarkupNode;
export declare function nodeImage(attrs: {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
}): MarkupNode;
export declare function nodeReference(attrs: {
    id: string;
    label: string;
    objectclass: string;
}): MarkupNode;
export declare function markBold(node: MarkupNode): MarkupNode;
export declare function markCode(node: MarkupNode): MarkupNode;
export declare function markItalic(node: MarkupNode): MarkupNode;
export declare function markStrike(node: MarkupNode): MarkupNode;
export declare function markUnderline(node: MarkupNode): MarkupNode;
export declare function markLink(attrs: {
    href: string;
    title: string;
}, node: MarkupNode): MarkupNode;
//# sourceMappingURL=dsl.d.ts.map