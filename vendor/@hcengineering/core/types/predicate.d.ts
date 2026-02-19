import type { Doc } from './classes';
type Predicate = (docs: Doc[]) => Doc[];
export declare function isPredicate(o: Record<string, any>): boolean;
export declare function createPredicates(o: Record<string, any>, propertyKey: string): Predicate[];
export {};
//# sourceMappingURL=predicate.d.ts.map