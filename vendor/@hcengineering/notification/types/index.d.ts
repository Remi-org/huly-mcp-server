import { ActivityMessage } from '@hcengineering/activity';
import { Account, AnyAttribute, Class, Doc, DocumentQuery, type Domain, IdMap, Markup, Mixin, Ref, Space, Timestamp, Tx, TxCUD, TxOperations } from '@hcengineering/core';
import type { Asset, IntlString, Metadata, Plugin, Resource } from '@hcengineering/platform';
import { Preference } from '@hcengineering/preference';
import { IntegrationType } from '@hcengineering/setting';
import { AnyComponent, Location, ResolvedLocation } from '@hcengineering/ui';
import { Action } from '@hcengineering/view';
import { PersonSpace } from '@hcengineering/contact';
import { Readable, Writable } from './types';
export * from './types';
export declare const DOMAIN_NOTIFICATION: Domain;
export declare const DOMAIN_DOC_NOTIFY: Domain;
export declare const DOMAIN_USER_NOTIFY: Domain;
/**
 * @public
 */
export interface BrowserNotification extends Doc {
    user: Ref<Account>;
    title: string;
    body: string;
    onClickLocation?: Location;
    senderId?: Ref<Account>;
    tag: Ref<Doc>;
    messageId?: Ref<ActivityMessage>;
    messageClass?: Ref<Class<ActivityMessage>>;
    objectId: Ref<Doc>;
    objectClass: Ref<Class<Doc>>;
}
export interface PushData {
    tag?: string;
    title: string;
    body: string;
    icon?: string;
    domain?: string;
    url?: string;
}
export interface PushSubscriptionKeys {
    p256dh: string;
    auth: string;
}
export interface PushSubscription extends Doc {
    user: Ref<Account>;
    endpoint: string;
    keys: PushSubscriptionKeys;
}
/**
 * @public
 */
export interface NotificationGroup extends Doc {
    label: IntlString;
    icon: Asset;
    objectClass?: Ref<Class<Doc>>;
}
/**
 * @public
 */
export interface NotificationPreferencesGroup extends Doc {
    label: IntlString;
    icon: Asset;
    presenter: AnyComponent;
}
/**
 * @public
 */
export interface NotificationTemplate {
    textTemplate: string;
    htmlTemplate: string;
    subjectTemplate: string;
}
/**
 * @public
 */
export interface NotificationContent {
    title: IntlString;
    body: IntlString;
    data?: Markup;
    intlParams: Record<string, string | number>;
    intlParamsNotLocalized?: Record<string, IntlString>;
}
export interface BaseNotificationType extends Doc {
    label: IntlString;
    generated: boolean;
    hidden: boolean;
    group: Ref<NotificationGroup>;
    defaultEnabled: boolean;
    templates?: NotificationTemplate;
}
/**
 * @public
 */
export interface NotificationType extends BaseNotificationType {
    attribute?: Ref<AnyAttribute>;
    txClasses: Ref<Class<Tx>>[];
    objectClass: Ref<Class<Doc>>;
    onlyOwn?: boolean;
    attachedToClass?: Ref<Class<Doc>>;
    field?: string;
    txMatch?: DocumentQuery<Tx>;
    spaceSubscribe?: boolean;
    allowedForAuthor?: boolean;
}
export interface CommonNotificationType extends BaseNotificationType {
}
export interface NotificationProvider extends Doc {
    label: IntlString;
    description: IntlString;
    icon: Asset;
    defaultEnabled: boolean;
    depends?: Ref<NotificationProvider>;
    canDisable: boolean;
    ignoreAll?: boolean;
    order: number;
    presenter?: AnyComponent;
    isAvailableFn?: Resource<() => boolean>;
}
export interface NotificationProviderDefaults extends Doc {
    provider: Ref<NotificationProvider>;
    excludeIgnore?: Ref<BaseNotificationType>[];
    ignoredTypes: Ref<BaseNotificationType>[];
    enabledTypes: Ref<BaseNotificationType>[];
}
export interface NotificationProviderSetting extends Preference {
    attachedTo: Ref<NotificationProvider>;
    enabled: boolean;
}
export interface NotificationTypeSetting extends Preference {
    attachedTo: Ref<NotificationProvider>;
    type: Ref<BaseNotificationType>;
    enabled: boolean;
}
/**
 * @public
 */
export interface ClassCollaborators extends Class<Doc> {
    fields: string[];
}
/**
 * @public
 */
export interface NotificationObjectPresenter extends Class<Doc> {
    presenter: AnyComponent;
}
/**
 * @public
 */
export interface Collaborators extends Doc {
    collaborators: Ref<Account>[];
}
/**
 * @public
 */
