export declare const setConfig: (_config: any) => void;
/**
 * The levels of the logger
 */
export declare enum LEVELS {
    debug = 5,
    info = 4,
    log = 3,
    warn = 2,
    error = 1
}
/**
 * Logs messages based on the level of the message and the level set in the config
 * @param options - The options for the log
 * @param options.title - The title of the log
 * @param options.message - The message of the log
 * @param options.level - The level of the log
 * @param options.always - Whether to always show the log
 * @example
 * log({ title: "My Title", message: "My Message", level: LEVELS.warn, always: false })
 */
export declare const log: {
    (options: {
        title: string;
        message: string;
        level: number;
        always?: boolean;
    }): Promise<void>;
    /**
     * Logs a deprecation notice.  If a callback is provided this function returns a function that will call the callback and log the deprecation notice, otherwise it just logs the deprecation notice.
     * @param options - The options for the log
     * @param options.pkg - The package that is being deprecated
     * @param options.subject - The subject of the deprecation
     * @param options.transition - The transition path for the deprecation
     * @param options.level - The level of the log
     * @param options.message - The message of the log
     * @param options.callback - A callback to run after the log
     * @returns A function that will call the callback and log the deprecation notice if the callback is provided
     * @example
     * // Logs a deprecation notice
     * log.deprecate({ pkg: "@onflow/fcl", subject: "Some item", transition: "https://github.com/onflow/flow-js-sdk", message: "Descriptive message", level: LEVELS.warn, callback: () => {} })
     * @example
     * function someFunction() { ... }
     * const deprecatedFunction = log.deprecate({ pkg: "@onflow/fcl", subject: "Some item", transition: "https://github.com/foo/bar/TRANSITIONS.md", message: "Descriptive message", level: LEVELS.warn, callback: someFunction })
     * deprecatedFunction() // Calls someFunction and logs the deprecation notice
     */
    deprecate<T, U>(options: {
        pkg?: string | undefined;
        subject?: string | undefined;
        transition?: string | undefined;
        level?: number | undefined;
        message?: string | undefined;
        callback?: ((...args: T[]) => U) | undefined;
    }): Promise<void> | ((...args: T[]) => Promise<U>);
};
