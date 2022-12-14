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
 *
 * If no amountsToRefund specified, this will only remove the item from the
 * order (and not actually refund anything)!
 *
 * Currency must be the presentment_currency in orders where there
 * is a presentment_currency and a shop_currency; 3-letters, all-caps.
 *
 * Any ids, such as lineItemId, should be GID values.
 */
export declare const removeLineItemFromShopifyOrderWithRefund: ({ orderGid, refundLineItems, gateway, amountsToRefund, currency, kind, notify, }: {
    orderGid: string;
    refundLineItems: {
        lineItemId: string;
        quantity: number;
    }[];
    amountsToRefund: number[];
    currency?: string | undefined;
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
export declare const removeLineItemFromShopifyOrderWithoutRefunding: ({ orderGid, refundLineItems, notify, }: {
    orderGid: string;
    refundLineItems: {
        lineItemId: string;
        quantity: number;
    }[];
    quantity: number;
    notify?: boolean | undefined;
}) => Promise<{
    error?: string;
    data?: any;
}>;
export declare const queryOrderDataWithPaymentAndFulfillmentStatus: (orderId: number) => Promise<{
    error?: string | undefined;
    data?: OrderDataWithPaymentAndFulfillmentStatus | undefined;
}>;
export interface OrderDataWithPaymentAndFulfillmentStatus {
    displayFulfillmentStatus: string;
    displayFinancialStatus: string;
    tags: Array<string>;
    id: string;
    originalTotalDutiesSet: any;
    totalReceivedSet: {
        presentmentMoney: {
            amount: string;
            currencyCode: string;
        };
        shopMoney: {
            amount: string;
            currencyCode: string;
        };
    };
    totalShippingPriceSet: {
        presentmentMoney: {
            amount: string;
            currencyCode: string;
        };
        shopMoney: {
            amount: string;
            currencyCode: string;
        };
    };
    totalRefundedSet: {
        presentmentMoney: {
            amount: string;
            currencyCode: string;
        };
        shopMoney: {
            amount: string;
            currencyCode: string;
        };
    };
    transactions: Array<{
        id: string;
        gateway: string;
        formattedGateway: string;
        parentTransaction: any;
        amountSet: {
            presentmentMoney: {
                amount: string;
                currencyCode: string;
            };
            shopMoney: {
                amount: string;
                currencyCode: string;
            };
        };
        fees: Array<{
            amount: {
                amount: string;
                currencyCode: string;
            };
            flatFee: {
                amount: string;
                currencyCode: string;
            };
            flatFeeName: any;
            id: string;
            rate: string;
            rateName: string;
            taxAmount: {
                amount: string;
                currencyCode: string;
            };
            type: string;
        }>;
    }>;
    lineItems: {
        edges: Array<{
            node: {
                id: string;
                sku: string;
                title: string;
                refundableQuantity: number;
                originalUnitPriceSet: {
                    presentmentMoney: {
                        amount: string;
                        currencyCode: string;
                    };
                    shopMoney: {
                        amount: string;
                        currencyCode: string;
                    };
                };
                discountedUnitPriceSet: {
                    presentmentMoney: {
                        amount: string;
                        currencyCode: string;
                    };
                    shopMoney: {
                        amount: string;
                        currencyCode: string;
                    };
                };
                duties: Array<any>;
            };
        }>;
    };
}
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
