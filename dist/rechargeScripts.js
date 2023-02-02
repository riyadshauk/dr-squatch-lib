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
exports.refundRechargeLineItem = exports.getCharges = exports.updateSubscription = exports.refundRechargeCharge = exports.getSubscriptions = exports.deleteSubscription = exports.getShopifyCustomerId = exports.removeRechargeOneTime = exports.listRechargeOneTimes = exports.addRechargeOneTime = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("./utils");
const { RECHARGE_API_KEYS, RECHARGE_API_BASE_URL, } = process.env;
const rechargeApiKeys = (RECHARGE_API_KEYS || '').split(',');
const addRechargeOneTimeInternal = ({ addressId, variantId, price = '0.00', quantity = 1, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, data: { onetime: { id } } } = yield (0, axios_1.default)({
        method: 'post',
        url: `${RECHARGE_API_BASE_URL}/onetimes`,
        headers: {
            'X-Recharge-Version': '2021-11',
            'X-Recharge-Access-Token': (0, utils_1.keyRotater)(rechargeApiKeys, addressId),
        },
        data: {
            address_id: addressId,
            add_to_next_charge: true,
            price,
            quantity,
            external_variant_id: {
                ecommerce: String(variantId),
            },
        },
    });
    if (status === 429) {
        throw new Error('addRechargeOneTime, response status === 429 (rate limited)');
    }
    return { status, id };
});
const addRechargeOneTime = (opts) => __awaiter(void 0, void 0, void 0, function* () { return (0, utils_1.exponentialBackoff)(addRechargeOneTimeInternal, [opts], { funcName: 'addRechargeOneTime' }); });
exports.addRechargeOneTime = addRechargeOneTime;
const listRechargeOneTimesInternal = ({ addressId, chargeId, }) => __awaiter(void 0, void 0, void 0, function* () {
    if (!addressId && !chargeId) {
        throw new Error('Must provide at least (and exactly) one of: addressId, chargeId to listRechargeOneTimes!');
    }
    const { status, data: { onetimes } } = yield (0, axios_1.default)({
        method: 'get',
        url: `${RECHARGE_API_BASE_URL}/onetimes?${addressId || chargeId}`,
        headers: {
            'X-Recharge-Version': '2021-11',
            'X-Recharge-Access-Token': (0, utils_1.keyRotater)(rechargeApiKeys, addressId),
        },
    });
    if (status === 429) {
        throw new Error('listRechargeOneTime, response status === 429 (rate limited)');
    }
    return { onetimes };
});
const listRechargeOneTimes = (opts) => __awaiter(void 0, void 0, void 0, function* () { return (0, utils_1.exponentialBackoff)(listRechargeOneTimesInternal, [opts], { funcName: 'listRechargeOneTime' }); });
exports.listRechargeOneTimes = listRechargeOneTimes;
const removeRechargeOneTimeInternal = ({ onetimeId, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = yield (0, axios_1.default)({
        method: 'delete',
        url: `${RECHARGE_API_BASE_URL}/onetimes/${onetimeId}`,
        headers: {
            'X-Recharge-Version': '2021-11',
            'X-Recharge-Access-Token': (0, utils_1.keyRotater)(rechargeApiKeys, onetimeId),
        },
    });
    if (status === 429) {
        throw new Error('removeRechargeOneTime, response status === 429 (rate limited)');
    }
    return { status };
});
const removeRechargeOneTime = (opts) => __awaiter(void 0, void 0, void 0, function* () { return (0, utils_1.exponentialBackoff)(removeRechargeOneTimeInternal, [opts], { funcName: 'removeRechargeOneTime' }); });
exports.removeRechargeOneTime = removeRechargeOneTime;
const getShopifyCustomerIdInternal = ({ rechargeCustomerId, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, status } = yield (0, axios_1.default)({
        method: 'get',
        url: `${RECHARGE_API_BASE_URL}/customers/${rechargeCustomerId}`,
        headers: {
            'X-Recharge-Version': '2021-11',
            'X-Recharge-Access-Token': (0, utils_1.keyRotater)(rechargeApiKeys, rechargeCustomerId),
        },
    });
    if (status === 429) {
        throw new Error('getShopifyCustomerId, response status === 429 (rate limited)');
    }
    const { external_customer_id: { ecommerce: shopifyCustomerId } } = data.customer;
    return shopifyCustomerId;
});
const getShopifyCustomerId = (opts) => __awaiter(void 0, void 0, void 0, function* () { return (0, utils_1.exponentialBackoff)(getShopifyCustomerIdInternal, [opts], { funcName: 'getShopifyCustomerIdInternal' }); });
exports.getShopifyCustomerId = getShopifyCustomerId;
const deleteSubscriptionInternal = ({ subscriptionId, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = yield (0, axios_1.default)({
        method: 'delete',
        url: `${RECHARGE_API_BASE_URL}/subscriptions/${subscriptionId}`,
        headers: {
            'X-Recharge-Version': '2021-11',
            'X-Recharge-Access-Token': (0, utils_1.keyRotater)(rechargeApiKeys, subscriptionId),
        },
    });
    if (status === 429) {
        throw new Error('removeRechargeOneTime, response status === 429 (rate limited)');
    }
    return { status };
});
const deleteSubscription = (opts) => __awaiter(void 0, void 0, void 0, function* () { return (0, utils_1.exponentialBackoff)(deleteSubscriptionInternal, [opts], { funcName: 'deleteSubscriptionInternal' }); });
exports.deleteSubscription = deleteSubscription;
const getSubscriptionsInternal = ({ addressId, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, data } = yield (0, axios_1.default)({
        method: 'get',
        url: `${RECHARGE_API_BASE_URL}/subscriptions?address_id=${addressId}`,
        headers: {
            'X-Recharge-Version': '2021-11',
            'X-Recharge-Access-Token': (0, utils_1.keyRotater)(rechargeApiKeys, addressId),
        },
    });
    if (status === 429) {
        throw new Error('removeRechargeOneTime, response status === 429 (rate limited)');
    }
    return data;
});
const getSubscriptions = (opts) => __awaiter(void 0, void 0, void 0, function* () { return (0, utils_1.exponentialBackoff)(getSubscriptionsInternal, [opts], { funcName: 'getSubscriptionsInternal' }); });
exports.getSubscriptions = getSubscriptions;
const refundRechargeChargeInternal = ({ chargeId, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = yield (0, axios_1.default)({
        method: 'post',
        url: `${RECHARGE_API_BASE_URL}/charges/${chargeId}/refund`,
        headers: {
            'X-Recharge-Version': '2021-11',
            'X-Recharge-Access-Token': (0, utils_1.keyRotater)(rechargeApiKeys, chargeId),
        },
        data: {
            full_refund: true,
        },
    });
    if (status === 429) {
        throw new Error('removeRechargeOneTime, response status === 429 (rate limited)');
    }
    return { status };
});
/**
 * @description uses the Recharge API to refund a subscription charge (cur use case: full_refund),
 * which also marks the order as Refunded and Archived in Shopify.
 */
