import type { Doc } from './classes';
/**
 * @internal
 */
export type _OperatorFunc = (doc: Doc, op: any) => void;
/**
 * @public
 */
export declare function isOperator(o: Record<string, any>): boolean;
/**
 * @internal
 * @param name -
 * @returns
 */
export declare function _getOperator(name: string): _OperatorFunc;
//# sourceMappingURL=operator.d.ts.map