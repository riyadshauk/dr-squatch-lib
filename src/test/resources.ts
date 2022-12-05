import { ShopifyOrderObject } from '../types/shopify';

const {
  TEST_SHOPIFY_EMAIL,
  TEST_RECHARGE_ADDRESS_ID,
  TEST_ONE_TIME_VARIANT_ID,
} = process.env;

export const testAddressId = TEST_RECHARGE_ADDRESS_ID as unknown as number;

export const testShopifyOrder: ShopifyOrderObject = {
  email: TEST_SHOPIFY_EMAIL,
} as unknown as ShopifyOrderObject;

export const testOneTimeVariantId = TEST_ONE_TIME_VARIANT_ID as unknown as number;