export declare const notificationId: Plugin;
/**
 * @public
 */
export interface NotificationPreview extends Class<Doc> {
    presenter: AnyComponent;
}
/**
 * @public
 */
export interface NotificationContextPresenter extends Class<Doc> {
    labelPresenter?: AnyComponent;
}
/**
 * @public
 */
export interface InboxNotification extends Doc<PersonSpace> {
    user: Ref<Account>;
    isViewed: boolean;
    docNotifyContext: Ref<DocNotifyContext>;
    objectId: Ref<Doc>;
    objectClass: Ref<Class<Doc>>;
    title?: IntlString;
    body?: IntlString;
    data?: Markup;
    intlParams?: Record<string, string | number>;
    intlParamsNotLocalized?: Record<string, IntlString>;
    archived: boolean;
}
export interface ActivityInboxNotification extends InboxNotification {
    attachedTo: Ref<ActivityMessage>;
    attachedToClass: Ref<Class<ActivityMessage>>;
}
export interface CommonInboxNotification extends InboxNotification {
    header?: IntlString;
    headerIcon?: Asset;
    headerObjectId?: Ref<Doc>;
    headerObjectClass?: Ref<Class<Doc>>;
    message?: IntlString;
    messageHtml?: Markup;
    props?: Record<string, any>;
    icon?: Asset;
    iconProps?: Record<string, any>;
}
export interface MentionInboxNotification extends CommonInboxNotification {
    mentionedIn: Ref<Doc>;
    mentionedInClass: Ref<Class<Doc>>;
}
export interface DisplayActivityInboxNotification extends ActivityInboxNotification {
    combinedIds: Ref<ActivityInboxNotification>[];
    combinedMessages: ActivityMessage[];
}
export type DisplayInboxNotification = DisplayActivityInboxNotification | InboxNotification;
/**
 * @public
 */
export interface DocNotifyContext extends Doc<PersonSpace> {
    user: Ref<Account>;
    objectId: Ref<Doc>;
    objectClass: Ref<Class<Doc>>;
    objectSpace: Ref<Space>;
    isPinned: boolean;
    hidden: boolean;
    lastViewedTimestamp?: Timestamp;
    lastUpdateTimestamp?: Timestamp;
    tx?: Ref<TxCUD<Doc>>;
}
/**
 * @public
 */
export interface InboxNotificationsClient {
    contextByDoc: Writable<Map<Ref<Doc>, DocNotifyContext>>;
    contexts: Writable<DocNotifyContext[]>;
    contextById: Readable<IdMap<DocNotifyContext>>;
    inboxNotifications: Readable<InboxNotification[]>;
    activityInboxNotifications: Writable<ActivityInboxNotification[]>;
    inboxNotificationsByContext: Readable<Map<Ref<DocNotifyContext>, InboxNotification[]>>;
    readDoc: (_id: Ref<Doc>) => Promise<void>;
    forceReadDoc: (_id: Ref<Doc>, _class: Ref<Class<Doc>>) => Promise<void>;
    readNotifications: (client: TxOperations, ids: Array<Ref<InboxNotification>>) => Promise<void>;
    unreadNotifications: (client: TxOperations, ids: Array<Ref<InboxNotification>>) => Promise<void>;
    archiveNotifications: (client: TxOperations, ids: Array<Ref<InboxNotification>>) => Promise<void>;
    archiveAllNotifications: () => Promise<void>;
    readAllNotifications: () => Promise<void>;
    unreadAllNotifications: () => Promise<void>;
}
/**
 * @public
 */
export type InboxNotificationsClientFactory = () => InboxNotificationsClient;
/**
 * @public
 */
export interface ActivityNotificationViewlet extends Doc {
    messageMatch: DocumentQuery<Doc>;
    presenter: AnyComponent;
}
/**
 * @public
 */
export type NotifyFunc = (title: string, body: string, _id?: string, onClick?: () => void) => void;
/**
 * @public
 */
