import { Class, Doc, Ref } from '@hcengineering/core';
import { MarkupNode } from '../markup/model';
/**
 * @public
 */
export interface Reference {
    objectId: Ref<Doc>;
    objectClass: Ref<Class<Doc>>;
    parentNode: MarkupNode | null;
}
/**
 * @public
 */
export declare function extractReferences(content: MarkupNode): Array<Reference>;
//# sourceMappingURL=reference.d.ts.map