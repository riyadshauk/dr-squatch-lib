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
exports.getLineItems = exports.updateOrderPhoneNumber = exports.queryOrderDataWithPaymentAndFulfillmentStatus = exports.removeLineItemFromShopifyOrderWithoutRefunding = exports.removeLineItemFromShopifyOrderWithRefund = exports.closeOrder = exports.cancelOrderREST = exports.refundLineItem = exports.removeTagsInShopify = exports.addTagsInShopify = exports.getChannelInfo = exports.getTagsFromShopifyCustomer = exports.getTagsFromShopifyOrder = exports.getFulfillmentAndTagsFromShopify = exports.shopifyGraphqlRequest = exports.getShopifyOrder = void 0;
/* eslint-disable import/no-extraneous-dependencies */
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
const { SHOPIFY_API_KEY, SHOPIFY_DOMAIN, } = process.env;
const SHOPIFY_GRAPHQL_URL = (shopifyStore) => `https://${SHOPIFY_DOMAIN || shopifyStore}/admin/api/2023-01/graphql.json`;
const SHOPIFY_REST_URL = (shopifyStore) => `https://${SHOPIFY_DOMAIN || shopifyStore}/admin/api/2023-01`;
(0, axios_retry_1.default)(axios_1.default, { retries: 8, retryDelay: axios_retry_1.default.exponentialDelay });
const getShopifyOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield axios_1.default.get(`${SHOPIFY_REST_URL()}/orders/${orderId}.json`, {
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': SHOPIFY_API_KEY || '',
        },
    })).data.order;
});
exports.getShopifyOrder = getShopifyOrder;
/**
 * @arg T is the type/interface of the object returned in the query
 * @arg U? is the type/interface of what the transformer would return in { data: U|T } response
 */
function shopifyGraphqlRequest(requestPayload, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const { errorReporter, transform, storeName, apiKey, } = opts;
        const { data } = yield (0, axios_1.default)({
            url: SHOPIFY_GRAPHQL_URL(storeName),
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': apiKey || SHOPIFY_API_KEY,
            },
            data: requestPayload,
        });
        if (errorReporter !== undefined) {
            const errorReport = errorReporter(data);
            if (errorReport !== undefined) {
                return errorReport;
            }
        }
        try { // in case trying to access data that isn't there for given query (in edge cases)
            if (transform) {
                return {
                    error: '',
                    data: transform(data),
                };
            }
            return {
                error: '',
                data: data.data.order || data.data.customer, // kind of hacky, but works for now
            };
        }
        catch (err) {
            return {
                error: err.stack,
            };
        }
    });
}
exports.shopifyGraphqlRequest = shopifyGraphqlRequest;
const getFulfillmentAndTagsFromShopify = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    return shopifyGraphqlRequest({
        query: `
        {
          order(id: "gid://shopify/Order/${orderId}") {
            id
            tags
            fulfillments {
              status
            }
            lineItems(first: 100) {
                edges {
                  node {
                    sku
                }
              }
            }
            shippingLines(first: 1) {
              nodes {
                code
              }
            }
            shippingAddress {
              provinceCode
            }
          }
        }
        `,
    }, {
        errorReporter: (data) => (!data.data.order ? { error: 'Order Id not found' } : undefined),
    });
});
exports.getFulfillmentAndTagsFromShopify = getFulfillmentAndTagsFromShopify;
const getTagsFromShopifyOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    return shopifyGraphqlRequest({
        query: `
        {
          order(id: "gid://shopify/Order/${orderId}") {
            id
            tags
          }
        }
        `,
    }, {
        errorReporter: (data) => (!data.data.order ? { error: 'Order Id not found' } : undefined),
    });
});
exports.getTagsFromShopifyOrder = getTagsFromShopifyOrder;
const getTagsFromShopifyCustomer = (customerId) => __awaiter(void 0, void 0, void 0, function* () {
    return shopifyGraphqlRequest({
        query: `
        {
          customer(id: "gid://shopify/Customer/${customerId}") {
            id
            tags
          }
        }
        `,
    }, {
        errorReporter: (data) => (!data.data.customer ? { error: 'Customer Id not found' } : undefined),
    });
});
exports.getTagsFromShopifyCustomer = getTagsFromShopifyCustomer;
const getChannelInfo = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    return shopifyGraphqlRequest({
        query: `
        {
          order(id: "gid://shopify/Order/${orderId}") {
            channelInformation {
              channelDefinition {
                channelName
                handle
              }
            }
          }
        }
        `,
    }, {
        errorReporter: (data) => (!data.data.order ? { error: 'Order Id not found' } : undefined),
        /**
         * @description if channelInformation is null, we don't know the channel type.
         * Note that Recharge orders also happen to have channelInformation === null
         * (as oppose to standard Shopify-based orders).
         */
        transform: data => data.data.order.channelInformation === null ? ({
            channelName: 'unknown',
            handle: 'unknown',
        }) : data.data.order.channelInformation.channelDefinition,
    });
});
exports.getChannelInfo = getChannelInfo;
/**
 * @description hits REST API to cancel order
 * Throws if non-200 status, with status code in error message. Makes one attempt to cancel order.
 * @see https://community.shopify.com/c/shopify-apis-and-sdks/how-to-cancel-order-with-graphql-api/td-p/577457
 */
