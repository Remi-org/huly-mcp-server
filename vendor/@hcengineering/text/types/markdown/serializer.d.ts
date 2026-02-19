import { MarkupMark, MarkupNode } from '@hcengineering/text-core';
type FirstDelim = (i: number, attrs?: Record<string, any>, parentAttrs?: Record<string, any>) => string;
interface IState {
    wrapBlock: (delim: string, firstDelim: string | null, node: MarkupNode, f: () => void) => void;
    flushClose: (size: number) => void;
    atBlank: () => void;
    ensureNewLine: () => void;
    write: (content: string) => void;
    closeBlock: (node: any) => void;
    text: (text: string, escape?: boolean) => void;
    render: (node: MarkupNode, parent: MarkupNode, index: number) => void;
    renderContent: (parent: MarkupNode) => void;
    renderInline: (parent: MarkupNode) => void;
    renderList: (node: MarkupNode, delim: string, firstDelim: FirstDelim) => void;
    esc: (str: string, startOfLine?: boolean) => string;
    quote: (str: string) => string;
    repeat: (str: string, n: number) => string;
    markString: (mark: MarkupMark, open: boolean, parent: MarkupNode, index: number) => string;
    refUrl: string;
    imageUrl: string;
    inAutolink?: boolean;
    renderAHref?: boolean;
}
type NodeProcessor = (state: IState, node: MarkupNode, parent: MarkupNode, index: number) => void;
interface InlineState {
    active: MarkupMark[];
    trailing: string;
    parent: MarkupNode;
    node?: MarkupNode;
    marks: MarkupMark[];
}
export declare const storeNodes: Record<string, NodeProcessor>;
interface MarkProcessor {
    open: ((_state: IState, mark: MarkupMark, parent: MarkupNode, index: number) => string) | string;
    close: ((_state: IState, mark: MarkupMark, parent: MarkupNode, index: number) => string) | string;
    mixable: boolean;
    expelEnclosingWhitespace: boolean;
    escape: boolean;
}
export declare const storeMarks: Record<string, MarkProcessor>;
export interface StateOptions {
    tightLists: boolean;
    refUrl: string;
    imageUrl: string;
}
export declare class MarkdownState implements IState {
    nodes: Record<string, NodeProcessor>;
    marks: Record<string, MarkProcessor>;
    delim: string;
    out: string;
    closed: boolean;
    closedNode?: MarkupNode;
    inTightList: boolean;
    options: StateOptions;
    refUrl: string;
    imageUrl: string;
    constructor(nodes?: Record<string, NodeProcessor>, marks?: Record<string, MarkProcessor>, options?: StateOptions);
    flushClose(size: number): void;
    private addDelim;
    wrapBlock(delim: string, firstDelim: string | null, node: MarkupNode, f: () => void): void;
    atBlank(): boolean;
    ensureNewLine(): void;
    write(content: string): void;
    closeBlock(node: MarkupNode): void;
    text(text: string, escape?: boolean): void;
    render(node: MarkupNode, parent: MarkupNode, index: number): void;
    renderContent(parent: MarkupNode): void;
    reorderMixableMark(state: InlineState, mark: MarkupMark, i: number, len: number): void;
    reorderMixableMarks(state: InlineState, len: number): void;
    private checkSwitchMarks;
    private switchMarks;
    renderNodeInline(state: InlineState, index: number): void;
    private checkOpenMarks;
    private isNoEscapeRequire;
    private renderMarkText;
    private updateActiveMarks;
    private checkCloseMarks;
    private adjustLeading;
    private isMarksHasExpelEnclosingWhitespace;
    private adjustLeadingTextNode;
    private updateHardBreakMarks;
    private filterHardBreakMarks;
    private isHardbreakText;
    private isText;
    renderInline(parent: MarkupNode): void;
    renderList(node: MarkupNode, delim: string, firstDelim: FirstDelim): void;
    renderListItem(node: MarkupNode, child: MarkupNode, i: number, isTight: boolean, delim: string, firstDelim: FirstDelim): void;
    private flushListClose;
    esc(str: string, startOfLine?: boolean): string;
    quote(str: string): string;
    repeat(str: string, n: number): string;
    markString(mark: MarkupMark, open: boolean, parent: MarkupNode, index: number): string;
}
export {};
//# sourceMappingURL=serializer.d.ts.map