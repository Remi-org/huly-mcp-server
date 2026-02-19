import { FullParamsType, Metrics, ParamsType } from './types';
/**
 * @public
 */
export declare const globals: Metrics;
/**
 * @public
 * @returns
 */
export declare function newMetrics(): Metrics;
/**
 * Measure with tree expansion. Operation counter will be added only to leaf's.
 * @public
 */
export declare function measure(metrics: Metrics, params: ParamsType, fullParams?: FullParamsType | (() => FullParamsType), endOp?: (spend: number) => void): () => void;
export declare function updateMeasure(metrics: Metrics, st: number, params: ParamsType, fullParams: FullParamsType | (() => FullParamsType), endOp?: (spend: number) => void, value?: number, override?: boolean): void;
/**
 * @public
 */
export declare function childMetrics(root: Metrics, path: string[]): Metrics;
/**
 * @public
 */
export declare function metricsAggregate(m: Metrics, limit?: number): Metrics;
/**
 * @public
 */
export declare function metricsToString(metrics: Metrics, name: string | undefined, length: number): string;
export declare function metricsToJson(metrics: Metrics): any;
/**
 * @public
 */
export declare function metricsToRows(metrics: Metrics, name?: string): (number | string)[][];
//# sourceMappingURL=metrics.d.ts.map