// export const cancelOrder = async (orderId: number) => {
//   const { status } = await axios.post(`${SHOPIFY_REST_URL()}/orders/${orderId}/cancel.json`, {
//     headers: {
//       'Content-Type': 'application/json',
//       'X-Shopify-Access-Token': SHOPIFY_API_KEY || '',
//     },
//   });
//   if (status !== 200) {
//     throw new Error(`Could not cancel order! API status is ${status}`);
//   }
// };
const addTagsInShopify = (gid, tags) => __awaiter(void 0, void 0, void 0, function* () {
    return shopifyGraphqlRequest({
        query: `mutation tagsAdd($id: ID!, $tags: [String!]!) {
              tagsAdd(id: $id, tags: $tags) {
                userErrors {
                  field
                  message
                }
              }
            }`,
        variables: {
            id: gid,
            tags: tags.map(tag => tag.substring(0, 40)),
        },
    }, {
        // eslint-disable-next-line max-len
        errorReporter: data => (data.data.tagsAdd.userErrors.length > 0 ? { error: JSON.stringify(data.data.tagsAdd.userErrors) } : undefined),
        transform: data => { var _a, _b; return ((_a = data.data) === null || _a === void 0 ? void 0 : _a.order) || ((_b = data.data) === null || _b === void 0 ? void 0 : _b.customer); },
    });
});
exports.addTagsInShopify = addTagsInShopify;
const removeTagsInShopify = (gid, tags) => __awaiter(void 0, void 0, void 0, function* () {
    return shopifyGraphqlRequest({
        query: `mutation tagsRemove($id: ID!, $tags: [String!]!) {
              tagsRemove(id: $id, tags: $tags) {
                userErrors {
                  field
                  message
                }
              }
            }`,
        variables: {
            id: gid,
            tags,
        },
    }, {
        // eslint-disable-next-line max-len
        errorReporter: data => (data.data.tagsRemove.userErrors.length > 0 ? { error: JSON.stringify(data.data.tagsRemove.userErrors) } : undefined),
        transform: data => { var _a, _b; return ((_a = data.data) === null || _a === void 0 ? void 0 : _a.order) || ((_b = data.data) === null || _b === void 0 ? void 0 : _b.customer); },
    });
});
exports.removeTagsInShopify = removeTagsInShopify;
const refundLineItem = (args) => __awaiter(void 0, void 0, void 0, function* () {
    return shopifyGraphqlRequest({
        query: `mutation refundCreate($input: RefundInput!) {
      refundCreate(input: $input) {
        userErrors {
          field
          message
        }
      }
    }`,
        variables: {
            input: {
                note: args.note || '',
                notify: args.notifyCustomer || false,
                orderId: `gid://shopify/Order/${args.orderId}`,
                refundLineItems: [
                    {
                        lineItemId: `gid://shopify/LineItem/${args.lineItemId}`,
                        quantity: args.quantity,
                    },
                ],
            },
        },
    }, {
        // eslint-disable-next-line max-len
        errorReporter: data => (data.data.refundCreate.userErrors.length > 0 ? { error: JSON.stringify(data.data.refundCreate.userErrors) } : undefined),
        // @ts-ignore
        transform: data => { var _a; return (_a = data.data) === null || _a === void 0 ? void 0 : _a.refundCreate; },
    });
});
exports.refundLineItem = refundLineItem;
const cancelOrderREST = ({ orderId, notifyCustomer = false, amountToRefund = undefined, reason = 'other', currency = 'USD', }) => __awaiter(void 0, void 0, void 0, function* () {
    console.debug('cancelOrderREST, args:', {
        orderId,
        notifyCustomer,
        amountToRefund,
        reason,
        currency,
    });
    const buildPayload = () => {
        const payload = {
            email: notifyCustomer || false,
        };
        if (amountToRefund)
            payload.amount = amountToRefund;
        if (reason)
            payload.reason = reason;
        if (currency)
            payload.currency = currency;
        return payload;
    };
    const payload = buildPayload();
    console.debug('cancelOrderREST, body payload:', payload);
    const resp = yield axios_1.default.post(`${SHOPIFY_REST_URL()}/orders/${orderId}/cancel.json`, payload, {
        headers: {
            'X-Shopify-Access-Token': SHOPIFY_API_KEY || '',
            'Content-Type': 'application/json',
        },
    });
    if (resp.status !== 200) {
        throw new Error(`Could not cancel order for order of, orderId: ${orderId}`);
    }
});
exports.cancelOrderREST = cancelOrderREST;
const closeOrder = (gid) => __awaiter(void 0, void 0, void 0, function* () {
    return shopifyGraphqlRequest({
        query: `mutation orderClose($input: OrderCloseInput!) {
      orderClose(input: $input) {
        order {
          id
        }
        userErrors {
          field
          message
        }
      }
    }`,
        variables: {
            input: {
                id: gid,
            },
        },
    }, {
        // eslint-disable-next-line max-len
        errorReporter: data => (data.data.orderClose.userErrors.length > 0 ? { error: JSON.stringify(data.data.orderClose.userErrors) } : undefined),
        transform: data => { var _a, _b; return ((_a = data.data) === null || _a === void 0 ? void 0 : _a.order) || ((_b = data.data) === null || _b === void 0 ? void 0 : _b.customer); },
    });
});
exports.closeOrder = closeOrder;
/**
 * @description This is useful for when we want to remove+refund line-item
 * for a Recharge order. Such orders cannot be refunded directly in Shopify.
 *
 * If no amountsToRefund specified, this will only remove the item from the
 * order (and not actually refund anything)!
 *
 * Currency must be the presentment_currency in orders where there
 * is a presentment_currency and a shop_currency; 3-letters, all-caps.
 *
 * Any ids, such as lineItemId, should be GID values.
 */
