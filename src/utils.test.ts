/* eslint-disable no-console */
import {
  describe, expect, test,
} from '@jest/globals';
import { keyRotater } from './utils';

describe('utils unit tests', () => {
  test('keyRotater', async () => {
    try {
      const keys = ['a', 'b', 'c'];

      const key1 = await keyRotater(keys, '124' as unknown as number);
      expect(key1).toBe('b');

      const key2 = await keyRotater(keys, '125' as unknown as number);
      expect(key2).toBe('c');

      const key3 = await keyRotater(keys, 126);
      expect(key3).toBe('a');

      const key4 = await keyRotater(keys, 'hello, world!' as unknown as number);
      expect(typeof key4).toBe('string');

      const key5 = await keyRotater(keys);
      expect(typeof key5).toBe('string');
    } catch (err: any) {
      console.error(err.stack);
      expect(false).toBeTruthy();
    }
  });
});