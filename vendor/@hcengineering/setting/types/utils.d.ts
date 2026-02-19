import { AttachedData, Class, Data, Ref, Role, Space, SpaceType, TxOperations, TypeAny as TypeAnyType } from '@hcengineering/core';
import { IntlString } from '@hcengineering/platform';
export declare function createSpaceType<T extends SpaceType>(client: TxOperations, data: Omit<Data<T>, 'targetClass'>, _id: Ref<T>, _class?: Ref<Class<T>>): Promise<Ref<T>>;
export interface RoleAttributeProps {
    label: IntlString;
    roleType: TypeAnyType;
}
export declare function getRoleAttributeProps(name: string): RoleAttributeProps;
export declare function createSpaceTypeRole(client: TxOperations, type: Pick<SpaceType, '_id' | '_class' | 'targetClass'>, data: AttachedData<Role>, _id?: Ref<Role> | undefined): Promise<Ref<Role>>;
export declare function createSpaceTypeRoles(tx: TxOperations, typeId: Ref<SpaceType>, roles: Pick<Role, '_id' | 'name' | 'permissions'>[]): Promise<void>;
export declare function deleteSpaceTypeRole(client: TxOperations, role: Role, targetClass: Ref<Class<Space>>): Promise<void>;
//# sourceMappingURL=utils.d.ts.map