import type { RateLimitInfo } from './rpc';
export declare class SlidingWindowRateLimitter {
    readonly rateLimitMax: number;
    readonly rateLimitWindow: number;
    readonly now: () => number;
    private readonly rateLimits;
    constructor(rateLimitMax: number, rateLimitWindow: number, now?: () => number);
    checkRateLimit(groupId: string): RateLimitInfo;
    reset(): void;
}
//# sourceMappingURL=sliding.d.ts.map