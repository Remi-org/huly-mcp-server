import { Account, AttachedDoc, Class, Doc, Ref, Space, Timestamp, UXObject, type Blob, type MarkupBlobRef, type Data, type WithLookup } from '@hcengineering/core';
import type { Asset, Metadata, Plugin, Resource } from '@hcengineering/platform';
import { IntlString } from '@hcengineering/platform';
import { TemplateField, TemplateFieldCategory } from '@hcengineering/templates';
import type { AnyComponent, ColorDefinition, ResolvedLocation, Location, ComponentExtensionId } from '@hcengineering/ui';
import { Action, FilterMode, Viewlet } from '@hcengineering/view';
/**
 * @public
 */
export interface ChannelProvider extends Doc, UXObject {
    placeholder: IntlString;
    presenter?: AnyComponent;
    action?: Ref<Action>;
    integrationType?: Ref<Doc>;
}
/**
 * @public
 */
export interface Channel extends AttachedDoc {
    provider: Ref<ChannelProvider>;
    value: string;
    items?: number;
    lastMessage?: Timestamp;
}
/**
 * @public
 */
export interface ChannelItem extends AttachedDoc {
    attachedTo: Ref<Channel>;
    attachedToClass: Ref<Class<Channel>>;
    incoming: boolean;
    sendOn: Timestamp;
    attachments?: number;
}
/**
 * @public
 */
export declare enum AvatarType {
    COLOR = "color",
    IMAGE = "image",
    GRAVATAR = "gravatar",
    EXTERNAL = "external"
}
/**
 * @public
 */
export type GetAvatarUrl = (uri: Data<WithLookup<AvatarInfo>>, name: string, width?: number) => Promise<{
    url?: string;
    srcSet?: string;
    color: ColorDefinition;
}>;
/**
 * @public
 */
export interface AvatarProvider extends Doc {
    type: AvatarType;
    getUrl: Resource<GetAvatarUrl>;
}
export interface AvatarInfo extends Doc {
    avatarType: AvatarType;
    avatar?: Ref<Blob> | null;
    avatarProps?: {
        color?: string;
        url?: string;
    };
}
/**
 * @public
 */
export interface Contact extends Doc, AvatarInfo {
    name: string;
    attachments?: number;
    comments?: number;
    channels?: number;
    city: string;
}
/**
 * @public
 */
export interface Person extends Contact {
    birthday?: Timestamp | null;
}
/**
 * @public
 */
export interface Member extends AttachedDoc {
    contact: Ref<Contact>;
}
/**
 * @public
 */
export interface Organization extends Contact {
    members: number;
    description: MarkupBlobRef | null;
}
/**
 * @public
 */
export interface Status extends AttachedDoc {
    attachedTo: Ref<Employee>;
    attachedToClass: Ref<Class<Employee>>;
    name: string;
    dueDate: Timestamp;
}
/**
 * @public
 */
export interface Employee extends Person {
    active: boolean;
    statuses?: number;
    position?: string | null;
}
/**
 * @public
 */
export interface PersonAccount extends Account {
    person: Ref<Person>;
}
/**
 * @public
 */
export interface ContactsTab extends Doc {
    label: IntlString;
    component: AnyComponent;
    index: number;
}
/**
 * @public
 */
export declare const contactId: Plugin;
export interface PersonSpace extends Space {
    person: Ref<Person>;
}
/**
 * @public
 */
