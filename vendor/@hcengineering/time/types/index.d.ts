import type { Asset, Plugin, Resource } from '@hcengineering/platform';
import { AttachedDoc, Class, CollectionSize, Doc, Hierarchy, Markup, Mixin, Ref, Space, Timestamp, Type } from '@hcengineering/core';
import { IntlString } from '@hcengineering/platform';
import { Event, Visibility } from '@hcengineering/calendar';
import { AnyComponent } from '@hcengineering/ui';
import { Person } from '@hcengineering/contact';
import type { Rank } from '@hcengineering/rank';
export * from './analytics';
/**
 * @public
 */
export declare const timeId: Plugin;
/**
 * @public
 */
export interface WorkSlot extends Event {
    attachedTo: Ref<ToDo>;
    attachedToClass: Ref<Class<ToDo>>;
}
/**
 * @public
 */
export interface ToDo extends AttachedDoc {
    attachedTo: Ref<Doc>;
    attachedToClass: Ref<Class<Doc>>;
    workslots: number;
    title: string;
    description: Markup;
    dueDate?: Timestamp | null;
    priority: ToDoPriority;
    visibility: Visibility;
    doneOn?: Timestamp | null;
    user: Ref<Person>;
    attachedSpace?: Ref<Space>;
    labels?: number;
    rank: Rank;
}
/**
 * @public
 */
export interface Todoable {
    todos?: CollectionSize<ToDo>;
}
/**
 * @public
 */
export declare enum ToDoPriority {
    High = 0,
    Medium = 1,
    Low = 2,
    NoPriority = 3,
    Urgent = 4
}
/**
 * @public
 */
export interface ProjectToDo extends ToDo {
    attachedSpace: Ref<Space>;
}
/**
 * @public
 */
export interface ItemPresenter extends Class<Doc> {
    presenter: AnyComponent;
}
/**
 * @public
 */
export type TodoDoneTester = (client: {
    findAll: Storage['findAll'];
    hierarchy: Hierarchy;
}, todo: ToDo) => Promise<boolean>;
/**
 * A helper class to control classic project todo automation.
 */
export interface TodoAutomationHelper extends Doc {
    onDoneTester: Resource<TodoDoneTester>;
}
declare const _default: {
    component: {
        Me: AnyComponent;
        Team: AnyComponent;
        EditToDo: AnyComponent;
    };
    class: {
        WorkSlot: Ref<Class<WorkSlot>>;
        ToDo: Ref<Class<ToDo>>;
        ProjectToDo: Ref<Class<ProjectToDo>>;
        TypeToDoPriority: Ref<Class<Type<ToDoPriority>>>;
        TodoAutomationHelper: Ref<Class<TodoAutomationHelper>>;
    };
    mixin: {
        ItemPresenter: Ref<Mixin<ItemPresenter>>;
    };
    ids: {
        NotAttached: Ref<Doc<Space>>;
    };
    space: {
        ToDos: Ref<Space>;
    };
    icon: {
        Team: Asset;
        Hashtag: Asset;
        Inbox: Asset;
        Calendar: Asset;
        Flag: Asset;
        FilledFlag: Asset;
        Planned: Asset;
        All: Asset;
    };
    string: {
        Planner: IntlString;
        Calendar: IntlString;
        Agenda: IntlString;
        Me: IntlString;
        Team: IntlString;
        WeekCalendar: IntlString;
        DayCalendar: IntlString;
        CreatedToDo: IntlString;
        AddToDo: IntlString;
        NewToDoDetails: IntlString;
        ToDo: IntlString;
        NewToDo: IntlString;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map