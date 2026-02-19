import type { AccountRole, Class, Doc, Mixin, Obj, Ref, Space, Tx } from '@hcengineering/core';
import { DocNotifyContext, InboxNotification } from '@hcengineering/notification';
import type { Asset, IntlString, Metadata, Plugin, Resource } from '@hcengineering/platform';
import type { Preference } from '@hcengineering/preference';
import { AnyComponent, type AnySvelteComponent, ComponentExtensionId, Location, ResolvedLocation } from '@hcengineering/ui';
import { ViewAction } from '@hcengineering/view';
/**
 * @public
 */
export interface LocationData {
    objectId?: Ref<Doc>;
    objectClass?: Ref<Class<Doc>>;
    name?: string;
    nameIntl?: IntlString;
    icon?: Asset;
    iconComponent?: AnyComponent;
    iconProps?: Record<string, any>;
}
export interface Application extends Doc {
    label: IntlString;
    alias: string;
    icon: Asset;
    hidden: boolean;
    position?: 'top' | 'mid';
    navigatorModel?: NavigatorModel;
    locationResolver?: Resource<(loc: Location) => Promise<ResolvedLocation | undefined>>;
    locationDataResolver?: Resource<(loc: Location) => Promise<LocationData>>;
    component?: AnyComponent;
    navHeaderComponent?: AnyComponent;
    accessLevel?: AccountRole;
    navFooterComponent?: AnyComponent;
}
export declare enum WidgetType {
    Fixed = "fixed",// Fixed sidebar are always visible
    Flexible = "flexible",// Flexible sidebar are visible only in special cases (during the meeting, etc.)
    Configurable = "configurable "
}
export interface Widget extends Doc {
    label: IntlString;
    icon: Asset;
    type: WidgetType;
    component: AnyComponent;
    tabComponent?: AnyComponent;
    switcherComponent?: AnyComponent;
    headerLabel?: IntlString;
    closeIfNoTabs?: boolean;
    onTabClose?: Resource<(tab: WidgetTab) => Promise<void>>;
}
export interface WidgetPreference extends Preference {
    enabled: boolean;
}
export interface WidgetTab {
    id: string;
    name?: string;
    label?: IntlString;
    icon?: Asset | AnySvelteComponent;
    iconComponent?: AnyComponent;
    iconProps?: Record<string, any>;
    isPinned?: boolean;
    allowedPath?: string;
    objectId?: Ref<Doc>;
    objectClass?: Ref<Class<Doc>>;
    data?: Record<string, any>;
    readonly?: boolean;
}
export declare enum SidebarEvent {
    OpenWidget = "openWidget"
}
export interface OpenSidebarWidgetParams {
    widget: Ref<Widget>;
    tab?: WidgetTab;
}
export interface TxSidebarEvent<T extends Record<string, any> = Record<string, any>> extends Tx {
    event: SidebarEvent;
    params: T;
}
export interface WorkbenchTab extends Preference {
    location: string;
    isPinned: boolean;
    name?: string;
}
/**
 * @public
 */
export interface ApplicationNavModel extends Doc {
    extends: Ref<Application>;
    spaces?: SpacesNavModel[];
    specials?: SpecialNavModel[];
}
/**
 * @public
 */
export interface HiddenApplication extends Preference {
    attachedTo: Ref<Application>;
}
/**
 * @public
 */
export interface SpacesNavModel {
    id: string;
    label?: IntlString;
    spaceClass: Ref<Class<Space>>;
    addSpaceLabel?: IntlString;
    createComponent?: AnyComponent;
    icon?: Asset;
    specials?: SpecialNavModel[];
    visibleIf?: Resource<(space: Space) => Promise<boolean>>;
}
/**
 * @public
 */
export interface NavigatorModel {
    spaces: SpacesNavModel[];
    specials?: SpecialNavModel[];
}
/**
 * @public
 */
