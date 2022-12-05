import { ShopifyOrderObject } from './types/shopify';
export declare const getNumberOfSubscriptions: (shopifyOrder: ShopifyOrderObject) => Promise<{
    active: number;
    total: number;
}>;
