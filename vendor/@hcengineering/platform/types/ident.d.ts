import type { Id, Plugin } from './platform';
/**
 * @internal
 */
export interface _IdInfo {
    component: Plugin;
    kind: string;
    name: string;
}
/**
 * @internal
 */
export declare function _parseId(id: Id): _IdInfo;
//# sourceMappingURL=ident.d.ts.map