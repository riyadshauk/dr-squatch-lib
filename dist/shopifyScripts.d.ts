import { ShopifyOrderObject } from './types/shopify';
export declare type OnlyOneProperty<Union extends string, Value> = {
    [Key in Union]: Record<Key, Value> & {
        [K in Exclude<Union, Key>]?: never;
    };
}[Union];
export declare const getShopifyOrder: (orderId: number) => Promise<ShopifyOrderObject>;
/**
 * @arg T is the type/interface of the object returned in the query
 * @arg U? is the type/interface of what the transformer would return in { data: U|T } response
 */
export declare function shopifyGraphqlRequest<T, U = undefined>(requestPayload: {
    query?: string;
    mutation?: string;
    variables?: {
        [key: string]: any;
    };
}, opts: {
    funcName?: string;
    errorReporter?: (response: {
        data: any;
    }) => {
        error: string;
    } | undefined;
    transform?: (data: {
        data: {
            [field in 'order' | 'customer' | 'tagsAdd']?: T;
        };
    }) => U;
    storeName?: string;
    apiKey?: string;
}): Promise<{
    error?: string;
    data?: U | T;
}>;
export declare const getFulfillmentAndTagsFromShopify: (orderId: number) => Promise<{
    error?: string;
    data?: ShopifyFulfillmentAndTags;
}>;
export declare const getTagsFromShopifyOrder: (orderId: number) => Promise<{
    error?: string;
    data?: ShopifyOrderTagsResponse;
}>;
export declare const getTagsFromShopifyCustomer: (customerId: number) => Promise<{
    error?: string;
    data?: {
        id: string;
        tags: string[];
    };
}>;
export declare const getChannelInfo: (orderId: number) => Promise<{
    error?: string;
    data?: ShopifyChannelDefinition;
}>;
/**
 * @description hits REST API to cancel order
 * Throws if non-200 status, with status code in error message. Makes one attempt to cancel order.
 * @see https://community.shopify.com/c/shopify-apis-and-sdks/how-to-cancel-order-with-graphql-api/td-p/577457
 */
export declare const addTagsInShopify: (gid: string, tags: string[]) => Promise<{
    error?: string;
    data?: any;
}>;
export declare const removeTagsInShopify: (gid: string, tags: string[]) => Promise<{
    error?: string;
    data?: any;
}>;
export declare const refundLineItem: (args: {
    orderId: number;
    lineItemId: number;
    quantity: number;
    note?: string;
    notifyCustomer?: boolean;
}) => Promise<{
    error?: string;
    data?: any;
}>;
export declare const cancelOrderREST: (args: {
    orderId: number;
    notifyCustomer?: boolean;
}) => Promise<void>;
export declare const closeOrder: (gid: string) => Promise<{
    error?: string;
    data?: any;
}>;
/**
 * @description This is useful for when we want to remove+refund line-item
 * for a Recharge order. Such orders cannot be refunded directly in Shopify.
 */
export declare const removeLineItemFromShopifyOrderWithRefund: ({ orderGid, lineItemGid, quantity, amountToRefund, gateway, kind, notify, }: {
    orderGid: string;
    lineItemGid: string;
    quantity: number;
    amountToRefund?: number | undefined;
    gateway?: string | undefined;
    kind?: string | undefined;
    notify?: boolean | undefined;
}) => Promise<{
    error?: string;
    data?: any;
}>;
/**
 * @description This is useful for when we want to remove+refund line-item
 * for a Recharge order. Such orders cannot be refunded directly in Shopify.
 */
export declare const removeLineItemFromShopifyOrderWithoutRefunding: ({ orderGid, lineItemGid, quantity, notify, }: {
    orderGid: string;
    lineItemGid: string;
    quantity: number;
    notify?: boolean | undefined;
}) => Promise<{
    error?: string;
    data?: any;
}>;
export interface ShopifyFulfillmentAndTags {
    id: string;
    tags: string[];
    fulfillments: {
        status: string;
    }[];
    lineItems: {
        edges: {
            node: {
                sku: string;
            };
        }[];
    };
    shippingLines: {
        nodes: {
            code: string;
        }[];
    };
    shippingAddress: {
        provinceCode: string;
    };
}
export interface ShopifyOrderTagsResponse {
    id: string;
    tags: string[];
}
export interface ShopifyChannelDefinition {
    channelName: string;
    handle: string;
}
