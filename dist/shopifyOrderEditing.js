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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderEditCommit = exports.orderEditAddLineItemDiscount100Percent = exports.orderEditAddLineItemDiscount = exports.orderEditSetQuantity = exports.orderEditAddLineItemAndQuantity = exports.orderEditBegin = void 0;
/* eslint-disable no-use-before-define */
const axios_1 = __importDefault(require("axios"));
const { SHOPIFY_GRAPHQL_URL, SHOPIFY_API_KEY, } = process.env; // to ignore eslint null warning
const orderEditBegin = ({ orderId }) => __awaiter(void 0, void 0, void 0, function* () {
    const data = JSON.stringify({
        query: `mutation orderEditBegin($id: ID!) {
    orderEditBegin(id: $id) {
      calculatedOrder {
        id
      }
      userErrors {
        field
        message
      }
    }
  }`,
        variables: { id: `gid://shopify/Order/${orderId}` },
    });
    const response = yield (0, axios_1.default)({
        method: 'post',
        url: SHOPIFY_GRAPHQL_URL,
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': SHOPIFY_API_KEY,
        },
        data,
    });
    const { userErrors } = response.data.data.orderEditBegin;
    if (userErrors.length > 0) {
        console.error('orderEditBegin, userErrors:', JSON.stringify(userErrors));
        throw new Error(JSON.stringify(userErrors));
    }
    return response.data.data;
});
exports.orderEditBegin = orderEditBegin;
/**
 *
 * @param orderId
 * @param variantId ex, official soap saver to use: gid://shopify/ProductVariant/31305057960041
 * @param quantity
 */
const orderEditAddLineItemAndQuantity = ({ variantId, calculatedOrderGid, quantity = 1, allowDuplicates = true, countryCode = 'US', }) => __awaiter(void 0, void 0, void 0, function* () {
    const variantGid = `gid://shopify/ProductVariant/${variantId}`;
    const data = JSON.stringify({
        query: `mutation orderEditAddVariant($id: ID!, $quantity: Int!, $variantId: ID!, $allowDuplicates: Boolean!, $country: CountryCode!) {
    orderEditAddVariant(id: $id, quantity: $quantity, variantId: $variantId, allowDuplicates: $allowDuplicates) {
      calculatedLineItem {
        id
        variant {
            contextualPricing(context: { country: $country }) {
                price {
                    amount
                    currencyCode
                }
            }
        }
      }
      calculatedOrder {
        id
      }
      userErrors {
        field
        message
      }
    }
  }`,
        variables: {
            allowDuplicates,
            id: calculatedOrderGid,
            quantity,
            variantId: variantGid,
            country: countryCode,
        },
    });
    const response = yield (0, axios_1.default)({
        method: 'post',
        url: SHOPIFY_GRAPHQL_URL,
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': SHOPIFY_API_KEY,
        },
        data,
    });
    const { userErrors } = response.data.data.orderEditAddVariant;
    if (userErrors.length > 0) {
        console.error('orderEditAddLineItemAndQuantity, userErrors:', JSON.stringify(userErrors));
        throw new Error(JSON.stringify(userErrors));
    }
    return response.data.data;
});
exports.orderEditAddLineItemAndQuantity = orderEditAddLineItemAndQuantity;
/**
 *
 * @param orderId
 * @param calculatedLineItemGid ex, Line Item ID to use, just renamed as CaluclatedLineItem: gid://shopify/CalculatedLineItem/11606399484084
 * @param quantity
 */
