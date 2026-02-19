import { Employee, Person } from '@hcengineering/contact';
import { AttachedDoc, Attribute, Class, MarkupBlobRef, CollectionSize, Data, Doc, Markup, Mixin, Ref, RelatedDocument, Space, Status, Timestamp, Type } from '@hcengineering/core';
import { Asset, IntlString, Plugin, Resource } from '@hcengineering/platform';
import { Preference } from '@hcengineering/preference';
import { TagCategory, TagElement, TagReference } from '@hcengineering/tags';
import { ToDo } from '@hcengineering/time';
import { ProjectType, ProjectTypeDescriptor, Task, Project as TaskProject, TaskStatusFactory, TaskType, TaskTypeDescriptor } from '@hcengineering/task';
import { AnyComponent, ComponentExtensionId, Location, ResolvedLocation } from '@hcengineering/ui';
import { Action, ActionCategory, IconProps } from '@hcengineering/view';
export * from './analytics';
/**
 * @public
 */
export interface IssueStatus extends Status {
}
/**
 * @public
 */
export interface Project extends TaskProject, IconProps {
    identifier: string;
    sequence: number;
    defaultIssueStatus: Ref<IssueStatus>;
    defaultAssignee?: Ref<Employee>;
    defaultTimeReportDay: TimeReportDayType;
}
/**
 * @public
 */
export interface ProjectTargetPreference extends Preference {
    attachedTo: Ref<Project>;
    usedOn: Timestamp;
    props?: {
        key: string;
        value: any;
    }[];
}
export type RelatedIssueKind = 'classRule' | 'spaceRule';
export interface RelatedClassRule {
    kind: 'classRule';
    ofClass: Ref<Class<Doc>>;
}
export interface RelatedSpaceRule {
    kind: 'spaceRule';
    space: Ref<Space>;
}
/**
 * @public
 *
 * If defined, will be used to set a default project for this kind of document's related issues.
 */
export interface RelatedIssueTarget extends Doc {
    target?: Ref<Project> | null;
    rule: RelatedClassRule | RelatedSpaceRule;
}
/**
 * @public
 */
export declare enum TimeReportDayType {
    CurrentWorkDay = "CurrentWorkDay",
    PreviousWorkDay = "PreviousWorkDay"
}
/**
 * @public
 */
export declare enum IssuePriority {
    NoPriority = 0,
    Urgent = 1,
    High = 2,
    Medium = 3,
    Low = 4
}
/**
 * @public
 */
export declare enum IssuesGrouping {
    Status = "status",
    Assignee = "assignee",
    Priority = "priority",
    Component = "component",
    Milestone = "milestone",
    NoGrouping = "#no_category"
}
/**
 * @public
 */
export declare enum IssuesOrdering {
    Status = "status",
    Priority = "priority",
    LastUpdated = "modifiedOn",
    DueDate = "dueDate",
    Manual = "rank"
}
/**
 * @public
 */
export declare enum IssuesDateModificationPeriod {
    All = "all",
    PastWeek = "pastWeek",
    PastMonth = "pastMonth"
}
/**
 * @public
 */
export declare enum MilestoneStatus {
    Planned = 0,
    InProgress = 1,
    Completed = 2,
    Canceled = 3
}
/**
 * @public
 */
export interface Milestone extends Doc {
    label: string;
    description?: Markup;
    status: MilestoneStatus;
    space: Ref<Project>;
    comments: number;
    attachments?: number;
    targetDate: Timestamp;
}
/**
 * @public
 */
export interface Issue extends Task {
    attachedTo: Ref<Issue>;
    title: string;
    description: MarkupBlobRef | null;
    status: Ref<IssueStatus>;
    priority: IssuePriority;
    component: Ref<Component> | null;
    subIssues: CollectionSize<Issue>;
    blockedBy?: RelatedDocument[];
    relations?: RelatedDocument[];
    parents: IssueParentInfo[];
    space: Ref<Project>;
    milestone?: Ref<Milestone> | null;
    estimation: number;
    remainingTime: number;
    reportedTime: number;
    reports: CollectionSize<TimeSpendReport>;
    childInfo: IssueChildInfo[];
    template?: {
        template: Ref<IssueTemplate>;
        childId?: string;
    };
    todos?: CollectionSize<ToDo>;
}
/**
 * @public
 */
