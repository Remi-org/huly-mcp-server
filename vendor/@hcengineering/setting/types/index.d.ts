import type { Account, AccountRole, Blob, Class, Configuration, Doc, Mixin, Ref } from '@hcengineering/core';
import type { Metadata, Plugin } from '@hcengineering/platform';
import { Asset, IntlString, Resource } from '@hcengineering/platform';
import { TemplateField, TemplateFieldCategory } from '@hcengineering/templates';
import { AnyComponent } from '@hcengineering/ui';
import { SpaceTypeCreator, SpaceTypeEditor } from './spaceTypeEditor';
export * from './spaceTypeEditor';
export * from './utils';
export * from './analytics';
/**
 * @public
 */
export type Handler = Resource<(value: string) => Promise<void>>;
/**
 * @public
 */
export interface IntegrationType extends Doc {
    label: IntlString;
    description: IntlString;
    descriptionComponent?: AnyComponent;
    icon: AnyComponent;
    allowMultiple: boolean;
    createComponent?: AnyComponent;
    onDisconnect?: Handler;
    reconnectComponent?: AnyComponent;
    configureComponent?: AnyComponent;
}
/**
 * @public
 */
export interface Integration extends Doc {
    type: Ref<IntegrationType>;
    disabled: boolean;
    value: string;
    error?: IntlString | null;
    shared?: Ref<Account>[];
}
/**
 * @public
 */
export interface Editable extends Class<Doc> {
    value: boolean;
}
/**
 * @public
 *
 * Mixin to allow delete of Custom classes.
 */
export interface UserMixin extends Class<Doc> {
}
/**
 * @public
 */
export interface SettingsCategory extends Doc {
    name: string;
    label: IntlString;
    icon: Asset;
    component: AnyComponent;
    props?: Record<string, any>;
    extraComponents?: Record<string, AnyComponent>;
    group?: string;
    order?: number;
    role: AccountRole;
    expandable?: boolean;
    adminOnly?: boolean;
}
/**
 * @public
 */
export interface InviteSettings extends Configuration {
    expirationTime: number;
    emailMask: string;
    limit: number;
}
/**
 * @public
 */
export interface WorkspaceSetting extends Doc {
    icon?: Ref<Blob> | null;
}
/**
 * @public
 */
