"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lowerAlpha = exports.MaxQueue = exports.keyRotater = exports.exponentialBackoff = exports.snakeCaseToCamelCase = exports.camelCaseToSnakeCase = void 0;
const exponential_backoff_1 = require("exponential-backoff");
const heapify_1 = require("heapify");
/**
 * @example PascalCaseYOO => pascal_case_yoo
 */
const camelCaseToSnakeCase = (s) => {
    const t = [];
    for (let i = 0; i < s.length; i++) {
        // check if current letter is uppercase, and prev letter is lower case
        if (s[i] === s[i].toUpperCase() && s[i - 1] && s[i - 1].toLowerCase() === s[i - 1]) {
            t.push('_');
            t.push(s[i].toLowerCase());
        }
        else {
            t.push(s[i].toLowerCase());
        }
    }
    return t.join('');
};
exports.camelCaseToSnakeCase = camelCaseToSnakeCase;
/**
 * @see https://stackoverflow.com/a/61375162
 * @example console.log(snakeCaseToCamelCase('TO_CAMEL')) //toCamel
 * @example console.log(snakeCaseToCamelCase('to_camel')) //toCamel
 * @example console.log(snakeCaseToCamelCase('TO-CAMEL')) //toCamel
 * @example console.log(snakeCaseToCamelCase('to-camel')) //toCamel
 * @example console.log(snakeCaseToCamelCase('to-camel4YoBro')) //toCamel4yoBro
 */
const snakeCaseToCamelCase = (str) => str.toLowerCase()
    .replace(/[-_][a-z0-9]/g, group => group
    .slice(-1).toUpperCase()
    .replace('-', '')
    .replace('_', ''));
exports.snakeCaseToCamelCase = snakeCaseToCamelCase;
function exponentialBackoff(func, args1, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, exponential_backoff_1.backOff)(() => __awaiter(this, void 0, void 0, function* () { return func(...args1); }), {
            jitter: 'full',
            numOfAttempts: (opts === null || opts === void 0 ? void 0 : opts.numOfAttempts) !== undefined ? opts.numOfAttempts : 15,
            retry: (err, attemptNumber) => {
                console.error(`${opts === null || opts === void 0 ? void 0 : opts.funcName}, retry, error:`, err);
                console.error(`${opts === null || opts === void 0 ? void 0 : opts.funcName}, retry, attemptNumber:`, attemptNumber);
                return true; // keep retrying until (default) numOfAttempts
            },
        });
    });
}
exports.exponentialBackoff = exponentialBackoff;
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
function keyRotater(keys, id) {
    // eslint-disable-next-line no-param-reassign
    id = Math.round(Number(id)); // in case id is somehow a non-whole, non-number from JSON payload
    if (Number.isNaN(id)) {
        // random selection in this case, also should expect uniform distribution here
        // eslint-disable-next-line no-param-reassign
        id = Math.round(Math.random() * keys.length);
    }
    return keys[id % keys.length]; // example: 124 % 3 === 1 --> 'b'
}
exports.keyRotater = keyRotater;
class MaxQueue extends heapify_1.MinQueue {
    constructor(capacity = 64, keys = [], priorities = [], KeysBackingArrayType = Uint32Array, //= Int32Array,
    PrioritiesBackingArrayType = Uint32Array) {
        super(capacity, keys, priorities, KeysBackingArrayType, PrioritiesBackingArrayType);
    }
    push(key, priority) {
        // super.push(key, priority * -1); // not sure why doesn't work with signed array...
        // unconventional, but should work since queue is set size and unsigned
        super.push(key, this.capacity - Math.abs(priority));
    }
}
exports.MaxQueue = MaxQueue;
const lowerAlpha = (s) => s.toLowerCase().replace(/\W/g, '');
exports.lowerAlpha = lowerAlpha;
