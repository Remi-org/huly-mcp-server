import type { AccountRole, AccountUuid, Class, Doc, DocumentQuery, Obj, Ref, Space } from '@hcengineering/core';
import { DocNotifyContext, InboxNotification } from '@hcengineering/notification';
import type { Asset, IntlString, Resource } from '@hcengineering/platform';
import type { Preference } from '@hcengineering/preference';
import { AnyComponent, type AnySvelteComponent, Location, ResolvedLocation } from '@hcengineering/ui';
/** @public */
export interface LocationData {
    objectId?: Ref<Doc>;
    objectClass?: Ref<Class<Doc>>;
    name?: string;
    nameIntl?: IntlString;
    icon?: Asset;
    iconComponent?: AnyComponent;
    iconProps?: Record<string, any>;
}
/** @public */
export interface Application extends Doc {
    label: IntlString;
    alias: string;
    icon: Asset;
    hidden: boolean;
    position?: 'top' | 'mid';
    type?: string;
    navigatorModel?: NavigatorModel;
    locationResolver?: Resource<(loc: Location) => Promise<ResolvedLocation | undefined>>;
    locationDataResolver?: Resource<(loc: Location) => Promise<LocationData>>;
    component?: AnyComponent;
    navHeaderComponent?: AnyComponent;
    accessLevel?: AccountRole;
    navFooterComponent?: AnyComponent;
}
/** @public */
export declare enum WidgetType {
    Fixed = "fixed",// Fixed sidebar are always visible
    Flexible = "flexible",// Flexible sidebar are visible only in special cases (during the meeting, etc.)
    Configurable = "configurable "
}
/** @public */
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
/** @public */
export interface WidgetPreference extends Preference {
    enabled: boolean;
}
/** @public */
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
/** @public */
export interface WorkbenchTab extends Preference {
    attachedTo: AccountUuid;
    location: string;
    isPinned: boolean;
    name?: string;
}
/** @public */
export interface ApplicationNavModel extends Doc {
    extends: Ref<Application>;
    spaces?: SpacesNavModel[];
    specials?: SpecialNavModel[];
}
/** @public */
export interface HiddenApplication extends Preference {
    attachedTo: Ref<Application>;
}
/** @public */
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
/** @public */
export interface NavigatorModel {
    spaces: SpacesNavModel[];
    specials?: SpecialNavModel[];
}
/** @public */
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
    queryBuilder?: Resource<() => Promise<DocumentQuery<Doc>>>;
}
/** @public */
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
/** @public */
export interface ViewConfiguration {
    class: Ref<Class<Doc>>;
    createItemDialog?: AnyComponent;
    createItemLabel?: IntlString;
    component?: AnyComponent;
    componentProps?: Record<string, any>;
}
/** @public */
export interface SpaceView extends Class<Obj> {
    view: ViewConfiguration;
}
//# sourceMappingURL=types.d.ts.map