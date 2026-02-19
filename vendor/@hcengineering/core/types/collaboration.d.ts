import type { Blob, Class, Doc, MarkupBlobRef, Ref } from './classes';
/** @public */
export interface CollaborativeDoc {
    objectClass: Ref<Class<Doc>>;
    objectId: Ref<Doc>;
    objectAttr: string;
}
/** @public */
export declare function makeCollabId<T extends Doc, U extends keyof T>(objectClass: Ref<Class<T>>, objectId: Ref<T>, objectAttr: Extract<U, string> | string): CollaborativeDoc;
/** @public */
export declare function makeDocCollabId<T extends Doc, U extends keyof T>(doc: T, objectAttr: Extract<U, string> | string): CollaborativeDoc;
/** @public */
export declare function makeCollabYdocId(doc: CollaborativeDoc): Ref<Blob>;
/** @public */
export declare function makeCollabJsonId(doc: CollaborativeDoc): MarkupBlobRef;
//# sourceMappingURL=collaboration.d.ts.map