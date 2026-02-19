import type { Class, Doc, Markup, Ref, Space } from '@hcengineering/core';
import type { IntlString, Plugin, Resource, Asset } from '@hcengineering/platform';
import { type AnyComponent } from '@hcengineering/ui/src/types';
/**
 * @public
 */
export interface TemplateCategory extends Space {
}
/**
 * @public
 */
export interface MessageTemplate extends Doc {
    space: Ref<TemplateCategory>;
    title: string;
    message: Markup;
}
/**
 * @public
 */
export interface TemplateData {
    owner: string;
    data: any;
}
/**
 * @public
 */
export interface TemplateDataProvider {
    set: (key: Ref<Class<Doc>>, value: any) => void;
    get: (key: Ref<Class<Doc>>) => any | undefined;
    fillTemplate: (message: string) => Promise<string>;
    destroy: () => void;
}
/**
 * @public
 */
export interface TemplateFieldCategory extends Doc {
    label: IntlString;
}
/**
 * @public
 */
export declare type TemplateFieldFunc = (provider: TemplateDataProvider) => Promise<string | undefined>;
/**
 * @public
 */
export interface TemplateField extends Doc {
    category: Ref<TemplateFieldCategory>;
    label: IntlString;
    func: Resource<TemplateFieldFunc>;
}
export declare const templateFieldRegexp: RegExp;
/**
 * @public
 */
export declare const templatesId: Plugin;
declare const _default: {
    class: {
        MessageTemplate: Ref<Class<MessageTemplate>>;
        TemplateCategory: Ref<Class<TemplateCategory>>;
        TemplateField: Ref<Class<TemplateField>>;
        TemplateFieldCategory: Ref<Class<TemplateFieldCategory>>;
    };
    component: {
        TemplatePopup: AnyComponent;
    };
    string: {
        Template: IntlString;
    };
    space: {
        Templates: Ref<TemplateCategory>;
    };
    icon: {
        Templates: Asset;
        Template: Asset;
        Copy: Asset;
    };
    function: {
        GetTemplateDataProvider: Resource<() => TemplateDataProvider>;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map