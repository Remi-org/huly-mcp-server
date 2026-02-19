import { FullParamsType, MeasureContext, MeasureLogger, Metrics, ParamsType, type OperationLog } from './types';
/**
 * @public
 */
export declare class MeasureMetricsContext implements MeasureContext {
    readonly parent?: MeasureContext<any> | undefined;
    readonly logParams?: ParamsType | undefined;
    private readonly name;
    private readonly params;
    private readonly fullParams;
    logger: MeasureLogger;
    metrics: Metrics;
    id?: string;
    st: number;
    contextData: object;
    private done;
    constructor(name: string, params: ParamsType, fullParams?: FullParamsType | (() => FullParamsType), metrics?: Metrics, logger?: MeasureLogger, parent?: MeasureContext<any> | undefined, logParams?: ParamsType | undefined);
    measure(name: string, value: number, override?: boolean): void;
    newChild(name: string, params: ParamsType, fullParams?: FullParamsType | (() => FullParamsType), logger?: MeasureLogger): MeasureContext;
    with<T>(name: string, params: ParamsType, op: (ctx: MeasureContext) => T | Promise<T>, fullParams?: ParamsType | (() => FullParamsType)): Promise<T>;
    withSync<T>(name: string, params: ParamsType, op: (ctx: MeasureContext) => T, fullParams?: ParamsType | (() => FullParamsType)): T;
    withLog<T>(name: string, params: ParamsType, op: (ctx: MeasureContext) => T | Promise<T>, fullParams?: ParamsType): Promise<T>;
    error(message: string, args?: Record<string, any>): void;
    info(message: string, args?: Record<string, any>): void;
    warn(message: string, args?: Record<string, any>): void;
    end(): void;
}
export declare class NoMetricsContext implements MeasureContext {
    logger: MeasureLogger;
    id?: string;
    contextData: object;
    constructor(logger?: MeasureLogger);
    measure(name: string, value: number, override?: boolean): void;
    newChild(name: string, params: ParamsType, fullParams?: FullParamsType | (() => FullParamsType), logger?: MeasureLogger): MeasureContext;
    with<T>(name: string, params: ParamsType, op: (ctx: MeasureContext) => T | Promise<T>, fullParams?: ParamsType | (() => FullParamsType)): Promise<T>;
    withSync<T>(name: string, params: ParamsType, op: (ctx: MeasureContext) => T, fullParams?: ParamsType | (() => FullParamsType)): T;
    withLog<T>(name: string, params: ParamsType, op: (ctx: MeasureContext) => T | Promise<T>, fullParams?: ParamsType): Promise<T>;
    error(message: string, args?: Record<string, any>): void;
    info(message: string, args?: Record<string, any>): void;
    warn(message: string, args?: Record<string, any>): void;
    end(): void;
}
/**
 * Allow to use decorator for context enabled functions
 */
export declare function withContext(name: string, params?: ParamsType): any;
export declare function setOperationLogProfiling(value: boolean): void;
export declare function registerOperationLog(ctx: MeasureContext): {
    opLogMetrics?: Metrics;
    op?: OperationLog;
};
export declare function updateOperationLog(opLogMetrics: Metrics | undefined, op: OperationLog | undefined): void;
export declare function addOperation<T>(ctx: MeasureContext, name: string, params: ParamsType, op: (ctx: MeasureContext) => Promise<T>, fullParams?: FullParamsType): Promise<T>;
//# sourceMappingURL=context.d.ts.map