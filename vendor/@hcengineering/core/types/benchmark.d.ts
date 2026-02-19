import { Doc, type Domain } from './classes';
/**
 * @public
 */
export declare const DOMAIN_BENCHMARK: Domain;
export type BenchmarkDocRange = number | {
    from: number;
    to: number;
};
export interface BenchmarkDoc extends Doc {
    source?: string;
    request?: {
        documents: BenchmarkDocRange;
        size: BenchmarkDocRange;
        derived?: BenchmarkDocRange;
    };
    response?: string;
}
//# sourceMappingURL=benchmark.d.ts.map