"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testOneTimeVariantId = exports.testShopifyOrder = exports.testAddressId = void 0;
const { TEST_SHOPIFY_EMAIL, TEST_RECHARGE_ADDRESS_ID, TEST_ONE_TIME_VARIANT_ID, } = process.env;
exports.testAddressId = TEST_RECHARGE_ADDRESS_ID;
exports.testShopifyOrder = {
    email: TEST_SHOPIFY_EMAIL,
};
exports.testOneTimeVariantId = TEST_ONE_TIME_VARIANT_ID;
