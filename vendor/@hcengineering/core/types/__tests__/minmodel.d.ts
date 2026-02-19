import type { Arr, Class, Data, Doc, Interface, Mixin, Ref, Space } from '../classes';
import { AttachedDoc } from '../classes';
import type { DocumentUpdate, TxCUD, TxCreateDoc, TxRemoveDoc, TxUpdateDoc } from '../tx';
export declare function createDoc<T extends Doc>(_class: Ref<Class<T>>, attributes: Data<T>): TxCreateDoc<T>;
export declare function updateDoc<T extends Doc>(_class: Ref<Class<T>>, space: Ref<Space>, objectId: Ref<T>, operations: DocumentUpdate<T>): TxUpdateDoc<Doc>;
export declare function deleteDoc<T extends Doc>(_class: Ref<Class<T>>, space: Ref<Space>, objectId: Ref<T>): TxRemoveDoc<Doc>;
export interface TestMixin extends Doc {
    arr: Arr<string>;
}
export interface AttachedComment extends AttachedDoc {
    message: string;
}
export interface WithState extends Doc {
    state: number;
    number: number;
}
export interface Task extends Doc, WithState {
    name: string;
}
export interface TaskMixinTodos extends Task {
    todos: number;
}
export interface TaskMixinTodo extends AttachedDoc {
    text: string;
}
export interface TaskCheckItem extends AttachedDoc, WithState {
    name: string;
    complete: boolean;
}
export declare const test: {
    mixin: {
        TestMixin: Ref<Mixin<TestMixin>>;
        TaskMixinTodos: Ref<Mixin<TaskMixinTodos>>;
    };
    class: {
        Task: Ref<Class<Task>>;
        TaskCheckItem: Ref<Class<TaskCheckItem>>;
        TestComment: Ref<Class<AttachedComment>>;
        TestMixinTodo: Ref<Mixin<TaskMixinTodo>>;
    };
    interface: {
        WithState: Ref<Interface<WithState>>;
        DummyWithState: Ref<Interface<WithState>>;
    };
};
/**
 * Generate minimal model for testing purposes.
 * @returns R
 */
export declare function genMinModel(): TxCUD<Doc>[];
//# sourceMappingURL=minmodel.d.ts.map