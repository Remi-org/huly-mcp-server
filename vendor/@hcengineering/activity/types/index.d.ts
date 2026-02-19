import { Person } from '@hcengineering/contact';
import { Account, AttachedDoc, Class, Doc, DocumentQuery, Mixin, Ref, type RelatedDocument, Timestamp, Tx, TxCUD } from '@hcengineering/core';
import type { Asset, IntlString, Plugin, Resource } from '@hcengineering/platform';
import { Preference } from '@hcengineering/preference';
import type { AnyComponent, ComponentExtensionId } from '@hcengineering/ui';
import type { Action } from '@hcengineering/view';
/**
 * @public
 */
export interface ActivityMessage extends AttachedDoc {
    modifiedBy: Ref<Account>;
    modifiedOn: Timestamp;
    isPinned?: boolean;
    repliedPersons?: Ref<Person>[];
    lastReply?: Timestamp;
    replies?: number;
    reactions?: number;
    editedOn?: Timestamp;
}
export type DisplayActivityMessage = DisplayDocUpdateMessage | ActivityMessage;
export interface DisplayDocUpdateMessage extends DocUpdateMessage {
    previousMessages?: DocUpdateMessage[];
    combinedMessagesIds?: Ref<DocUpdateMessage>[];
}
/**
 * Designed to control and filter some of changes from being to be propagated into activity.
 * @public
 */
export interface ActivityMessageControl<T extends Doc = Doc> extends Doc {
    objectClass: Ref<Class<Doc>>;
    skip: DocumentQuery<Tx>[];
    skipFields?: (keyof T)[];
    allowedFields?: (keyof T)[];
}
/**
 *
 * General information activity message.
 * @public
 */
export interface ActivityInfoMessage extends ActivityMessage {
    title?: IntlString;
    message: IntlString;
    props?: Record<string, any>;
    icon?: Asset;
    iconProps?: Record<string, any>;
    editedOn?: Timestamp;
    links?: {
        _class: Ref<Class<Doc>>;
        _id: Ref<Doc>;
    }[];
}
/**
 * @public
 */
export interface DocUpdateMessage extends ActivityMessage {
    objectId: Ref<Doc>;
    objectClass: Ref<Class<Doc>>;
    txId?: Ref<TxCUD<Doc>>;
    action: DocUpdateAction;
    updateCollection?: string;
    attributeUpdates?: DocAttributeUpdates;
}
export interface ActivityReference extends ActivityMessage {
    srcDocId: Ref<Doc>;
    srcDocClass: Ref<Class<Doc>>;
    attachedDocId?: Ref<Doc>;
    attachedDocClass?: Ref<Class<Doc>>;
    message: string;
}
/**
 * @public
 */
export interface DocAttributeUpdates {
    attrKey: string;
    attrClass: Ref<Class<Doc>>;
    set: (string | number | null)[];
    prevValue?: any;
    added: (string | number | null)[];
    removed: (string | number | null)[];
    isMixin: boolean;
}
export type DocUpdateAction = 'create' | 'update' | 'remove';
export type DocUpdateMessageViewletAttributesConfig = Record<string, {
    presenter?: AnyComponent;
    icon?: Asset;
    iconPresenter?: AnyComponent;
}>;
/**
 * @public
 */
export interface ActivityMessageViewlet extends Doc {
    objectClass: Ref<Class<Doc>>;
    onlyWithParent?: boolean;
}
/**
 * @public
 */
export interface DocUpdateMessageViewlet extends ActivityMessageViewlet {
    action: DocUpdateAction;
    valueAttr?: string;
    label?: IntlString;
    icon?: Asset;
    component?: AnyComponent;
    config?: DocUpdateMessageViewletAttributesConfig;
    hideIfRemoved?: boolean;
}
/**
 * @public
 */
export declare const activityId: Plugin;
/**
 * @public
 */
export interface ActivityMessagesFilter extends Doc {
    label: IntlString;
    position: number;
    filter: Resource<(message: ActivityMessage, _class?: Ref<Doc>) => boolean>;
}
/**
 * @public
 */
export interface ActivityDoc extends Class<Doc> {
    preposition?: IntlString;
}
/**
 * @public
 */
export interface ActivityAttributeUpdatesPresenter extends Class<Doc> {
    presenter: AnyComponent;
}
export interface ActivityMessagePreview extends Class<Doc> {
    presenter: AnyComponent;
}
/**
 * @public
 */
export type ActivityExtensionKind = 'input';
/**
 * @public
 */
export interface ActivityExtension extends Doc {
    ofClass: Ref<Class<Doc>>;
    components: Record<ActivityExtensionKind, {
        component: AnyComponent;
        props?: Record<string, any>;
    }>;
}
/**
 * @public
 */