declare const notification: {
    mixin: {
        ClassCollaborators: Ref<Mixin<ClassCollaborators>>;
        Collaborators: Ref<Mixin<Collaborators>>;
        NotificationObjectPresenter: Ref<Mixin<NotificationObjectPresenter>>;
        NotificationPreview: Ref<Mixin<NotificationPreview>>;
        NotificationContextPresenter: Ref<Mixin<NotificationContextPresenter>>;
    };
    class: {
        BrowserNotification: Ref<Class<BrowserNotification>>;
        PushSubscription: Ref<Class<PushSubscription>>;
        BaseNotificationType: Ref<Class<BaseNotificationType>>;
        NotificationType: Ref<Class<NotificationType>>;
        CommonNotificationType: Ref<Class<CommonNotificationType>>;
        NotificationGroup: Ref<Class<NotificationGroup>>;
        NotificationPreferencesGroup: Ref<Class<NotificationPreferencesGroup>>;
        DocNotifyContext: Ref<Class<DocNotifyContext>>;
        InboxNotification: Ref<Class<InboxNotification>>;
        ActivityInboxNotification: Ref<Class<ActivityInboxNotification>>;
        CommonInboxNotification: Ref<Class<CommonInboxNotification>>;
        ActivityNotificationViewlet: Ref<Class<ActivityNotificationViewlet>>;
        MentionInboxNotification: Ref<Class<MentionInboxNotification>>;
        NotificationProvider: Ref<Class<NotificationProvider>>;
        NotificationTypeSetting: Ref<Class<NotificationTypeSetting>>;
        NotificationProviderSetting: Ref<Class<NotificationProviderSetting>>;
        NotificationProviderDefaults: Ref<Mixin<NotificationProviderDefaults>>;
    };
    ids: {
        NotificationSettings: Ref<Doc<Space>>;
        NotificationGroup: Ref<NotificationGroup>;
        CollaboratoAddNotification: Ref<NotificationType>;
        MentionCommonNotificationType: Ref<CommonNotificationType>;
    };
    metadata: {
        PushPublicKey: Metadata<string>;
    };
    providers: {
        InboxNotificationProvider: Ref<NotificationProvider>;
        PushNotificationProvider: Ref<NotificationProvider>;
        SoundNotificationProvider: Ref<NotificationProvider>;
    };
    integrationType: {
        MobileApp: Ref<IntegrationType>;
    };
    component: {
        Inbox: AnyComponent;
        NotificationPresenter: AnyComponent;
        CollaboratorsChanged: AnyComponent;
        DocNotifyContextPresenter: AnyComponent;
        NotificationCollaboratorsChanged: AnyComponent;
        ReactionNotificationPresenter: AnyComponent;
        GeneralPreferencesGroup: AnyComponent;
    };
    action: {
        PinDocNotifyContext: Ref<Action<Doc<Space>, Record<string, any>>>;
        UnpinDocNotifyContext: Ref<Action<Doc<Space>, Record<string, any>>>;
        UnReadNotifyContext: Ref<Action<Doc<Space>, Record<string, any>>>;
        ReadNotifyContext: Ref<Action<Doc<Space>, Record<string, any>>>;
        ArchiveContextNotifications: Ref<Action<Doc<Space>, Record<string, any>>>;
        UnarchiveContextNotifications: Ref<Action<Doc<Space>, Record<string, any>>>;
    };
    icon: {
        Notifications: Asset;
        Inbox: Asset;
        BellCrossed: Asset;
    };
    string: {
        Notification: IntlString;
        Notifications: IntlString;
        DontTrack: IntlString;
        Inbox: IntlString;
        CommonNotificationTitle: IntlString;
        CommonNotificationBody: IntlString;
        CommonNotificationChanged: IntlString;
        CommonNotificationChangedProperty: IntlString;
        ChangedCollaborators: IntlString;
        NewCollaborators: IntlString;
        RemovedCollaborators: IntlString;
        Edited: IntlString;
        Pinned: IntlString;
        All: IntlString;
        ArchiveAll: IntlString;
        MarkReadAll: IntlString;
        MarkUnreadAll: IntlString;
        ArchiveAllConfirmationTitle: IntlString;
        ArchiveAllConfirmationMessage: IntlString;
        YouAddedCollaborators: IntlString;
        YouRemovedCollaborators: IntlString;
        Push: IntlString;
        General: IntlString;
        InboxNotificationsDescription: IntlString;
        PushNotificationsDescription: IntlString;
        CommonNotificationCollectionAdded: IntlString;
        CommonNotificationCollectionRemoved: IntlString;
        SoundNotificationsDescription: IntlString;
        Sound: IntlString;
        NoAccessToObject: IntlString;
        ViewIn: IntlString;
    };
    function: {
        Notify: Resource<NotifyFunc>;
        CheckPushPermission: Resource<(value: boolean) => Promise<boolean>>;
        GetInboxNotificationsClient: Resource<InboxNotificationsClientFactory>;
        HasInboxNotifications: Resource<(notificationsByContext: Map<Ref<DocNotifyContext>, InboxNotification[]>) => Promise<boolean>>;
        IsNotificationAllowed: Resource<(type: BaseNotificationType, providerId: Ref<NotificationProvider>) => boolean>;
    };
    resolver: {
        Location: Resource<(loc: Location) => Promise<ResolvedLocation | undefined>>;
    };
};
export default notification;
//# sourceMappingURL=index.d.ts.map