const removeLineItemFromShopifyOrderWithRefund = ({ orderGid, refundLineItems, gateway, amountsToRefund, parentTransactionId, note = 'Removing line-item', currency = 'USD', kind = 'REFUND', notify = false, }) => __awaiter(void 0, void 0, void 0, function* () {
    return shopifyGraphqlRequest({
        query: `mutation refundCreate($input: RefundInput!) {
      refundCreate(input: $input) {
        order {
          # Order fields
          id
        }
        refund {
          # Refund fields
          id
        }
        userErrors {
          field
          message
        }
      }
    }`,
        variables: {
            input: {
                note,
                notify,
                orderId: orderGid,
                currency,
                refundLineItems,
                transactions: Array.isArray(amountsToRefund) ? amountsToRefund.map(amount => ({
                    amount,
                    gateway,
                    kind,
                    orderId: orderGid,
                    parentId: parentTransactionId,
                })) : [],
            },
        },
    }, {
        // eslint-disable-next-line max-len
        errorReporter: data => { var _a, _b, _c, _d, _e; return (((_c = (_b = (_a = data.data) === null || _a === void 0 ? void 0 : _a.refundCreate) === null || _b === void 0 ? void 0 : _b.userErrors) === null || _c === void 0 ? void 0 : _c.length) > 0 ? { error: JSON.stringify((_e = (_d = data.data) === null || _d === void 0 ? void 0 : _d.refundCreate) === null || _e === void 0 ? void 0 : _e.userErrors) } : undefined); },
        // @ts-ignore
        transform: data => { var _a; return (_a = data.data) === null || _a === void 0 ? void 0 : _a.refundCreate; },
    });
});
exports.removeLineItemFromShopifyOrderWithRefund = removeLineItemFromShopifyOrderWithRefund;
/**
 * @description This is useful for when we want to remove+refund line-item
 * for a Recharge order. Such orders cannot be refunded directly in Shopify.
 */