export interface Reaction extends AttachedDoc {
    attachedTo: Ref<ActivityMessage>;
    attachedToClass: Ref<Class<ActivityMessage>>;
    emoji: string;
    createBy: Ref<Account>;
}
/**
 * @public
 */
export interface SavedMessage extends Preference {
    attachedTo: Ref<ActivityMessage>;
}
export interface ReplyProvider extends Doc {
    function: Resource<(message: ActivityMessage, event: MouseEvent) => Promise<void>>;
}
export interface UserMentionInfo extends AttachedDoc {
    user: Ref<Person>;
    content: string;
}
export type WithReferences<T extends Doc> = T & {
    references?: number;
};
/**
 * @public
 */
export interface IgnoreActivity extends Class<Doc> {
}
export type ActivityMessagePreviewType = 'full' | 'content-only';
export type ActivityMessageViewType = 'default' | 'short';
declare const _default: {
    mixin: {
        ActivityDoc: Ref<Mixin<ActivityDoc>>;
        ActivityAttributeUpdatesPresenter: Ref<Mixin<ActivityAttributeUpdatesPresenter>>;
        ActivityMessagePreview: Ref<Mixin<ActivityMessagePreview>>;
        IgnoreActivity: Ref<Mixin<IgnoreActivity>>;
    };
    class: {
        DocUpdateMessage: Ref<Class<DocUpdateMessage>>;
        ActivityMessage: Ref<Class<ActivityMessage>>;
        ActivityInfoMessage: Ref<Class<ActivityInfoMessage>>;
        ActivityMessageControl: Ref<Class<ActivityMessageControl<Doc<import("@hcengineering/core").Space>>>>;
        DocUpdateMessageViewlet: Ref<Class<DocUpdateMessageViewlet>>;
        ActivityMessagesFilter: Ref<Class<ActivityMessagesFilter>>;
        ActivityExtension: Ref<Class<ActivityExtension>>;
        Reaction: Ref<Class<Reaction>>;
        SavedMessage: Ref<Class<SavedMessage>>;
        ActivityReference: Ref<Class<ActivityReference>>;
        ReplyProvider: Ref<Class<ReplyProvider>>;
        UserMentionInfo: Ref<Class<UserMentionInfo>>;
    };
    icon: {
        Activity: Asset;
        Emoji: Asset;
        Bookmark: Asset;
        BookmarkFilled: Asset;
    };
    string: {
        Activity: IntlString;
        Added: IntlString;
        Changed: IntlString;
        Edited: IntlString;
        From: IntlString;
        Removed: IntlString;
        To: IntlString;
        Unset: IntlString;
        In: IntlString;
        At: IntlString;
        NewestFirst: IntlString;
        Edit: IntlString;
        Updated: IntlString;
        Created: IntlString;
        UpdatedCollection: IntlString;
        New: IntlString;
        Set: IntlString;
        Update: IntlString;
        For: IntlString;
        AllActivity: IntlString;
        Reaction: IntlString;
        Reactions: IntlString;
        LastReply: IntlString;
        RepliesCount: IntlString;
        Reacted: IntlString;
        Message: IntlString;
        Mentioned: IntlString;
        You: IntlString;
        Mentions: IntlString;
        MentionedYouIn: IntlString;
        Messages: IntlString;
        Thread: IntlString;
        ReactionNotificationTitle: IntlString;
        ReactionNotificationBody: IntlString;
        NewObject: IntlString;
        RemovedObject: IntlString;
        ChangedObject: IntlString;
        UnsetObject: IntlString;
        UpdatedObject: IntlString;
    };
    component: {
        Activity: AnyComponent;
        ActivityMessagePresenter: AnyComponent;
        DocUpdateMessagePresenter: AnyComponent;
        ActivityInfoMessagePresenter: AnyComponent;
        ReactionPresenter: AnyComponent;
        ActivityMessageNotificationLabel: AnyComponent;
        ActivityReferencePresenter: AnyComponent;
        DocUpdateMessagePreview: AnyComponent;
        ActivityReferencePreview: AnyComponent;
        ActivityInfoMessagePreview: AnyComponent;
    };
    ids: {
        AllFilter: Ref<ActivityMessagesFilter>;
        MentionNotification: Ref<Doc<import("@hcengineering/core").Space>>;
    };
    extension: {
        ActivityEmployeePresenter: ComponentExtensionId;
    };
    function: {
        ShouldScrollToActivity: Resource<() => boolean>;
    };
    backreference: {
        Update: Resource<(source: Doc, key: string, target: RelatedDocument[], label: IntlString) => Promise<void>>;
    };
    action: {
        Reply: Ref<Action<Doc<import("@hcengineering/core").Space>, Record<string, any>>>;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map