import { StreamConnection } from "@onflow/typedefs";
export declare class WebsocketError extends Error {
    code?: number;
    reason?: string;
    wasClean?: boolean;
    constructor({ code, reason, message, wasClean, }: {
        code?: number;
        reason?: string;
        message?: string;
        wasClean?: boolean;
    });
}
type WebSocketConnection<T> = StreamConnection<{
    data: T;
}>;
export declare function connectWs<T>({ hostname, path, params, getParams, retryLimit, retryIntervalMs, }: {
    hostname: string;
    path: string;
    params?: Record<string, string>;
    getParams?: () => Record<string, string> | undefined;
    retryLimit?: number;
    retryIntervalMs?: number;
}): WebSocketConnection<T>;
export declare function buildConnectionUrl(hostname: string, path?: string, params?: Record<string, string | number | string[] | number[] | null | undefined>): string;
export {};
