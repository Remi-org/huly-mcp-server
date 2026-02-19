import type { Person } from '@hcengineering/contact';
import { AttachedDoc, Attribute, Class, Doc, Mixin, type Rank, Ref, Space, Status, StatusCategory, Timestamp, SpaceType, SpaceTypeDescriptor, TypedSpace } from '@hcengineering/core';
import { NotificationType } from '@hcengineering/notification';
import type { Asset, IntlString, Plugin, Resource } from '@hcengineering/platform';
import type { AnyComponent, ComponentExtensionId } from '@hcengineering/ui';
import { Action, IconProps, ViewletDescriptor } from '@hcengineering/view';
export * from './utils';
export type { Rank } from '@hcengineering/rank';
/** @public */
export interface DocWithRank extends Doc {
    rank: Rank;
}
export interface Project extends TypedSpace {
    type: Ref<ProjectType>;
}
/**
 * @public
 */
export interface Task extends AttachedDoc {
    kind: Ref<TaskType>;
    status: Ref<Status>;
    isDone?: boolean;
    number: number;
    assignee: Ref<Person> | null;
    dueDate: Timestamp | null;
    comments?: number;
    attachments?: number;
    labels?: number;
    identifier: string;
    rank: Rank;
}
/**
 * @public
 */
export interface KanbanCard extends Class<Doc> {
    card: AnyComponent;
}
export interface ProjectStatus extends IconProps {
    _id: Ref<Status>;
    taskType: Ref<TaskType>;
}
/**
 * @public
 */
export type TaskTypeKind = 'task' | 'subtask' | 'both';
/**
 * @public
 */
export interface TaskTypeDescriptor extends Doc {
    name: IntlString;
    description: IntlString;
    icon: Asset;
    baseClass: Ref<Class<Task>>;
    allowCreate: boolean;
    statusCategoriesFunc?: Resource<(project: ProjectType) => Ref<StatusCategory>[]>;
    openTasks?: Resource<(value: TaskType) => Promise<void>>;
}
/**
 * @public
 */
export interface TaskStatusFactory {
    category: Ref<StatusCategory>;
    statuses: (string | [string, number, Ref<Status>?])[];
}
/**
 * @public
 */
export interface TaskType extends Doc, IconProps {
    parent: Ref<ProjectType>;
    descriptor: Ref<TaskTypeDescriptor>;
    name: string;
    kind: TaskTypeKind;
    allowedAsChildOf?: Ref<TaskType>[];
    ofClass: Ref<Class<Task>>;
    targetClass: Ref<Class<Task>>;
    statuses: Ref<Status>[];
    statusClass: Ref<Class<Status>>;
    statusCategories: Ref<StatusCategory>[];
}
/**
 * @public
 *
 * A a mixin for Class bind to taskType.
 */
export interface TaskTypeClass extends Class<TaskType> {
    taskType: Ref<TaskType>;
    projectType: Ref<ProjectType>;
}
/**
 * @public
 *
 * A a mixin for Class bind to taskType.
 */
export interface ProjectTypeClass extends Class<ProjectType> {
    projectType: Ref<ProjectType>;
}
/**
 * @public
 *
 * Define a user customized project type.
 */
export interface ProjectType extends SpaceType {
    descriptor: Ref<ProjectTypeDescriptor>;
    tasks: Ref<TaskType>[];
    description: string;
    statuses: ProjectStatus[];
    targetClass: Ref<Class<Project>>;
    classic: boolean;
}
/**
 * @public
 */
export interface ProjectTypeDescriptor extends SpaceTypeDescriptor {
    allowedClassic?: boolean;
    allowedTaskTypeDescriptors?: Ref<TaskTypeDescriptor>[];
    baseClass: Ref<Class<Project>>;
    editor?: AnyComponent;
}
/**
 * @public
 */
export declare enum TaskOrdering {
    State = "state",
    LastUpdated = "modifiedOn",
    DueDate = "dueDate",
    Manual = "rank"
}
/**
 * @public
 */
export declare const taskId: Plugin;
/**
 * @public
 */
declare const task: {
    app: {
        Tasks: Ref<Doc<Space>>;
    };
    action: {
        Move: Ref<Action<Doc<Space>, Record<string, any>>>;
    };
    mixin: {
        KanbanCard: Ref<Mixin<KanbanCard>>;
        TaskTypeClass: Ref<Mixin<TaskTypeClass>>;
        ProjectTypeClass: Ref<Mixin<ProjectTypeClass>>;
    };
    attribute: {
        State: Ref<Attribute<Status>>;
    };
    string: {
        StartDate: IntlString;
        DueDate: IntlString;
        TaskState: IntlString;
        TaskStateTitle: IntlString;
        TaskStateDone: IntlString;
        TaskNumber: IntlString;
        Todo: IntlString;
        TaskDone: IntlString;
        TaskDueTo: IntlString;
        TaskParent: IntlString;
        IssueName: IntlString;
        TaskComments: IntlString;
        TaskLabels: IntlString;
        Rank: IntlString;
        EditStates: IntlString;
        MarkAsDone: IntlString;
        MarkAsUndone: IntlString;
        Kanban: IntlString;
        ApplicationLabelTask: IntlString;
        AssignedToMe: IntlString;
        Dashboard: IntlString;
        ProjectTypes: IntlString;
        TaskType: IntlString;
        ProjectType: IntlString;
        Identifier: IntlString;
    };
    class: {
        ProjectTypeDescriptor: Ref<Class<ProjectTypeDescriptor>>;
        ProjectType: Ref<Class<ProjectType>>;
        Project: Ref<Class<Project>>;
        TaskTypeDescriptor: Ref<Class<TaskTypeDescriptor>>;
        TaskType: Ref<Class<TaskType>>;
        Task: Ref<Class<Task>>;
    };
    viewlet: {
        Kanban: Ref<ViewletDescriptor>;
        Dashboard: Ref<ViewletDescriptor>;
        StatusTable: Ref<ViewletDescriptor>;
    };
    icon: {
        Task: Asset;
        Kanban: Asset;
        TodoCheck: Asset;
        TodoUnCheck: Asset;
        ManageTemplates: Asset;
        TaskState: Asset;
        Dashboard: Asset;
    };
    global: {
        Task: Ref<Task>;
    };
    space: {
        Sequence: Ref<Space>;
        Statuses: Ref<Space>;
    };
    statusCategory: {
        UnStarted: Ref<StatusCategory>;
        ToDo: Ref<StatusCategory>;
        Active: Ref<StatusCategory>;
        Won: Ref<StatusCategory>;
        Lost: Ref<StatusCategory>;
    };
    component: {
        ProjectTypeSelector: AnyComponent;
        CreateStatePopup: AnyComponent;
    };
    ids: {
        AssigneedNotification: Ref<NotificationType>;
        ManageProjects: Ref<Doc<Space>>;
    };
    extensions: {
        ProjectEditorExtension: ComponentExtensionId;
    };
};
export default task;
//# sourceMappingURL=index.d.ts.map