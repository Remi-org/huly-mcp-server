/**
 * Anticrm Platform Foundation Types
 * @packageDocumentation
 */
import type { StatusCode } from './platform';
/**
 * Status severity
 * @public
 */
export declare enum Severity {
    OK = "OK",
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR"
}
/**
 * Status of an operation
 * @public
 */
export declare class Status<P extends Record<string, any> = any> {
    readonly severity: Severity;
    readonly code: StatusCode<P>;
    readonly params: P;
    constructor(severity: Severity, code: StatusCode<P>, params: P);
}
/**
 * Error object wrapping `Status`
 * @public
 */
export declare class PlatformError<P extends Record<string, any>> extends Error {
    readonly status: Status<P>;
    constructor(status: Status<P>);
}
/**
 * OK Status
 * @public
 */
export declare const OK: Status<any>;
/**
 * Error Status
 * @public
 */
export declare const ERROR: Status<any>;
/**
 * Error Status for Unauthorized
 * @public
 */
export declare const UNAUTHORIZED: Status<any>;
/**
 * @public
 * @param message -
 * @returns
 */
export declare function unknownStatus(message: string): Status<any>;
/**
 * Creates unknown error status
 * @public
 */
export declare function unknownError(err: unknown): Status;
//# sourceMappingURL=status.d.ts.map