/**
 * Creates an HTTP Request to be sent to a REST Access API via Fetch API.
 *
 * @param {object} options - Options for the HTTP Request
 * @param {String} options.hostname - Access API Hostname
 * @param {String} options.path - Path to the resource on the Access API
 * @param {String} options.method - HTTP Method
 * @param {object} options.body - HTTP Request Body
 * @param {object} [options.headers] - HTTP Request Headers
 * @param {boolean} [options.enableRequestLogging=true] - Enable/Disable request logging
 * @param {number} [options.retryLimit=5] - Number of times to retry request
 * @param {number} [options.retryIntervalMs=1000] - Time in milliseconds to wait before retrying request
 * @param {number} [options.timeoutLimit=30000] - Time in milliseconds to wait before timing out request
 *
 * @returns JSON object response from Access API.
 */
export function httpRequest({ hostname, path, method, body, headers, retryLimit, retryIntervalMs, timeoutLimit, enableRequestLogging, }: {
    hostname: string;
    path: string;
    method: string;
    body: object;
    headers?: object | undefined;
    enableRequestLogging?: boolean | undefined;
    retryLimit?: number | undefined;
    retryIntervalMs?: number | undefined;
    timeoutLimit?: number | undefined;
}): Promise<any>;
export class HTTPRequestError extends Error {
    constructor({ error, hostname, path, method, requestBody, responseBody, responseStatusText, statusCode, }: {
        error: any;
        hostname: any;
        path: any;
        method: any;
        requestBody: any;
        responseBody: any;
        responseStatusText: any;
        statusCode: any;
    });
    statusCode: any;
    errorMessage: any;
}
