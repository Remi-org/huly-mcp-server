import type { Id } from './platform';
/**
 * Platform Metadata Identifier (PMI).
 *
 * 'Metadata' is simply any JavaScript object, which is used to configure platform, e.g. IP addresses.
 * Another example of metadata is an asset URL. The logic behind providing asset URLs as metadata is
 * we know URL at compile time only and URLs vary depending on deployment options.
 *
 * @public
 */
export type Metadata<T> = Id & {
    __metadata: T;
};
/**
 * @public
 */
export type ExtractType<T, X extends Record<string, Metadata<T>>> = {
    [P in keyof X]: X[P] extends Metadata<infer Z> ? Z : never;
};
/**
 * @public
 * @param id -
 * @returns
 */
export declare function getMetadata<T>(id: Metadata<T>): T | undefined;
/**
 * @public
 * @param id -
 * @param value -
 */
export declare function setMetadata<T>(id: Metadata<T>, value: T): void;
/**
 * @public
 * @param ids -
 * @param data -
 */
export declare function loadMetadata<T, X extends Record<string, Metadata<T>>>(ids: X, data: ExtractType<T, X>): void;
//# sourceMappingURL=metadata.d.ts.map