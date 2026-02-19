import { Contact } from '@hcengineering/contact';
import type { Account, AttachedDoc, Class, Doc, Markup, Mixin, Ref, SystemSpace, Timestamp } from '@hcengineering/core';
import { NotificationType } from '@hcengineering/notification';
import type { Asset, IntlString, Metadata, Plugin } from '@hcengineering/platform';
import { Handler, IntegrationType } from '@hcengineering/setting';
import { AnyComponent, ComponentExtensionId } from '@hcengineering/ui';
/**
 * @public
 */
export type Visibility = 'public' | 'freeBusy' | 'private';
/**
 * @public
 */
export interface Calendar extends Doc {
    name: string;
    hidden: boolean;
    visibility: Visibility;
}
/**
 * @public
 */
export interface ExternalCalendar extends Calendar {
    default: boolean;
    externalId: string;
    externalUser: string;
}
/**
 * @public
 * RFC5545
 */
export interface RecurringRule {
    freq: 'SECONDLY' | 'MINUTELY' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    endDate?: Timestamp;
    count?: number;
    interval?: number;
    bySecond?: number[];
    byMinute?: number[];
    byHour?: number[];
    byDay?: string[];
    byMonthDay?: number[];
    byYearDay?: number[];
    byWeekNo?: number[];
    byMonth?: number[];
    bySetPos?: number[];
    wkst?: 'SU' | 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA';
}
/**
 * @public
 */
export interface ReccuringEvent extends Event {
    rules: RecurringRule[];
    exdate: Timestamp[];
    rdate: Timestamp[];
    originalStartTime: Timestamp;
    timeZone: string;
}
/**
 * @public
 */
export interface Event extends AttachedDoc {
    space: Ref<SystemSpace>;
    eventId: string;
    title: string;
    description: Markup;
    calendar: Ref<Calendar>;
    location?: string;
    allDay: boolean;
    date: Timestamp;
    dueDate: Timestamp;
    attachments?: number;
    participants: Ref<Contact>[];
    externalParticipants?: string[];
    reminders?: Timestamp[];
    visibility?: Visibility;
    access: 'freeBusyReader' | 'reader' | 'writer' | 'owner';
    timeZone?: string;
    user: Ref<Account>;
}
/**
 * @public
 * use for an instance of a recurring event
 */
export interface ReccuringInstance extends ReccuringEvent {
    recurringEventId: string;
    originalStartTime: number;
    isCancelled?: boolean;
    virtual?: boolean;
}
/**
 * @public
 */
export interface CalendarEventPresenter extends Class<Event> {
    presenter: AnyComponent;
}
/**
 * @public
 */
export declare const calendarId: Plugin;
/**
 * @public
 */
declare const calendarPlugin: {
    class: {
        Calendar: Ref<Class<Calendar>>;
        ExternalCalendar: Ref<Class<ExternalCalendar>>;
        Event: Ref<Class<Event>>;
        ReccuringEvent: Ref<Class<ReccuringEvent>>;
        ReccuringInstance: Ref<Class<ReccuringInstance>>;
    };
    mixin: {
        CalendarEventPresenter: Ref<Mixin<CalendarEventPresenter>>;
    };
    icon: {
        Calendar: Asset;
        CalendarView: Asset;
        Location: Asset;
        Reminder: Asset;
        Notifications: Asset;
        Watch: Asset;
        Description: Asset;
        Participants: Asset;
        Repeat: Asset;
        Globe: Asset;
        Public: Asset;
        Hidden: Asset;
        Private: Asset;
    };
    image: {
        Permissions: Asset;
    };
    space: {
        Calendar: Ref<SystemSpace>;
    };
    app: {
        Calendar: Ref<Doc<import("@hcengineering/core").Space>>;
    };
    component: {
        CreateEvent: AnyComponent;
        EditEvent: AnyComponent;
        CalendarView: AnyComponent;
        PersonsPresenter: AnyComponent;
        Events: AnyComponent;
        DateTimePresenter: AnyComponent;
        DocReminder: AnyComponent;
        ConnectApp: AnyComponent;
    };
    string: {
        Title: IntlString;
        Calendar: IntlString;
        Description: IntlString;
        Date: IntlString;
        DueTo: IntlString;
        Calendars: IntlString;
        CreateCalendar: IntlString;
        Location: IntlString;
        Participants: IntlString;
        NoParticipants: IntlString;
        PersonsLabel: IntlString;
        EventNumber: IntlString;
        Reminders: IntlString;
        Today: IntlString;
        Visibility: IntlString;
        Public: IntlString;
        FreeBusy: IntlString;
        Busy: IntlString;
        Private: IntlString;
        NotAllPermissions: IntlString;
    };
    handler: {
        DisconnectHandler: Handler;
    };
    integrationType: {
        Calendar: Ref<IntegrationType>;
    };
    metadata: {
        CalendarServiceURL: Metadata<string>;
    };
    extensions: {
        EditEventExtensions: ComponentExtensionId;
    };
    ids: {
        ReminderNotification: Ref<NotificationType>;
        NoAttached: Ref<Event>;
    };
};
export default calendarPlugin;
export * from './utils';
//# sourceMappingURL=index.d.ts.map