import { OneTime, Property, SubscriptionsResponse } from './types/recharge';
export declare const addRechargeOneTime: (opts: {
    addressId: number;
    variantId: number;
}) => Promise<{
    status: number;
    id: number;
}>;
export declare const listRechargeOneTime: (opts: {
    addressId: number;
}) => Promise<{
    onetimes: OneTime[];
}>;
export declare const removeRechargeOneTime: (opts: {
    onetimeId: number;
}) => Promise<{
    status: number;
}>;
export declare const getShopifyCustomerId: (opts: {
    rechargeCustomerId: number;
}) => Promise<any>;
export declare const deleteSubscription: (opts: {
    subscriptionId: number;
}) => Promise<{
    status: number;
}>;
export declare const getSubscriptions: (opts: {
    addressId: number;
}) => Promise<SubscriptionsResponse>;
/**
 * @description uses the Recharge API to refund a subscription charge (cur use case: full_refund),
 * which also marks the order as Refunded and Archived in Shopify.
 */
export declare const refundRechargeCharge: (opts: {
    chargeId: number;
}) => Promise<{
    status: number;
}>;
/**
 * @description attributes will be updated/replaced with the exact attributes
 * passed in, iff passed in.
 */
export declare const updateSubscription: (opts: {
    subscriptionId: number;
    properties?: Property[];
    sku?: string;
}) => Promise<void>;
/**
 * @description queryParams can be, eg, external_order_id = (shopify order ID),
 * email = (email from shopify order, etc)
 * @deprecated This only pulls the first page of charges...
 * Needs to be refactored to loop through all pages via cursor/etc...
 * However, many common cases just require getting the most recent charges,
 * so this seems to work for that... Also, if you specify a specific query,
 * that will filter down the charges to paginate through; likely not many.
 */
export declare const getCharges: (queryParams: {
    [paramName: string]: string;
}) => Promise<any>;
/**
 * @description queryParams can be, eg, external_order_id = (shopify order ID),
 * email = (email from shopify order, etc)
 */
export declare const refundRechargeLineItem: ({ chargeId, amount, fullRefund, retry, }: {
    chargeId: number;
    amount: string;
    fullRefund?: boolean | undefined;
    retry?: boolean | undefined;
}) => Promise<any>;
