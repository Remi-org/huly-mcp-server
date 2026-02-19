import { DocumentQuery, type MemDb } from '.';
import { Class, Doc, Ref } from './classes';
import { Hierarchy } from './hierarchy';
import { SortingQuery } from './storage';
/**
 * @public
 */
export declare function findProperty(objects: Doc[], propertyKey: string, value: any): Doc[];
/**
 * @public
 */
export declare function resultSort<T extends Doc>(result: T[], sortOptions: SortingQuery<T>, _class: Ref<Class<T>>, hierarchy: Hierarchy, modelDb: MemDb): void;
/**
 * @public
 */
export declare function matchQuery<T extends Doc>(docs: Doc[], query: DocumentQuery<T>, clazz: Ref<Class<T>>, hierarchy: Hierarchy, skipLookup?: boolean): Doc[];
/**
 * @public
 */
export declare function checkMixinKey<T extends Doc>(key: string, clazz: Ref<Class<T>>, hierarchy: Hierarchy): string;
//# sourceMappingURL=query.d.ts.map