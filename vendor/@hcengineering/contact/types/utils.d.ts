import { AttachedData, Class, Client, Doc, Hierarchy, Ref } from '@hcengineering/core';
import { ColorDefinition } from '@hcengineering/ui';
import { AvatarProvider, AvatarType, Channel, Contact, Person } from '.';
import { GravatarPlaceholderType } from './types';
/**
 * @public
 */
export declare function getAvatarColorForId(id: string | null | undefined): string;
/**
 * @public
 */
export declare function getAvatarColors(): readonly ColorDefinition[];
/**
 * @public
 */
export declare function getAvatarColorName(color: string): string;
/**
 * @public
 */
export declare function getAvatarProviderId(kind: AvatarType): Ref<AvatarProvider> | undefined;
/**
 * @public
 */
export declare function getGravatarUrl(gravatarId: string, width?: number, placeholder?: GravatarPlaceholderType): string;
/**
 * @public
 */
export declare function checkHasGravatar(gravatarId: string, fetch?: typeof window.fetch): Promise<boolean>;
/**
 * @public
 */
export declare function findContacts(client: Client, _class: Ref<Class<Doc>>, name: string, channels: AttachedData<Channel>[]): Promise<{
    contacts: Contact[];
    channels: AttachedData<Channel>[];
}>;
/**
 * @public
 */
export declare function findPerson(client: Client, name: string, channels: AttachedData<Channel>[]): Promise<Person[]>;
/**
 * @public
 */
export declare function combineName(first: string, last: string): string;
/**
 * @public
 */
export declare function getFirstName(name: string): string;
/**
 * @public
 */
export declare function getLastName(name: string): string;
/**
 * @public
 */
export declare function formatName(name: string, lastNameFirst?: string): string;
/**
 * @public
 */
export declare function getName(hierarchy: Hierarchy, value: Contact, lastNameFirst?: string): string;
/**
 * @public
 */
export declare function formatContactName(hierarchy: Hierarchy, _class: Ref<Class<Doc>>, name: string, lastNameFirst?: string): string;
//# sourceMappingURL=utils.d.ts.map