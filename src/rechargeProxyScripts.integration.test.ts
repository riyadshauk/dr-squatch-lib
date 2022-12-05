/* eslint-disable no-console */
import {
  describe, expect, test, jest,
} from '@jest/globals';
import { testShopifyOrder } from './test/resources';
import { getNumberOfSubscriptions } from './rechargeProxyScripts';

jest.setTimeout(10000);

describe('rechargeProxyScripts integration tests', () => {
  test('basic', async () => {
    try {
      const numOfSubscriptions = await getNumberOfSubscriptions(testShopifyOrder);
      expect(numOfSubscriptions).toBeGreaterThanOrEqual(0);
    } catch (err: any) {
      console.error(err.stack);
      expect(false).toBeTruthy();
    }
  });
});