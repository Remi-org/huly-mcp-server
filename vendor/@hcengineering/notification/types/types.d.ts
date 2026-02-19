/**
 * @public
 * Callback to inform of a value updates.
 */
export declare type Subscriber<T> = (value: T) => void;
/**
 * @public
 * Unsubscribes from value updates. */
export declare type Unsubscriber = () => void;
/**
 * @public
 * Callback to update a value.
 */
export declare type Updater<T> = (value: T) => T;
/**
 * @public
 * Cleanup logic callback.
 */
export declare type Invalidator<T> = (value?: T) => void;
/**
 * @public
 * Start and stop notification callbacks.
 */
export declare type StartStopNotifier<T> = (set: Subscriber<T>) => Unsubscriber | void;
/**
 * @public
 * Readable interface for subscribing.
 */
export interface Readable<T> {
    /**
     * Subscribe on value changes.
     */
    subscribe: (this: void, run: Subscriber<T>, invalidate?: Invalidator<T>) => Unsubscriber;
}
/**
 * @public
 * Writable interface for both updating and subscribing.
 *
 */
export interface Writable<T> extends Readable<T> {
    /**
     * Set value and inform subscribers.
     */
    set: (this: void, value: T) => void;
    /**
     * Update value using callback and inform subscribers.
     */
    update: (this: void, updater: Updater<T>) => void;
}
//# sourceMappingURL=types.d.ts.map