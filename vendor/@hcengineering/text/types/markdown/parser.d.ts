import { Extensions } from '@tiptap/core';
import MarkdownIt, { type Token } from 'markdown-it';
import type { RuleCore } from 'markdown-it/lib/parser_core';
import { Attrs, AttrValue, MarkupMark, MarkupMarkType, MarkupNode, MarkupNodeType } from '@hcengineering/text-core';
interface StateElement {
    type: MarkupNodeType;
    content: MarkupNode[];
    attrs: Attrs;
}
declare class MarkdownParseState {
    readonly refUrl: string;
    readonly imageUrl: string;
    stack: StateElement[];
    marks: MarkupMark[];
    tokenHandlers: Record<string, (state: MarkdownParseState, tok: Token) => void>;
    constructor(tokenHandlers: Record<string, (state: MarkdownParseState, tok: Token) => void>, refUrl: string, imageUrl: string);
    top(): StateElement | undefined;
    push(elt: MarkupNode): void;
    mergeWithLast(nodes: MarkupNode[], node: MarkupNode): boolean;
    addText(text?: string): void;
    addAttr(key: string, value: AttrValue): void;
    openMark(mark: MarkupMark): void;
    closeMark(mark: MarkupMarkType): void;
    parseTokens(toks: Token[] | null): void;
    addNode(type: MarkupNodeType, attrs: Attrs, content?: MarkupNode[]): MarkupNode;
    openNode(type: MarkupNodeType, attrs: Attrs): void;
    closeNode(): MarkupNode;
}
export declare const isInlineToken: (token?: Token) => boolean;
export declare const isParagraphToken: (token?: Token) => boolean;
export declare const isListItemToken: (token?: Token) => boolean;
export interface TaskListEnv {
    tasklists: number;
}
export declare class MarkdownParser {
    readonly extensions: Extensions;
    readonly refUrl: string;
    readonly imageUrl: string;
    tokenizer: MarkdownIt;
    tokenHandlers: Record<string, (state: MarkdownParseState, tok: Token) => void>;
    constructor(extensions: Extensions, refUrl: string, imageUrl: string);
    parse(text: string): MarkupNode;
    htmlCommentRule: RuleCore;
    listRule: RuleCore;
}
export {};
//# sourceMappingURL=parser.d.ts.map