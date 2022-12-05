import { MinQueue } from 'heapify';
/**
 * @example PascalCaseYOO => pascal_case_yoo
 */
export declare const camelCaseToSnakeCase: (s: string) => string;
/**
 * @see https://stackoverflow.com/a/61375162
 * @example console.log(snakeCaseToCamelCase('TO_CAMEL')) //toCamel
 * @example console.log(snakeCaseToCamelCase('to_camel')) //toCamel
 * @example console.log(snakeCaseToCamelCase('TO-CAMEL')) //toCamel
 * @example console.log(snakeCaseToCamelCase('to-camel')) //toCamel
 * @example console.log(snakeCaseToCamelCase('to-camel4YoBro')) //toCamel4yoBro
 */
export declare const snakeCaseToCamelCase: (str: string) => string;
export declare function exponentialBackoff<f extends (...args: any[]) => any>(func: f, args1: Parameters<f>, opts?: {
    numOfAttempts?: number;
    funcName: string;
}): Promise<any>;
/**
 * @description returns the key, uniformly, and deterministically,
 * based on the suffix of the id passed in.
 *
 * @param id assumed to be taken from some auto-incrementing counter
 * (like PK, order number, address ID, etc). If not provided, key chosen
 * uniformly at random (but not deterministically).
 *
 * @example keys === ['a', 'b', 'c'], id === 124 --> 'b'
 */
export declare function keyRotater<T>(keys: T[], id?: number): T;
export declare class MaxQueue extends MinQueue {
    constructor(capacity?: number, keys?: number[], priorities?: number[], KeysBackingArrayType?: Uint32ArrayConstructor, //= Int32Array,
    PrioritiesBackingArrayType?: Uint32ArrayConstructor);
    push(key: number, priority: number): void;
}
export declare const lowerAlpha: (s: string) => string;
