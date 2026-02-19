import type { Class, SpaceType, SpaceTypeDescriptor } from '@hcengineering/core';
import type { IntlString } from '@hcengineering/platform';
import type { AnyComponent } from '@hcengineering/ui';
/**
 * @public
 *
 * A mixin describing various configurations of a space type editor
 */
export interface SpaceTypeEditor extends Class<SpaceType> {
    sections: SpaceTypeEditorSection[];
    subEditors?: Record<string, AnyComponent>;
}
/**
 * @public
 *
 * Describes one space type editor section
 */
export interface SpaceTypeEditorSection {
    id: string;
    label: IntlString;
    component: AnyComponent;
    withoutContainer?: boolean;
}
/**
 * @public
 *
 * A mixin for extensions during space type creation
 */
export interface SpaceTypeCreator extends Class<SpaceTypeDescriptor> {
    extraComponent: AnyComponent;
}
//# sourceMappingURL=spaceTypeEditor.d.ts.map