export interface IssueDraft {
    kind: Ref<TaskType>;
    _id: Ref<Issue>;
    title: string;
    description: Markup;
    status?: Ref<IssueStatus>;
    priority: IssuePriority;
    assignee: Ref<Person> | null;
    component: Ref<Component> | null;
    space: Ref<Project>;
    dueDate: Timestamp | null;
    milestone?: Ref<Milestone> | null;
    estimation: number;
    parentIssue?: Ref<Issue>;
    attachments?: number;
    labels: TagReference[];
    subIssues: IssueDraft[];
    template?: {
        template: Ref<IssueTemplate>;
        childId?: string;
    };
}
/**
 * @public
 */
export interface IssueTemplateData {
    title: string;
    description: Markup;
    priority: IssuePriority;
    assignee: Ref<Person> | null;
    component: Ref<Component> | null;
    milestone?: Ref<Milestone> | null;
    estimation: number;
    labels?: Ref<TagElement>[];
    kind?: Ref<TaskType>;
}
/**
 * @public
 */
export interface IssueTemplateChild extends IssueTemplateData {
    id: Ref<Issue>;
}
/**
 * @public
 */
export interface IssueTemplate extends Doc, IssueTemplateData {
    space: Ref<Project>;
    children: IssueTemplateChild[];
    comments: number;
    attachments?: number;
    relations?: RelatedDocument[];
}
/**
 * @public
 *
 * Declares time spend entry
 */
export interface TimeSpendReport extends AttachedDoc {
    attachedTo: Ref<Issue>;
    employee: Ref<Employee> | null;
    date: Timestamp | null;
    value: number;
    description: string;
}
/**
 * @public
 */
export interface IssueParentInfo {
    parentId: Ref<Issue>;
    identifier: string;
    parentTitle: string;
    space: Ref<Space>;
}
/**
 * @public
 */
export interface IssueChildInfo {
    childId: Ref<Issue>;
    estimation: number;
    reportedTime: number;
}
/**
 * @public
 */
export interface Document extends Doc {
    title: string;
    icon: string | null;
    color: number;
    content?: Markup;
    space: Ref<Project>;
}
/**
 * @public
 */
export interface Component extends Doc {
    label: string;
    description?: Markup;
    lead: Ref<Employee> | null;
    space: Ref<Project>;
    comments: number;
    attachments?: number;
}
/**
 * @public
 */
