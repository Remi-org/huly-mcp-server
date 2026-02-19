import { Node } from '@tiptap/core';
import { Class, Doc, Ref } from '@hcengineering/core';
export interface ReferenceNodeProps {
    id: Ref<Doc>;
    objectclass: Ref<Class<Doc>>;
    label: string;
}
export interface ReferenceOptions {
    renderLabel: (props: {
        options: ReferenceOptions;
        props: ReferenceNodeProps;
    }) => string;
    suggestion: {
        char?: string;
    };
    HTMLAttributes: Record<string, any>;
}
/**
 * @public
 */
export declare const ReferenceNode: Node<ReferenceOptions, any>;
//# sourceMappingURL=reference.d.ts.map