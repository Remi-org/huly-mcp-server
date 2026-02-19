import { CollaborativeDoc } from '@hcengineering/core';
/** @public */
export declare function encodeDocumentId(workspaceId: string, documentId: CollaborativeDoc): string;
/** @public */
export declare function decodeDocumentId(documentId: string): {
    workspaceId: string;
    documentId: CollaborativeDoc;
};
//# sourceMappingURL=utils.d.ts.map