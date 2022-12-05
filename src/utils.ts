import { backOff } from 'exponential-backoff';
import { MinQueue } from 'heapify';

/**
 * @example PascalCaseYOO => pascal_case_yoo
 */
export const camelCaseToSnakeCase = (s: string): string => {
  const t = [];
  for (let i = 0; i < s.length; i++) {
    // check if current letter is uppercase, and prev letter is lower case
    if (s[i] === s[i].toUpperCase() && s[i - 1] && s[i - 1].toLowerCase() === s[i - 1]) {
      t.push('_');
      t.push(s[i].toLowerCase());
    } else {
      t.push(s[i].toLowerCase());
    }
  }
  return t.join('');
};

/**
 * @see https://stackoverflow.com/a/61375162
 * @example console.log(snakeCaseToCamelCase('TO_CAMEL')) //toCamel
 * @example console.log(snakeCaseToCamelCase('to_camel')) //toCamel
 * @example console.log(snakeCaseToCamelCase('TO-CAMEL')) //toCamel
 * @example console.log(snakeCaseToCamelCase('to-camel')) //toCamel
 * @example console.log(snakeCaseToCamelCase('to-camel4YoBro')) //toCamel4yoBro
 */
export const snakeCaseToCamelCase = (str: string) => str.toLowerCase()
  .replace(/[-_][a-z0-9]/g, group => group
    .slice(-1).toUpperCase()
    .replace('-', '')
    .replace('_', ''));

export async function exponentialBackoff<
  // eslint-disable-next-line space-before-function-paren
  f extends (...args: any[]) => any
>(func: f, args1: Parameters<f>, opts?: { numOfAttempts?: number, funcName: string }) {
  return backOff(async () => func(...args1), {
    jitter: 'full',
    numOfAttempts: opts?.numOfAttempts !== undefined ? opts.numOfAttempts : 15,
    retry: (err, attemptNumber) => {
      console.error(`${opts?.funcName}, retry, error:`, err);
      console.error(`${opts?.funcName}, retry, attemptNumber:`, attemptNumber);
      return true; // keep retrying until (default) numOfAttempts
    },
  });
}

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
export function keyRotater<T>(keys: T[], id?: number): T {
  // eslint-disable-next-line no-param-reassign
  id = Math.round(Number(id)); // in case id is somehow a non-whole, non-number from JSON payload
  if (Number.isNaN(id)) {
    // random selection in this case, also should expect uniform distribution here
    // eslint-disable-next-line no-param-reassign
    id = Math.round(Math.random() * keys.length);
  }
  return keys[id % keys.length]; // example: 124 % 3 === 1 --> 'b'
}

export class MaxQueue extends MinQueue {
  constructor(
    capacity = 64,
    keys: number[] = [],
    priorities: number[] = [],
    KeysBackingArrayType = Uint32Array, //= Int32Array,
    PrioritiesBackingArrayType = Uint32Array, //= Int32Array,
  ) {
    super(capacity, keys, priorities, KeysBackingArrayType, PrioritiesBackingArrayType);
  }

  push(key: number, priority: number): void {
    // super.push(key, priority * -1); // not sure why doesn't work with signed array...
    // unconventional, but should work since queue is set size and unsigned
    super.push(key, this.capacity - Math.abs(priority));
  }
}

export const lowerAlpha = (s: string) => s.toLowerCase().replace(/\W/g, '');