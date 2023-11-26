/**
 * Interleaves two arrays
 * @param a - The first array
 * @param b - The second array
 * @param c - The target array
 * @returns The interleaved array
 */
export declare function interleave<A, B>(a?: A[], b?: B[], c?: (A | B)[]): (A | B)[];
/**
 * Creates a template function
 * @param head - A string, template string array, or template function
 * @param rest - The rest of the arguments
 * @returns A template function
 */
export declare function template(head: string | TemplateStringsArray | ((x?: unknown) => string), ...rest: unknown[]): (x?: unknown) => string;
