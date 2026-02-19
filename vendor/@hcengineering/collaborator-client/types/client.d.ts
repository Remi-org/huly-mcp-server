import { Blob, CollaborativeDoc, Markup, MarkupBlobRef, Ref, WorkspaceId } from '@hcengineering/core';
/** @public */
export interface GetContentRequest {
    source?: Ref<Blob>;
}
/** @public */
export interface GetContentResponse {
    content: Record<string, Markup>;
}
/** @public */
export interface CreateContentRequest {
    content: Record<string, Markup>;
}
/** @public */
export interface CreateContentResponse {
    content: Record<string, MarkupBlobRef>;
}
/** @public */
export interface UpdateContentRequest {
    content: Record<string, Markup>;
}
/** @public */
export interface UpdateContentResponse {
}
/** @public */
export interface CollaboratorClient {
    getMarkup: (document: CollaborativeDoc, source?: Ref<Blob> | null) => Promise<Markup>;
    createMarkup: (document: CollaborativeDoc, markup: Markup) => Promise<MarkupBlobRef>;
    updateMarkup: (document: CollaborativeDoc, markup: Markup) => Promise<void>;
    copyContent: (source: CollaborativeDoc, target: CollaborativeDoc) => Promise<void>;
}
/** @public */
export declare function getClient(workspaceId: WorkspaceId, token: string, collaboratorUrl: string): CollaboratorClient;
//# sourceMappingURL=client.d.ts.map