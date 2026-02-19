import { Ref } from '.';
import type { Doc, Mixin } from './classes';
export declare const PROXY_MIXIN_CLASS_KEY = "$__mixin";
/**
 * @internal
 */
export declare function _createMixinProxy(mixin: Mixin<Doc>, ancestorProxy: ProxyHandler<Doc> | null): ProxyHandler<Doc>;
export declare function freeze(value: any): any;
/**
 * @internal
 */
export declare function _createFreezeProxy(doc: Doc): ProxyHandler<Doc>;
/**
 * @internal
 */
export declare function _toDoc<D extends Doc>(doc: D): D;
/**
 * @internal
 */
export declare function _mixinClass<D extends Doc, M extends D>(doc: D): Ref<Mixin<M>> | undefined;
//# sourceMappingURL=proxy.d.ts.map