export declare const contactPlugin: {
    class: {
        AvatarProvider: Ref<Class<AvatarProvider>>;
        ChannelProvider: Ref<Class<ChannelProvider>>;
        Channel: Ref<Class<Channel>>;
        Contact: Ref<Class<Contact>>;
        Person: Ref<Class<Person>>;
        Member: Ref<Class<Member>>;
        Organization: Ref<Class<Organization>>;
        PersonAccount: Ref<Class<PersonAccount>>;
        Status: Ref<Class<Status>>;
        ContactsTab: Ref<Class<ContactsTab>>;
        PersonSpace: Ref<Class<PersonSpace>>;
    };
    mixin: {
        Employee: Ref<Class<Employee>>;
    };
    component: {
        SocialEditor: AnyComponent;
        CreateOrganization: AnyComponent;
        CreatePerson: AnyComponent;
        ChannelsPresenter: AnyComponent;
        MembersPresenter: AnyComponent;
        Avatar: AnyComponent;
        AvatarRef: AnyComponent;
        UserBoxList: AnyComponent;
        ChannelPresenter: AnyComponent;
        SpaceMembers: AnyComponent;
        DeleteConfirmationPopup: AnyComponent;
        AccountArrayEditor: AnyComponent;
        PersonIcon: AnyComponent;
        EditOrganizationPanel: AnyComponent;
        CollaborationUserAvatar: AnyComponent;
        CreateGuest: AnyComponent;
        SpaceMembersEditor: AnyComponent;
        ContactNamePresenter: AnyComponent;
    };
    channelProvider: {
        Email: Ref<ChannelProvider>;
        Phone: Ref<ChannelProvider>;
        LinkedIn: Ref<ChannelProvider>;
        Twitter: Ref<ChannelProvider>;
        Telegram: Ref<ChannelProvider>;
        GitHub: Ref<ChannelProvider>;
        Facebook: Ref<ChannelProvider>;
        Homepage: Ref<ChannelProvider>;
        Whatsapp: Ref<ChannelProvider>;
        Skype: Ref<ChannelProvider>;
        Profile: Ref<ChannelProvider>;
        Viber: Ref<ChannelProvider>;
    };
    avatarProvider: {
        Color: Ref<AvatarProvider>;
        Image: Ref<AvatarProvider>;
        Gravatar: Ref<AvatarProvider>;
    };
    function: {
        GetColorUrl: Resource<GetAvatarUrl>;
        GetFileUrl: Resource<GetAvatarUrl>;
        GetGravatarUrl: Resource<GetAvatarUrl>;
        GetExternalUrl: Resource<GetAvatarUrl>;
    };
    icon: {
        ContactApplication: Asset;
        Phone: Asset;
        Email: Asset;
        Discord: Asset;
        Facebook: Asset;
        Instagram: Asset;
        LinkedIn: Asset;
        Telegram: Asset;
        Twitter: Asset;
        VK: Asset;
        WhatsApp: Asset;
        Skype: Asset;
        Youtube: Asset;
        GitHub: Asset;
        Edit: Asset;
        Person: Asset;
        Persona: Asset;
        Company: Asset;
        SocialEdit: Asset;
        Homepage: Asset;
        Whatsapp: Asset;
        ComponentMembers: Asset;
        Profile: Asset;
        KickUser: Asset;
        Contacts: Asset;
        Viber: Asset;
    };
    space: {
        Contacts: Ref<Space>;
    };
    app: {
        Contacts: Ref<Doc<Space>>;
    };
    metadata: {
        LastNameFirst: Metadata<boolean>;
    };
    string: {
        PersonAlreadyExists: IntlString;
        Person: IntlString;
        Employee: IntlString;
        CreateOrganization: IntlString;
        UseImage: IntlString;
        UseGravatar: IntlString;
        UseColor: IntlString;
        PersonFirstNamePlaceholder: IntlString;
        PersonLastNamePlaceholder: IntlString;
        NumberMembers: IntlString;
        Position: IntlString;
        For: IntlString;
        SelectUsers: IntlString;
        AddGuest: IntlString;
        Members: IntlString;
        Contacts: IntlString;
        Employees: IntlString;
        Persons: IntlString;
        ViewProfile: IntlString;
    };
    viewlet: {
        TableMember: Ref<Viewlet>;
        TablePerson: Ref<Viewlet>;
        TableEmployee: Ref<Viewlet>;
        TableOrganization: Ref<Viewlet>;
    };
    filter: {
        FilterChannelIn: Ref<FilterMode>;
        FilterChannelNin: Ref<FilterMode>;
        FilterChannelHasMessages: Ref<FilterMode>;
        FilterChannelHasNewMessages: Ref<FilterMode>;
    };
    resolver: {
        Location: Resource<(loc: Location) => Promise<ResolvedLocation | undefined>>;
    };
    templateFieldCategory: {
        CurrentEmployee: Ref<TemplateFieldCategory>;
        Contact: Ref<TemplateFieldCategory>;
    };
    templateField: {
        CurrentEmployeeName: Ref<TemplateField>;
        CurrentEmployeePosition: Ref<TemplateField>;
        CurrentEmployeeEmail: Ref<TemplateField>;
        ContactName: Ref<TemplateField>;
        ContactFirstName: Ref<TemplateField>;
        ContactLastName: Ref<TemplateField>;
    };
    ids: {
        MentionCommonNotificationType: Ref<Doc<Space>>;
    };
    extension: {
        EmployeePopupActions: ComponentExtensionId;
    };
};
export default contactPlugin;
export * from './types';
export * from './utils';
export * from './analytics';
//# sourceMappingURL=index.d.ts.map