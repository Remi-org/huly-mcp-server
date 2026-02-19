import { ActivityMessage, ActivityMessageViewlet } from '@hcengineering/activity';
import type { AttachedDoc, Class, Doc, Markup, Mixin, Ref, Space, Timestamp } from '@hcengineering/core';
import { NotificationType } from '@hcengineering/notification';
import type { Asset, Plugin, Resource } from '@hcengineering/platform';
import { IntlString } from '@hcengineering/platform';
import { AnyComponent } from '@hcengineering/ui';
import { Action } from '@hcengineering/view';
import { Person, ChannelProvider as SocialChannelProvider } from '@hcengineering/contact';
import { Widget, WidgetTab } from '@hcengineering/workbench';
/**
 * @public
 */
export interface ChunterSpace extends Space {
    messages?: number;
}
/**
 * @public
 */
export interface Channel extends ChunterSpace {
    topic?: string;
}
/**
 * @public
 */
export interface DirectMessage extends ChunterSpace {
}
/**
 * @public
 */
export interface ObjectChatPanel extends Class<Doc> {
    openByDefault?: boolean;
    ignoreKeys: string[];
}
/**
 * @public
 */
export interface ChatMessage extends ActivityMessage {
    message: Markup;
    attachments?: number;
    editedOn?: Timestamp;
    provider?: Ref<SocialChannelProvider>;
    inlineButtons?: number;
}
/**
 * @public
 */
export interface ThreadMessage extends ChatMessage {
    attachedTo: Ref<ActivityMessage>;
    attachedToClass: Ref<Class<ActivityMessage>>;
    objectId: Ref<Doc>;
    objectClass: Ref<Class<Doc>>;
}
/**
 * @public
 */
export interface ChatMessageViewlet extends ActivityMessageViewlet {
    messageClass: Ref<Class<Doc>>;
    label?: IntlString;
}
export interface ChatSyncInfo extends Doc {
    user: Ref<Person>;
    timestamp: Timestamp;
}
export interface TypingInfo extends Doc {
    objectId: Ref<Doc>;
    objectClass: Ref<Class<Doc>>;
    person: Ref<Person>;
    lastTyping: Timestamp;
}
export type InlineButtonAction = (button: InlineButton, message: Ref<ChatMessage>, channel: Ref<Doc>) => Promise<void>;
export interface InlineButton extends AttachedDoc {
    name: string;
    titleIntl?: IntlString;
    title?: string;
    action: Resource<InlineButtonAction>;
}
export interface ChatWidgetTab extends WidgetTab {
    data: {
        _id?: Ref<Doc>;
        _class?: Ref<Class<Doc>>;
        thread?: Ref<ActivityMessage>;
        channelName: string;
        selectedMessageId?: Ref<ActivityMessage>;
        props?: Record<string, any>;
    };
}
export type ChunterExtensionPoint = 'aside';
export interface ChunterExtension extends Doc {
    ofClass: Ref<Class<Doc>>;
    point: ChunterExtensionPoint;
    component: AnyComponent;
}
/**
 * @public
 */
