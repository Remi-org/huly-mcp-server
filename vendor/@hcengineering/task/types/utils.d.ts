import { Class, Data, Hierarchy, IdMap, Ref, Status, TxOperations, type AnyAttribute, type Rank } from '@hcengineering/core';
import { Project, ProjectStatus, ProjectType, Task, TaskType } from '.';
export { genRanks, makeRank } from '@hcengineering/rank';
/**
 * @deprecated Prefer {@link makeRank}
 *
 * TODO: Drop after everything migrates to {@link makeRank}
 */
export declare const calcRank: (prev?: {
    rank: Rank;
}, next?: {
    rank: Rank;
}) => string;
/**
 * @public
 */
export declare function getProjectTypeStates(projectType: Ref<ProjectType> | undefined, types: IdMap<ProjectType>, statuses: IdMap<Status>): Status[];
/**
 * @public
 */
export declare function getStates(space: Project | undefined, types: IdMap<ProjectType>, statuses: IdMap<Status>): Status[];
/**
 * @public
 */
export declare function getTaskTypeStates(taskType: Ref<TaskType> | undefined, types: IdMap<TaskType>, statuses: IdMap<Status>): Status[];
/**
 * @public
 */
export declare function getStatusIndex(type: ProjectType, taskTypes: IdMap<TaskType>, status: Ref<Status>): number;
/**
 * @public
 */
export declare function createState<T extends Status>(client: TxOperations, _class: Ref<Class<T>>, data: Data<T>): Promise<Ref<T>>;
/**
 * @public
 */
export declare function calculateStatuses(projectType: {
    statuses: ProjectType['statuses'];
    tasks: ProjectType['tasks'];
}, taskTypes: Map<Ref<TaskType>, Data<TaskType>>, override: Array<{
    taskTypeId: Ref<TaskType>;
    statuses: Array<Ref<Status>>;
}>): ProjectStatus[];
/**
 * @public
 */
export declare function findStatusAttr(h: Hierarchy, _class: Ref<Class<Task>>): AnyAttribute;
export type TaskTypeWithFactory = Omit<Data<TaskType>, 'statuses' | 'parent' | 'targetClass'> & {
    _id: TaskType['_id'];
    factory: Data<Status>[];
} & Partial<Pick<TaskType, 'targetClass'>>;
type ProjectData = Omit<Data<ProjectType>, 'statuses' | 'targetClass'>;
/**
 * @public
 */
export declare function createProjectType(client: TxOperations, data: ProjectData, tasks: TaskTypeWithFactory[], _id: Ref<ProjectType>): Promise<Ref<ProjectType>>;
/**
 * @public
 */
export declare function updateProjectType(client: TxOperations, projectType: Ref<ProjectType>, tasks: TaskTypeWithFactory[]): Promise<void>;
//# sourceMappingURL=utils.d.ts.map