export declare const settingId: Plugin;
declare const _default: {
    ids: {
        SettingApp: Ref<Doc<import("@hcengineering/core").Space>>;
        Profile: Ref<Doc<import("@hcengineering/core").Space>>;
        Password: Ref<Doc<import("@hcengineering/core").Space>>;
        Setting: Ref<Doc<import("@hcengineering/core").Space>>;
        Integrations: Ref<Doc<import("@hcengineering/core").Space>>;
        Relations: Ref<Doc<import("@hcengineering/core").Space>>;
        Support: Ref<Doc<import("@hcengineering/core").Space>>;
        Privacy: Ref<Doc<import("@hcengineering/core").Space>>;
        Terms: Ref<Doc<import("@hcengineering/core").Space>>;
        ClassSetting: Ref<Doc<import("@hcengineering/core").Space>>;
        General: Ref<Doc<import("@hcengineering/core").Space>>;
        Owners: Ref<Doc<import("@hcengineering/core").Space>>;
        InviteSettings: Ref<Doc<import("@hcengineering/core").Space>>;
        WorkspaceSetting: Ref<Doc<import("@hcengineering/core").Space>>;
        ManageSpaces: Ref<Doc<import("@hcengineering/core").Space>>;
        Spaces: Ref<Doc<import("@hcengineering/core").Space>>;
        Backup: Ref<Doc<import("@hcengineering/core").Space>>;
        Export: Ref<Doc<import("@hcengineering/core").Space>>;
        DisablePermissionsConfiguration: Ref<Configuration>;
    };
    mixin: {
        Editable: Ref<Mixin<Editable>>;
        UserMixin: Ref<Mixin<UserMixin>>;
        SpaceTypeEditor: Ref<Mixin<SpaceTypeEditor>>;
        SpaceTypeCreator: Ref<Mixin<SpaceTypeCreator>>;
    };
    class: {
        SettingsCategory: Ref<Class<SettingsCategory>>;
        WorkspaceSettingCategory: Ref<Class<SettingsCategory>>;
        Integration: Ref<Class<Integration>>;
        IntegrationType: Ref<Class<IntegrationType>>;
        InviteSettings: Ref<Class<InviteSettings>>;
        WorkspaceSetting: Ref<Class<WorkspaceSetting>>;
    };
    component: {
        Settings: AnyComponent;
        Profile: AnyComponent;
        Password: AnyComponent;
        WorkspaceSettings: AnyComponent;
        Integrations: AnyComponent;
        Support: AnyComponent;
        Privacy: AnyComponent;
        Terms: AnyComponent;
        ClassSetting: AnyComponent;
        PermissionPresenter: AnyComponent;
        SpaceTypeDescriptorPresenter: AnyComponent;
        SpaceTypeGeneralSectionEditor: AnyComponent;
        SpaceTypePropertiesSectionEditor: AnyComponent;
        SpaceTypeRolesSectionEditor: AnyComponent;
        RoleEditor: AnyComponent;
        RoleAssignmentEditor: AnyComponent;
        RelationSetting: AnyComponent;
        Backup: AnyComponent;
        CreateAttributePopup: AnyComponent;
        CreateRelation: AnyComponent;
        EditRelation: AnyComponent;
    };
    string: {
        Settings: IntlString;
        Setting: IntlString;
        Spaces: IntlString;
        WorkspaceSettings: IntlString;
        Integrations: IntlString;
        Support: IntlString;
        Privacy: IntlString;
        Terms: IntlString;
        Categories: IntlString;
        Delete: IntlString;
        Disconnect: IntlString;
        Add: IntlString;
        AccountSettings: IntlString;
        ChangePassword: IntlString;
        CurrentPassword: IntlString;
        NewPassword: IntlString;
        Saving: IntlString;
        Saved: IntlString;
        EnterCurrentPassword: IntlString;
        EnterNewPassword: IntlString;
        RepeatNewPassword: IntlString;
        Signout: IntlString;
        InviteWorkspace: IntlString;
        SelectWorkspace: IntlString;
        Reconnect: IntlString;
        ClassSetting: IntlString;
        Classes: IntlString;
        Owners: IntlString;
        Configure: IntlString;
        InviteSettings: IntlString;
        General: IntlString;
        Properties: IntlString;
        TaskTypes: IntlString;
        Automations: IntlString;
        Collections: IntlString;
        SpaceTypes: IntlString;
        Roles: IntlString;
        OwnerOrMaintainerRequired: IntlString;
        Backup: IntlString;
        BackupLast: IntlString;
        BackupTotalSnapshots: IntlString;
        BackupTotalFiles: IntlString;
        BackupSize: IntlString;
        BackupLinkInfo: IntlString;
        BackupBearerTokenInfo: IntlString;
        BackupSnapshots: IntlString;
        BackupFileDownload: IntlString;
        BackupFiles: IntlString;
        BackupNoBackup: IntlString;
        AddAttribute: IntlString;
    };
    icon: {
        AccountSettings: Asset;
        Owners: Asset;
        Password: Asset;
        Setting: Asset;
        Integrations: Asset;
        Support: Asset;
        Privacy: Asset;
        Terms: Asset;
        Signout: Asset;
        SelectWorkspace: Asset;
        Clazz: Asset;
        Enums: Asset;
        InviteSettings: Asset;
        InviteWorkspace: Asset;
        Views: Asset;
        Relations: Asset;
    };
    templateFieldCategory: {
        Integration: Ref<TemplateFieldCategory>;
    };
    templateField: {
        OwnerFirstName: Ref<TemplateField>;
        OwnerLastName: Ref<TemplateField>;
        OwnerPosition: Ref<TemplateField>;
        Value: Ref<TemplateField>;
    };
    metadata: {
        BackupUrl: Metadata<string>;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map