export declare const chunterId: Plugin;
export * from './utils';
export * from './analytics';
declare const _default: {
    icon: {
        Chunter: Asset;
        Hashtag: Asset;
        Thread: Asset;
        Lock: Asset;
        ChannelBrowser: Asset;
        ChunterBrowser: Asset;
        Copy: Asset;
        Messages: Asset;
        Bookmarks: Asset;
    };
    component: {
        DmHeader: AnyComponent;
        ThreadView: AnyComponent;
        Thread: AnyComponent;
        Reactions: AnyComponent;
        ChatMessageInput: AnyComponent;
        ChatMessagesPresenter: AnyComponent;
        ChatMessagePresenter: AnyComponent;
        ThreadMessagePresenter: AnyComponent;
        ChatMessagePreview: AnyComponent;
        ThreadMessagePreview: AnyComponent;
        DirectIcon: AnyComponent;
        InlineCommentThread: AnyComponent;
    };
    activity: {
        MembersChangedMessage: AnyComponent;
    };
    class: {
        ThreadMessage: Ref<Class<ThreadMessage>>;
        ChunterSpace: Ref<Class<ChunterSpace>>;
        Channel: Ref<Class<Channel>>;
        DirectMessage: Ref<Class<DirectMessage>>;
        ChatMessage: Ref<Class<ChatMessage>>;
        ChatMessageViewlet: Ref<Class<ChatMessageViewlet>>;
        ChatSyncInfo: Ref<Class<ChatSyncInfo>>;
        InlineButton: Ref<Class<InlineButton>>;
        TypingInfo: Ref<Class<TypingInfo>>;
        ChunterExtension: Ref<Class<ChunterExtension>>;
    };
    mixin: {
        ObjectChatPanel: Ref<Mixin<ObjectChatPanel>>;
    };
    string: {
        Reactions: IntlString;
        EditUpdate: IntlString;
        EditCancel: IntlString;
        Comments: IntlString;
        Settings: IntlString;
        ArchiveChannel: IntlString;
        UnarchiveChannel: IntlString;
        ArchiveConfirm: IntlString;
        Message: IntlString;
        MessageOn: IntlString;
        UnarchiveConfirm: IntlString;
        ConvertToPrivate: IntlString;
        DirectNotificationTitle: IntlString;
        DirectNotificationBody: IntlString;
        MessageNotificationBody: IntlString;
        AddCommentPlaceholder: IntlString;
        LeftComment: IntlString;
        Docs: IntlString;
        Chat: IntlString;
        Thread: IntlString;
        ThreadMessage: IntlString;
        ReplyToThread: IntlString;
        Channels: IntlString;
        Direct: IntlString;
        RepliedTo: IntlString;
        AllChannels: IntlString;
        AllContacts: IntlString;
        NewChannel: IntlString;
        TopicOptional: IntlString;
        Visibility: IntlString;
        Public: IntlString;
        Private: IntlString;
        NewDirectChat: IntlString;
        AddMembers: IntlString;
        CloseConversation: IntlString;
        Starred: IntlString;
        DeleteStarred: IntlString;
        StarChannel: IntlString;
        StarConversation: IntlString;
        UnstarChannel: IntlString;
        UnstarConversation: IntlString;
        NoMessagesInChannel: IntlString;
        SendMessagesInChannel: IntlString;
        Joined: IntlString;
        Left: IntlString;
        Added: IntlString;
        Removed: IntlString;
        CreatedChannelOn: IntlString;
        YouJoinedChannel: IntlString;
        AndMore: IntlString;
        IsTyping: IntlString;
        ThreadIn: IntlString;
        TranslateMessage: IntlString;
        Translate: IntlString;
        ShowOriginal: IntlString;
        Translating: IntlString;
        StartConversation: IntlString;
        ViewingThreadFromArchivedChannel: IntlString;
        ViewingArchivedChannel: IntlString;
        OpenChatInSidebar: IntlString;
    };
    ids: {
        DMNotification: Ref<NotificationType>;
        ThreadNotification: Ref<NotificationType>;
        ChannelNotification: Ref<NotificationType>;
        JoinChannelNotification: Ref<NotificationType>;
        ThreadMessageViewlet: Ref<ChatMessageViewlet>;
        ChatWidget: Ref<Widget>;
    };
    app: {
        Chunter: Ref<Doc<Space>>;
    };
    action: {
        DeleteChatMessage: Ref<Action<Doc<Space>, Record<string, any>>>;
        LeaveChannel: Ref<Action<Doc<Space>, Record<string, any>>>;
        RemoveChannel: Ref<Action<Doc<Space>, Record<string, any>>>;
        TranslateMessage: Ref<Action<Doc<Space>, Record<string, any>>>;
        ShowOriginalMessage: Ref<Action<Doc<Space>, Record<string, any>>>;
        CloseConversation: Ref<Action<Doc<Space>, Record<string, any>>>;
    };
    function: {
        CanTranslateMessage: Resource<(doc?: Doc | Doc[]) => Promise<boolean>>;
        OpenThreadInSidebar: Resource<(_id: Ref<ActivityMessage>, msg?: ActivityMessage, doc?: Doc, selectedId?: Ref<ActivityMessage>, props?: Record<string, any>, force?: boolean) => Promise<void>>;
        OpenChannelInSidebar: Resource<(_id: Ref<Doc>, _class: Ref<Class<Doc>>, doc?: Doc, thread?: Ref<ActivityMessage>, newTab?: boolean, selectedMessageId?: Ref<ActivityMessage>) => Promise<void>>;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map