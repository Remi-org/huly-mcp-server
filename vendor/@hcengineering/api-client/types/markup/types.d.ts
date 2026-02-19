import { Class, type Blob, type Doc, type Ref } from '@hcengineering/core';
/** @public */
export type MarkupRef = Ref<Blob>;
/** @public */
export type MarkupFormat = 'markup' | 'html' | 'markdown';
/** @public */
export declare class MarkupContent {
    readonly content: string;
    readonly kind: MarkupFormat;
    constructor(content: string, kind: MarkupFormat);
}
/** @public */
export declare function html(content: string): MarkupContent;
/** @public */
export declare function markdown(content: string): MarkupContent;
/**
 * Provides operations for managing markup (rich-text) content.
 * @public */
export interface MarkupOperations {
    /**
     * Retrieves markup content for a specified document object
     * * @param objectClass - Reference to the class of the document containing the markup
     * @param objectId - Reference to the document containing the markup
     * @param objectAttr - The attribute/field name where the markup is stored
     * @param id - Unique reference identifying the specific markup content
     * @param format - The format of the markup (e.g., HTML, Markdown, etc.)
     * @returns Promise containing the markup content as a string
     */
    fetchMarkup: (objectClass: Ref<Class<Doc>>, objectId: Ref<Doc>, objectAttr: string, id: MarkupRef, format: MarkupFormat) => Promise<string>;
    /**
     * Saves markup content for a document object
     * @param objectClass - Reference to the class of the document where markup should be stored
     * @param objectId - Reference to the document where markup should be stored
     * @param objectAttr - The attribute/field name where markup should be saved
     * @param markup - The actual markup content to be uploaded
     * @param format - The format of the provided markup (e.g., HTML, Markdown, etc.)
     * @returns Promise containing a reference to the newly saved markup
     */
    uploadMarkup: (objectClass: Ref<Class<Doc>>, objectId: Ref<Doc>, objectAttr: string, markup: string, format: MarkupFormat) => Promise<MarkupRef>;
}
//# sourceMappingURL=types.d.ts.map