const refundRechargeCharge = (opts) => __awaiter(void 0, void 0, void 0, function* () { return (0, utils_1.exponentialBackoff)(refundRechargeChargeInternal, [opts], { funcName: 'refundRechargeChargeInternal' }); });
exports.refundRechargeCharge = refundRechargeCharge;
const updateSubscriptionInternal = ({ subscriptionId, properties, sku, }) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {};
    if (properties) {
        data.properties = properties;
    }
    if (sku) {
        data.sku = sku;
    }
    const { status } = yield (0, axios_1.default)({
        method: 'put',
        url: `${RECHARGE_API_BASE_URL}/subscriptions/${subscriptionId}`,
        headers: {
            'X-Recharge-Version': '2021-11',
            'X-Recharge-Access-Token': (0, utils_1.keyRotater)(rechargeApiKeys, subscriptionId),
        },
        data,
    });
    if (status === 429) {
        throw new Error('removeRechargeOneTime, response status === 429 (rate limited)');
    }
    if (status !== 200) {
        throw new Error(`Properties could not be updated for subscription (${subscriptionId}), properties: (${JSON.stringify(properties)}), status-code: ${status}`);
    }
    return Promise.resolve();
});
/**
 * @description attributes will be updated/replaced with the exact attributes
 * passed in, iff passed in.
 */
const updateSubscription = (opts) => __awaiter(void 0, void 0, void 0, function* () { return (0, utils_1.exponentialBackoff)(updateSubscriptionInternal, [opts], { funcName: 'updateSubscriptionInternal' }); });
exports.updateSubscription = updateSubscription;
const getChargesInternal = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, status } = yield (0, axios_1.default)({
        method: 'get',
        url: `${RECHARGE_API_BASE_URL}/charges${Object.entries(queryParams).reduce((acc, [k, v]) => acc ? `${acc}&${k}=${v}` : `?${k}=${v}`, '')}`,
        headers: {
            'X-Recharge-Version': '2021-11',
            'X-Recharge-Access-Token': (0, utils_1.keyRotater)(rechargeApiKeys),
        },
    });
    if (status === 429) {
        throw new Error('getShopifyCustomerId, response status === 429 (rate limited)');
    }
    // @ts-ignore
    return data.charges;
});
/**
 * @description queryParams can be, eg, external_order_id = (shopify order ID),
 * email = (email from shopify order, etc)
 * @deprecated This only pulls the first page of charges...
 * Needs to be refactored to loop through all pages via cursor/etc...
 * However, many common cases just require getting the most recent charges,
 * so this seems to work for that... Also, if you specify a specific query,
 * that will filter down the charges to paginate through; likely not many.
 */
const getCharges = (queryParams) => __awaiter(void 0, void 0, void 0, function* () { return (0, utils_1.exponentialBackoff)(getChargesInternal, [queryParams], { funcName: 'getChargesInternal' }); });
exports.getCharges = getCharges;
const refundRechargeLineItemInternal = ({ chargeId, amount, fullRefund = false, retry = false, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, status } = yield (0, axios_1.default)({
        method: 'post',
        url: `${RECHARGE_API_BASE_URL}/charges/${chargeId}/refund`,
        headers: {
            'X-Recharge-Version': '2021-11',
            'X-Recharge-Access-Token': (0, utils_1.keyRotater)(rechargeApiKeys),
        },
        data: {
            amount,
            full_refund: fullRefund,
            retry,
        },
    });
    if (status === 429) {
        throw new Error('getShopifyCustomerId, response status === 429 (rate limited)');
    }
    if (status === 422) {
        console.error('unprocessable entity (probably already refunded) – skipping for now...', { chargeId, amount });
    }
    if (status !== 200) {
        throw new Error(`problem creating partial refund for line-item:${JSON.stringify({
            chargeId, amount, fullRefund, retry,
        })}`);
    }
    return data;
});
/**
 * @description queryParams can be, eg, external_order_id = (shopify order ID),
 * email = (email from shopify order, etc)
 */
const refundRechargeLineItem = ({ chargeId, amount, fullRefund = false, retry = false, }) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, utils_1.exponentialBackoff)(refundRechargeLineItemInternal, [{
            chargeId, amount, fullRefund, retry,
        }], { funcName: 'refundRechargeLineItemInternal' });
});
exports.refundRechargeLineItem = refundRechargeLineItem;