const removeLineItemFromShopifyOrderWithoutRefunding = ({ orderGid, refundLineItems, notify = false, }) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, exports.removeLineItemFromShopifyOrderWithRefund)({
        orderGid, refundLineItems, notify, amountsToRefund: [],
    });
});
exports.removeLineItemFromShopifyOrderWithoutRefunding = removeLineItemFromShopifyOrderWithoutRefunding;
// @ts-ignore
const queryOrderDataWithPaymentAndFulfillmentStatus = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    return shopifyGraphqlRequest({
        query: `{
      order(id: "gid://shopify/Order/${orderId}") {
        displayFulfillmentStatus
        displayFinancialStatus
        refundable
        netPaymentSet {
            presentmentMoney {
                amount
                currencyCode
            }
            shopMoney {
                amount
                currencyCode
            }
        }
        tags
        id
        name
        cancelledAt
        customer {
            id
            email
        }
        paymentGatewayNames
        originalTotalDutiesSet {
            presentmentMoney {
                amount
                currencyCode
            }
            shopMoney {
                amount
                currencyCode
            }
        }
        totalReceivedSet {
            presentmentMoney {
                amount
                currencyCode
            }
            shopMoney {
                amount
                currencyCode
            }
        }
        totalShippingPriceSet {
            presentmentMoney {
                amount
                currencyCode
            }
            shopMoney {
                amount
                currencyCode
            }
        }
        totalRefundedSet {
            presentmentMoney {
                amount
                currencyCode
            }
            shopMoney {
                amount
                currencyCode
            }
        }
        transactions (first: 10) {
            id
            createdAt
            amountSet {
                presentmentMoney {
                    amount
                    currencyCode
                }
                shopMoney {
                    amount
                    currencyCode
                }
            }
            parentTransaction {
                createdAt
                id
            }
            gateway
            formattedGateway
            parentTransaction {
                id
            }
            amountSet {
                presentmentMoney {
                    amount
                    currencyCode
                }
                shopMoney {
                    amount
                    currencyCode
                }
            }
            fees {
                amount {
                    amount
                    currencyCode
                }
                flatFee {
                    amount
                    currencyCode
                }
                flatFeeName
                id
                rate
                rateName
                taxAmount {
                    amount
                    currencyCode
                }
                type
            }
        }
        lineItems(first: 10) {
          edges {
            node {
              id
              sku
              title
              refundableQuantity
              originalUnitPriceSet {
                  presentmentMoney {
                    amount
                    currencyCode
                }
                shopMoney {
                    amount
                    currencyCode
                }
              }
              discountedUnitPriceSet {
                  presentmentMoney {
                    amount
                    currencyCode
                }
                shopMoney {
                    amount
                    currencyCode
                }
              }
              duties {
                id
                harmonizedSystemCode
                price {
                  shopMoney {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }`,
        variables: {},
    }, {
        // eslint-disable-next-line max-len
        errorReporter: data => { var _a, _b, _c, _d, _e; return (((_c = (_b = (_a = data.data) === null || _a === void 0 ? void 0 : _a.order) === null || _b === void 0 ? void 0 : _b.userErrors) === null || _c === void 0 ? void 0 : _c.length) > 0 ? { error: JSON.stringify((_e = (_d = data.data) === null || _d === void 0 ? void 0 : _d.order) === null || _e === void 0 ? void 0 : _e.userErrors) } : undefined); },
        // @ts-ignore
        transform: data => { var _a; return (_a = data.data) === null || _a === void 0 ? void 0 : _a.order; },
    });
});
exports.queryOrderDataWithPaymentAndFulfillmentStatus = queryOrderDataWithPaymentAndFulfillmentStatus;
const updateOrderPhoneNumber = ({ orderId, phoneNumber, }) => __awaiter(void 0, void 0, void 0, function* () {
    return shopifyGraphqlRequest({
        query: `mutation orderUpdate($input: OrderInput!) {
      orderUpdate(input: $input) {
        order {
          id
          shippingAddress {
              address1
              phone
          }
        }
        userErrors {
          field
          message
        }
      }
    }`,
        variables: {
            input: {
                id: `gid://shopify/Order/${orderId}`,
                shippingAddress: {
                    phone: phoneNumber,
                },
            },
        },
    }, {
        // eslint-disable-next-line max-len
        errorReporter: data => (data.data.orderUpdate.userErrors.length > 0 ? { error: JSON.stringify(data.data.orderUpdate.userErrors) } : undefined),
        // @ts-ignore
        transform: data => { var _a; return (_a = data.data) === null || _a === void 0 ? void 0 : _a.orderUpdate; },
    });
});
exports.updateOrderPhoneNumber = updateOrderPhoneNumber;
const getLineItems = ({ orderId, }) => __awaiter(void 0, void 0, void 0, function* () {
    return shopifyGraphqlRequest({
        query: `{
      order(id: "gid://shopify/Order/${orderId}") {
          # Order fields
          id
          lineItems (first: 10) {
              edges {
                  node {
                      id
                      sku
                      customAttributes {
                          key
                          value
                      }
                  }
              }
          }
        }
      }`,
    }, {
        // eslint-disable-next-line max-len
        errorReporter: data => { var _a, _b, _c, _d, _e; return (((_c = (_b = (_a = data.data) === null || _a === void 0 ? void 0 : _a.order) === null || _b === void 0 ? void 0 : _b.userErrors) === null || _c === void 0 ? void 0 : _c.length) > 0 ? { error: JSON.stringify((_e = (_d = data.data) === null || _d === void 0 ? void 0 : _d.order) === null || _e === void 0 ? void 0 : _e.userErrors) } : undefined); },
        // @ts-ignore
        transform: data => { var _a; return (_a = data.data) === null || _a === void 0 ? void 0 : _a.order; },
    });
});
exports.getLineItems = getLineItems;