export interface SpecialNavModel {
    id: string;
    label: IntlString;
    icon?: Asset;
    accessLevel?: AccountRole;
    component: AnyComponent;
    componentProps?: Record<string, any>;
    position?: 'top' | 'bottom' | string;
    visibleIf?: Resource<(spaces: Space[]) => Promise<boolean>>;
    spaceClass?: Ref<Class<Space>>;
    checkIsDisabled?: Resource<() => Promise<boolean>>;
    notificationsCountProvider?: Resource<(inboxNotificationsByContext: Map<Ref<DocNotifyContext>, InboxNotification[]>) => number>;
    navigationModel?: ParentsNavigationModel;
}
/**
 * @public
 */
export interface ParentsNavigationModel {
    navigationComponent: AnyComponent;
    navigationComponentLabel: IntlString;
    navigationComponentIcon?: Asset;
    mainComponentLabel: IntlString;
    mainComponentIcon?: Asset;
    navigationComponentProps?: Record<string, any>;
    syncWithLocationQuery?: boolean;
    createComponent?: AnyComponent;
    createComponentProps?: Record<string, any>;
    createButton?: AnyComponent;
}
/**
 * @public
 */
export interface ViewConfiguration {
    class: Ref<Class<Doc>>;
    createItemDialog?: AnyComponent;
    createItemLabel?: IntlString;
    component?: AnyComponent;
    componentProps?: Record<string, any>;
}
/**
 * @public
 */
export interface SpaceView extends Class<Obj> {
    view: ViewConfiguration;
}
/**
 * @public
 */
export declare const workbenchId: Plugin;
export * from './analytics';
declare const _default: {
    class: {
        Application: Ref<Class<Application>>;
        ApplicationNavModel: Ref<Class<ApplicationNavModel>>;
        HiddenApplication: Ref<Class<HiddenApplication>>;
        Widget: Ref<Class<Widget>>;
        WidgetPreference: Ref<Class<WidgetPreference>>;
        TxSidebarEvent: Ref<Class<TxSidebarEvent<Record<string, any>>>>;
        WorkbenchTab: Ref<Class<WorkbenchTab>>;
    };
    mixin: {
        SpaceView: Ref<Mixin<SpaceView>>;
    };
    component: {
        WorkbenchApp: AnyComponent;
        InviteLink: AnyComponent;
        Archive: AnyComponent;
        SpecialView: AnyComponent;
    };
    string: {
        Archive: IntlString;
        View: IntlString;
        ServerUnderMaintenance: IntlString;
        UpgradeDownloadProgress: IntlString;
        OpenInSidebar: IntlString;
        OpenInSidebarNewTab: IntlString;
        ConfigureWidgets: IntlString;
        WorkspaceIsArchived: IntlString;
        WorkspaceIsMigrating: IntlString;
    };
    icon: {
        Search: Asset;
    };
    event: {
        NotifyConnection: Metadata<string>;
        NotifyTitle: Metadata<string>;
    };
    metadata: {
        PlatformTitle: Metadata<string>;
        ExcludedApplications: Metadata<Ref<Application>[]>;
        DefaultApplication: Metadata<string>;
        DefaultSpace: Metadata<Ref<Space>>;
        DefaultSpecial: Metadata<string>;
        NavigationExpandedDefault: Metadata<boolean>;
    };
    extensions: {
        WorkbenchExtensions: ComponentExtensionId;
        WorkbenchTabExtensions: ComponentExtensionId;
        SpecialViewAction: ComponentExtensionId;
    };
    function: {
        CreateWidgetTab: Resource<(widget: Widget, tab: WidgetTab, newTab: boolean) => Promise<void>>;
        CloseWidgetTab: Resource<(widget: Widget, tab: string) => Promise<void>>;
        CloseWidget: Resource<(widget: Ref<Widget>) => Promise<void>>;
        GetSidebarObject: Resource<() => Partial<Pick<Doc, '_id' | '_class'>>>;
    };
    actionImpl: {
        Navigate: ViewAction<{
            mode: 'app' | 'special' | 'space';
            application?: string | undefined;
            special?: string | undefined;
            space?: Ref<Space> | undefined;
            spaceClass?: Ref<Class<Space>> | undefined;
            spaceSpecial?: string | undefined;
        }>;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map