const orderEditSetQuantity = ({ calculatedLineItemGid, calculatedOrderGid, quantity, restock = true, }) => __awaiter(void 0, void 0, void 0, function* () {
    const data = JSON.stringify({
        query: `mutation orderEditSetQuantityWrapper($id: ID!, $lineItemId: ID!, $quantity: Int!, $restock: Boolean!) {
    orderEditSetQuantity(id: $id, lineItemId: $lineItemId, quantity: $quantity, restock: $restock) {
      calculatedLineItem {
        # CalculatedLineItem fields
        id
      }
      calculatedOrder {
        # CalculatedOrder fields
        id
      }
      userErrors {
        field
        message
      }
    }
  }`,
        variables: {
            id: calculatedOrderGid,
            lineItemId: calculatedLineItemGid,
            quantity,
            restock,
        },
    });
    const response = yield (0, axios_1.default)({
        method: 'post',
        url: SHOPIFY_GRAPHQL_URL,
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': SHOPIFY_API_KEY,
        },
        data,
    });
    const { userErrors } = response.data.data.orderEditSetQuantity;
    if (userErrors.length > 0) {
        console.error('orderEditAddLineItemAndQuantity, userErrors:', JSON.stringify(userErrors));
        throw new Error(JSON.stringify(userErrors));
    }
    return response.data.data;
});
exports.orderEditSetQuantity = orderEditSetQuantity;
const orderEditAddLineItemDiscount = ({ calculatedOrderGid, calculatedLineItemGid, fixedDiscountAmount, fixedDiscountCurrencyCode, percentageDiscount, }) => __awaiter(void 0, void 0, void 0, function* () {
    const discount = {
        description: '',
    };
    if (fixedDiscountAmount !== undefined && fixedDiscountCurrencyCode !== undefined) {
        // @ts-ignore
        discount.fixedValue = {
            amount: fixedDiscountAmount,
            currencyCode: fixedDiscountCurrencyCode,
        };
    }
    else if (percentageDiscount !== undefined) {
        // @ts-ignore
        discount.percentValue = percentageDiscount;
    }
    else {
        throw new Error('orderEditAddLineItemDiscount, Invalid discount amount provided (missing fixed and/or percentage values)!');
    }
    const data = JSON.stringify({
        query: `mutation orderEditAddLineItemDiscount($discount: OrderEditAppliedDiscountInput!, $id: ID!, $lineItemId: ID!) {
    orderEditAddLineItemDiscount(discount: $discount, id: $id, lineItemId: $lineItemId) {
      addedDiscountStagedChange {
        id
      }
      calculatedLineItem {
        id
      }
      calculatedOrder {
        id
      }
      userErrors {
        field
        message
      }
    }
  }`,
        variables: {
            discount,
            id: calculatedOrderGid,
            lineItemId: calculatedLineItemGid,
        },
    });
    const response = yield (0, axios_1.default)({
        method: 'post',
        url: SHOPIFY_GRAPHQL_URL,
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': SHOPIFY_API_KEY,
        },
        data,
    });
    const { userErrors } = response.data.data.orderEditAddLineItemDiscount;
    if (userErrors.length > 0) {
        console.error('orderEditAddLineItemDiscount, userErrors:', JSON.stringify(userErrors));
        throw new Error(JSON.stringify(userErrors));
    }
    return response.data.data;
});
exports.orderEditAddLineItemDiscount = orderEditAddLineItemDiscount;
const orderEditAddLineItemDiscount100Percent = ({ calculatedOrderGid, calculatedLineItemGid, }) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.orderEditAddLineItemDiscount)({
        calculatedOrderGid,
        calculatedLineItemGid,
        percentageDiscount: 100,
    });
});
exports.orderEditAddLineItemDiscount100Percent = orderEditAddLineItemDiscount100Percent;
const orderEditCommit = ({ calculatedOrderGid, notifyCustomer = false, }) => __awaiter(void 0, void 0, void 0, function* () {
    const data = JSON.stringify({
        query: `mutation orderEditCommit($id: ID!) {
    orderEditCommit(id: $id) {
      order {
        id
      }
      userErrors {
        field
        message
      }
    }
  }`,
        variables: { id: calculatedOrderGid, notifyCustomer },
    });
    const response = yield (0, axios_1.default)({
        method: 'post',
        url: SHOPIFY_GRAPHQL_URL,
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': SHOPIFY_API_KEY,
        },
        data,
    });
    const { userErrors } = response.data.data.orderEditCommit;
    if (userErrors.length > 0) {
        console.error('orderEditCommit, userErrors:', JSON.stringify(userErrors));
        throw new Error(JSON.stringify(userErrors));
    }
    return response.data.data;
});
exports.orderEditCommit = orderEditCommit;
