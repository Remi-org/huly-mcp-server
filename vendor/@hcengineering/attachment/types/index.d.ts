import type { AttachedDoc, Blob, BlobMetadata, Class, Doc, Ref } from '@hcengineering/core';
import type { Asset, Plugin } from '@hcengineering/platform';
import { IntlString, Resource } from '@hcengineering/platform';
import type { Preference } from '@hcengineering/preference';
import { AnyComponent } from '@hcengineering/ui';
import { Widget } from '@hcengineering/workbench';
export * from './analytics';
/**
 * @public
 */
export interface Attachment extends AttachedDoc {
    name: string;
    file: Ref<Blob>;
    size: number;
    type: string;
    lastModified: number;
    description?: string;
    pinned?: boolean;
    readonly?: boolean;
    metadata?: AttachmentMetadata;
}
/**
 * @public
 */
export interface Embedding extends Attachment {
}
/**
 * @public
 */
export type AttachmentMetadata = BlobMetadata;
/**
 * @public
 */
export interface Photo extends Attachment {
}
/**
 * @public
 */
export interface SavedAttachments extends Preference {
    attachedTo: Ref<Attachment>;
}
/**
 * @public
 */
export interface Drawing extends Doc {
    parent: Ref<Doc>;
    parentClass: Ref<Class<Doc>>;
    content?: string;
}
/**
 * @public
 */
export declare const attachmentId: Plugin;
declare const _default: {
    component: {
        Attachments: AnyComponent;
        Photos: AnyComponent;
        AttachmentsPresenter: AnyComponent;
        DrawingPresenter: AnyComponent;
        FileBrowser: AnyComponent;
        PDFViewer: AnyComponent;
    };
    icon: {
        Attachment: Asset;
        FileBrowser: Asset;
    };
    class: {
        Attachment: Ref<Class<Attachment>>;
        Embedding: Ref<Class<Embedding>>;
        Drawing: Ref<Class<Drawing>>;
        Photo: Ref<Class<Photo>>;
        SavedAttachments: Ref<Class<SavedAttachments>>;
    };
    helper: {
        UploadFile: Resource<(file: File) => Promise<Ref<Blob>>>;
        DeleteFile: Resource<(id: string) => Promise<void>>;
    };
    ids: {
        PreviewWidget: Ref<Widget>;
    };
    string: {
        Files: IntlString;
        NoFiles: IntlString;
        NoParticipants: IntlString;
        ShowMoreAttachments: IntlString;
        FileBrowserDateFilterAny: IntlString;
        FileBrowserDateFilterToday: IntlString;
        FileBrowserDateFilterYesterday: IntlString;
        FileBrowserDateFilter7Days: IntlString;
        FileBrowserDateFilter30Days: IntlString;
        FileBrowserDateFilter3Months: IntlString;
        FileBrowserDateFilter12Months: IntlString;
        FileBrowserTypeFilterAny: IntlString;
        FileBrowserTypeFilterImages: IntlString;
        FileBrowserTypeFilterAudio: IntlString;
        FileBrowserTypeFilterVideos: IntlString;
        FileBrowserTypeFilterPDFs: IntlString;
        DeleteFile: IntlString;
        Attachments: IntlString;
        FileBrowser: IntlString;
        OpenInWindow: IntlString;
        Embeddings: IntlString;
        UploadDropFilesHere: IntlString;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map