import { Property, SubscriptionsResponse } from './types/recharge';
export declare const addRechargeOneTime: (opts: {
    addressId: number;
    variantId: number;
}) => Promise<{
    status: number;
    id: number;
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
