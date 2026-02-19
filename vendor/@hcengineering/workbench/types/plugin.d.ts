import type { Class, Doc, Mixin, Ref, Space } from '@hcengineering/core';
import type { Asset, IntlString, Metadata, Plugin, Resource } from '@hcengineering/platform';
import { AnyComponent, ComponentExtensionId } from '@hcengineering/ui';
import { ViewAction } from '@hcengineering/view';
import type { Application, ApplicationNavModel, HiddenApplication, SpaceView, Widget, WidgetPreference, WidgetTab, WorkbenchTab } from './types';
/** @public */
export declare const workbenchId: Plugin;
/** @public */
export declare const workbenchPlugin: {
    class: {
        Application: Ref<Class<Application>>;
        ApplicationNavModel: Ref<Class<ApplicationNavModel>>;
        HiddenApplication: Ref<Class<HiddenApplication>>;
        Widget: Ref<Class<Widget>>;
        WidgetPreference: Ref<Class<WidgetPreference>>;
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
        LogIn: Resource<(loginInfo: {
            account: string;
            token?: string;
        }) => Promise<void>>;
        LogOut: Resource<() => Promise<void>>;
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
//# sourceMappingURL=plugin.d.ts.map