export declare const trackerId: Plugin;
export * from './analytics';
declare const pluginState: {
    class: {
        Project: Ref<Class<Project>>;
        Issue: Ref<Class<Issue>>;
        IssueTemplate: Ref<Class<IssueTemplate>>;
        Component: Ref<Class<Component>>;
        IssueStatus: Ref<Class<IssueStatus>>;
        TypeIssuePriority: Ref<Class<Type<IssuePriority>>>;
        Milestone: Ref<Class<Milestone>>;
        TypeMilestoneStatus: Ref<Class<Type<MilestoneStatus>>>;
        TimeSpendReport: Ref<Class<TimeSpendReport>>;
        TypeReportedTime: Ref<Class<Type<number>>>;
        TypeEstimation: Ref<Class<Type<number>>>;
        TypeRemainingTime: Ref<Class<Type<number>>>;
        RelatedIssueTarget: Ref<Class<RelatedIssueTarget>>;
        ProjectTargetPreference: Ref<Class<ProjectTargetPreference>>;
    };
    mixin: {
        ClassicProjectTypeData: Ref<Mixin<Project>>;
        IssueTypeData: Ref<Mixin<Issue>>;
    };
    ids: {
        NoParent: Ref<Issue>;
        IssueDraft: string;
        IssueDraftChild: string;
        ClassingProjectType: Ref<ProjectType>;
    };
    status: {
        Backlog: Ref<Status>;
        Todo: Ref<Status>;
        InProgress: Ref<Status>;
        Coding: Ref<Status>;
        UnderReview: Ref<Status>;
        Done: Ref<Status>;
        Canceled: Ref<Status>;
    };
    component: {
        Tracker: AnyComponent;
        TrackerApp: AnyComponent;
        RelatedIssues: AnyComponent;
        RelatedIssuesSection: AnyComponent;
        RelatedIssueSelector: AnyComponent;
        RelatedIssueTemplates: AnyComponent;
        EditIssue: AnyComponent;
        CreateIssue: AnyComponent;
        ProjectPresenter: AnyComponent;
        CreateIssueTemplate: AnyComponent;
        CreateProject: AnyComponent;
        IssueStatusPresenter: AnyComponent;
        LabelsView: AnyComponent;
    };
    attribute: {
        IssueStatus: Ref<Attribute<Status>>;
    };
    icon: {
        TrackerApplication: Asset;
        Component: Asset;
        Issue: Asset;
        Subissue: Asset;
        Project: Asset;
        Relations: Asset;
        Inbox: Asset;
        MyIssues: Asset;
        Views: Asset;
        Issues: Asset;
        Components: Asset;
        NewIssue: Asset;
        Magnifier: Asset;
        Labels: Asset;
        DueDate: Asset;
        Parent: Asset;
        UnsetParent: Asset;
        Milestone: Asset;
        IssueTemplates: Asset;
        Start: Asset;
        Stop: Asset;
        CategoryBacklog: Asset;
        CategoryUnstarted: Asset;
        CategoryStarted: Asset;
        CategoryCompleted: Asset;
        CategoryCanceled: Asset;
        PriorityNoPriority: Asset;
        PriorityUrgent: Asset;
        PriorityHigh: Asset;
        PriorityMedium: Asset;
        PriorityLow: Asset;
        ComponentsList: Asset;
        MilestoneStatusPlanned: Asset;
        MilestoneStatusInProgress: Asset;
        MilestoneStatusPaused: Asset;
        MilestoneStatusCompleted: Asset;
        MilestoneStatusCanceled: Asset;
        CopyBranch: Asset;
        Duplicate: Asset;
        TimeReport: Asset;
        Estimation: Asset;
        Home: Asset;
        RedCircle: Asset;
    };
    category: {
        Other: Ref<TagCategory>;
        Tracker: Ref<ActionCategory>;
    };
    descriptors: {
        ProjectType: Ref<ProjectTypeDescriptor>;
        Issue: Ref<TaskTypeDescriptor>;
    };
    action: {
        SetDueDate: Ref<Action<Doc<Space>, any>>;
        SetParent: Ref<Action<Doc<Space>, any>>;
        SetStatus: Ref<Action<Doc<Space>, Record<string, any>>>;
        SetPriority: Ref<Action<Doc<Space>, any>>;
        SetAssignee: Ref<Action<Doc<Space>, any>>;
        SetComponent: Ref<Action<Doc<Space>, any>>;
        CopyIssueId: Ref<Action<Doc<Space>, any>>;
        CopyIssueTitle: Ref<Action<Doc<Space>, any>>;
        CopyIssueLink: Ref<Action<Doc<Space>, any>>;
        MoveToProject: Ref<Action<Doc<Space>, Record<string, any>>>;
        Duplicate: Ref<Action<Doc<Space>, any>>;
        Relations: Ref<Action<Doc<Space>, any>>;
        NewIssue: Ref<Action<Doc<Space>, any>>;
        NewIssueGlobal: Ref<Action<Doc<Space>, any>>;
        NewSubIssue: Ref<Action<Doc<Space>, any>>;
        EditWorkflowStatuses: Ref<Action<Doc<Space>, Record<string, any>>>;
        EditProject: Ref<Action<Doc<Space>, Record<string, any>>>;
        SetMilestone: Ref<Action<Doc<Space>, any>>;
        SetLabels: Ref<Action<Doc<Space>, any>>;
        EditRelatedTargets: Ref<Action<Doc<Space>, any>>;
        UnsetParent: Ref<Action<Doc<Space>, any>>;
    };
    project: {
        DefaultProject: Ref<Project>;
    };
    resolver: {
        Location: Resource<(loc: Location) => Promise<ResolvedLocation | undefined>>;
    };
    string: {
        TrackerApplication: IntlString;
        ConfigLabel: IntlString;
        NewRelatedIssue: IntlString;
        IssueNotificationTitle: IntlString;
        IssueNotificationBody: IntlString;
        IssueNotificationChanged: IntlString;
        IssueNotificationChangedProperty: IntlString;
        IssueNotificationMessage: IntlString;
        IssueAssignedToYou: IntlString;
        Project: IntlString;
        RelatedIssues: IntlString;
        Issue: IntlString;
        NewProject: IntlString;
        UnsetParentIssue: IntlString;
    };
    extensions: {
        IssueListHeader: ComponentExtensionId;
        EditIssueHeader: ComponentExtensionId;
        EditIssueTitle: ComponentExtensionId;
    };
    taskTypes: {
        Issue: Ref<TaskType>;
        SubIssue: Ref<TaskType>;
    };
};
export default pluginState;
/**
 * @public
 */
export declare function createStatesData(data: TaskStatusFactory[]): Omit<Data<Status>, 'rank'>[];
//# sourceMappingURL=index.d.ts.map