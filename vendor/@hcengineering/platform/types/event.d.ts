import { Status } from './status';
/**
 * @public
 */
export declare const PlatformEvent = "platform-event";
/**
 * @public
 */
export type EventListener = (event: string, data: any) => Promise<void>;
/**
 * @public
 * @param event -
 * @param listener -
 */
export declare function addEventListener(event: string, listener: EventListener): void;
/**
 * @public
 * @param event -
 * @param listener -
 */
export declare function removeEventListener(event: string, listener: EventListener): void;
/**
 * @public
 */
export declare function broadcastEvent(event: string, data: any): Promise<void>;
/**
 * @public
 * @param status -
 * @returns
 */
export declare function setPlatformStatus(status: Status): Promise<void>;
/**
 * @public
 * @param status -
 * @param promise -
 * @returns
 */
export declare function monitor<T>(status: Status, promise: Promise<T>): Promise<T>;
//# sourceMappingURL=event.d.ts.map