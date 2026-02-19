/** @public */
export declare enum MarkupNodeType {
    doc = "doc",
    paragraph = "paragraph",
    blockquote = "blockquote",
    horizontal_rule = "horizontalRule",
    heading = "heading",
    code_block = "codeBlock",
    text = "text",
    image = "image",
    file = "file",
    reference = "reference",
    hard_break = "hardBreak",
    ordered_list = "orderedList",
    bullet_list = "bulletList",
    list_item = "listItem",
    taskList = "taskList",
    taskItem = "taskItem",
    todoList = "todoList",
    todoItem = "todoItem",
    subLink = "subLink",
    table = "table",
    table_row = "tableRow",
    table_cell = "tableCell",
    table_header = "tableHeader",
    mermaid = "mermaid",
    comment = "comment",
    markdown = "markdown"
}
/** @public */
export declare enum MarkupMarkType {
    link = "link",
    em = "italic",
    bold = "bold",
    code = "code",
    strike = "strike",
    underline = "underline"
}
/** @public */
export interface MarkupMark {
    type: MarkupMarkType;
    attrs: Record<string, any>;
}
export type AttrValue = string | number | boolean;
export type Attrs = Record<string, AttrValue>;
/** @public */
export interface MarkupNode {
    type: MarkupNodeType;
    content?: MarkupNode[];
    marks?: MarkupMark[];
    attrs?: Attrs;
    text?: string;
}
/** @public */
export declare function emptyMarkupNode(): MarkupNode;
/** @public */
export interface LinkMark extends MarkupMark {
    href: string;
    title: string;
}
/** @public */
export interface ReferenceMarkupNode extends MarkupNode {
    type: MarkupNodeType.reference;
    attrs: {
        id: string;
        label: string;
        objectclass: string;
    };
}
//# sourceMappingURL=model.d.ts.map