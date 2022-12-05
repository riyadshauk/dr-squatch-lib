/* eslint-disable no-console */
import {
  describe, expect, test, jest,
} from '@jest/globals';
import { testAddressId, testOneTimeVariantId } from './test/resources';
import { addRechargeOneTime, removeRechargeOneTime } from './rechargeScripts';

jest.setTimeout(10000);

describe('rechargeChargeUpcoming handler integration tests', () => {
  test('basic', async () => {
    try {
      const response = await addRechargeOneTime({
        addressId: testAddressId,
        variantId: testOneTimeVariantId,
      });
      expect(response.status).toEqual(201);
      const response2 = await removeRechargeOneTime({ onetimeId: response.id });
      expect(response2.status).toBe(204);
    } catch (err: any) {
      console.error(err.stack);
      expect(false).toBeTruthy();
    }
  });
});