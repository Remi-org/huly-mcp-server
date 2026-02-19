import type { AttachedDoc, Class, Doc, Ref } from '@hcengineering/core';
import type { Asset, IntlString, Plugin } from '@hcengineering/platform';
import { AnyComponent } from '@hcengineering/ui';
import { FilterMode } from '@hcengineering/view';
export * from './analytics';
/**
 * @public
 */
export interface TagElement extends Doc {
    title: string;
    targetClass: Ref<Class<Doc>>;
    description: string;
    color: number;
    category: Ref<TagCategory>;
    refCount?: number;
}
/**
 * @public
 */
export type InitialKnowledge = 0 | 1 | 2;
/**
 * @public
 */
export type MeaningfullKnowledge = 3 | 4 | 5;
/**
 * @public
 */
export type ExpertKnowledge = 6 | 7 | 8;
/**
 * @public
 */
export interface TagReference extends AttachedDoc {
    tag: Ref<TagElement>;
    title: string;
    color: number;
    weight?: InitialKnowledge | MeaningfullKnowledge | ExpertKnowledge;
}
/**
 * Defined set of skills per category.
 *
 * Will be used as skill category templates or category detection
 * @public
 */
export interface TagCategory extends Doc {
    icon: Asset;
    label: string;
    targetClass: Ref<Class<Doc>>;
    tags: string[];
    default: boolean;
}
/**
 * @public
 */
export declare const tagsId: Plugin;
/**
 * @public
 */
declare const tagsPlugin: {
    class: {
        TagElement: Ref<Class<TagElement>>;
        TagReference: Ref<Class<TagReference>>;
        TagCategory: Ref<Class<TagCategory>>;
    };
    icon: {
        Tags: Asset;
        Level1: Asset;
        Level2: Asset;
        Level3: Asset;
    };
    component: {
        DraftTagsEditor: AnyComponent;
        DocTagsEditor: AnyComponent;
        TagsView: AnyComponent;
        TagsEditor: AnyComponent;
        TagsDropdownEditor: AnyComponent;
        TagsCategoryBar: AnyComponent;
        TagsAttributeEditor: AnyComponent;
        TagsPresenter: AnyComponent;
        LabelsPresenter: AnyComponent;
        TagElementPresenter: AnyComponent;
        TagsEditorPopup: AnyComponent;
        ObjectsTagsEditorPopup: AnyComponent;
    };
    string: {
        Tags: IntlString;
        AddLabel: IntlString;
        TagLabel: IntlString;
    };
    category: {
        NoCategory: Ref<TagCategory>;
    };
    filter: {
        FilterTagsIn: Ref<FilterMode>;
        FilterTagsNin: Ref<FilterMode>;
    };
};
/**
 * @public
 */
export default tagsPlugin;
/**
 * @public
 */
export declare function findTagCategory(title: string, categories: TagCategory[]): Ref<TagCategory>;
//# sourceMappingURL=index.d.ts.map