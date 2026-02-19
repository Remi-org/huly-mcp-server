import type { Plugin, Resource } from './platform';
/**
 * @public
 */
export type Resources = Record<string, Record<string, any>>;
/**
 * @public
 */
export interface PluginModule<R extends Resources> {
    default: () => Promise<R>;
}
/**
 * @public
 */
export type PluginLoader<R extends Resources> = () => Promise<PluginModule<R>>;
/**
 * @public
 * @param plugin -
 * @param module -
 */
export declare function addLocation<R extends Resources>(plugin: Plugin, module: PluginLoader<R>): void;
/**
 * @public
 * return list of registred plugins.
 */
export declare function getPlugins(): Plugin[];
/**
 * @public
 * @param resource -
 * @returns
 */
export declare function getResource<T>(resource: Resource<T>): Promise<T>;
/**
 * @public
 * @param resource -
 * @returns
 */
export declare function getResourceP<T>(resource: Resource<T>): T | Promise<T>;
/**
 * @public
 * @param resource -
 * @returns
 */
export declare function getResourceC<T>(resource: Resource<T> | undefined, callback: (resource: T | undefined) => void): void;
/**
 * @public
 */
export declare function getResourcePlugin<T>(resource: Resource<T>): Plugin;
//# sourceMappingURL=resource.d.ts.map