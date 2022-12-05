export declare const orderEditBegin: ({ orderId }: {
    orderId: number;
}) => Promise<OrderEditBegin>;
/**
 *
 * @param orderId
 * @param variantId ex, official soap saver to use: gid://shopify/ProductVariant/31305057960041
 * @param quantity
 */
export declare const orderEditAddLineItemAndQuantity: ({ variantId, calculatedOrderGid, quantity, allowDuplicates, countryCode, }: {
    variantId: number;
    calculatedOrderGid: string;
    quantity?: number | undefined;
    allowDuplicates?: boolean | undefined;
    countryCode?: string | undefined;
}) => Promise<OrderEditAddVariant>;
/**
 *
 * @param orderId
 * @param calculatedLineItemGid ex, Line Item ID to use, just renamed as CaluclatedLineItem: gid://shopify/CalculatedLineItem/11606399484084
 * @param quantity
 */
export declare const orderEditSetQuantity: ({ calculatedLineItemGid, calculatedOrderGid, quantity, restock, }: {
    calculatedLineItemGid: string;
    calculatedOrderGid: string;
    quantity: number;
    restock?: boolean | undefined;
}) => Promise<OrderEditSetQuantity>;
export declare const orderEditAddLineItemDiscount: ({ calculatedOrderGid, calculatedLineItemGid, fixedDiscountAmount, fixedDiscountCurrencyCode, percentageDiscount, }: {
    calculatedOrderGid: string;
    calculatedLineItemGid: string;
    fixedDiscountAmount?: number | undefined;
    /**
     * @description 3-letter code, like USD, CAD, GBP, etc
     */
    fixedDiscountCurrencyCode?: string | undefined;
    /**
     * @description perecentage number in range [0, 100]
     */
    percentageDiscount?: number | undefined;
}) => Promise<OrderEditAddLineItemDiscount>;
export declare const orderEditAddLineItemDiscount100Percent: ({ calculatedOrderGid, calculatedLineItemGid, }: {
    calculatedOrderGid: string;
    calculatedLineItemGid: string;
}) => Promise<OrderEditAddLineItemDiscount>;
export declare const orderEditCommit: ({ calculatedOrderGid, notifyCustomer, }: {
    calculatedOrderGid: string;
    notifyCustomer?: boolean | undefined;
}) => Promise<OrderEditCommit>;
export interface OrderEditBegin {
    orderEditBegin: {
        calculatedOrder: {
            id: string;
        };
        userErrors: UserError[];
    };
}
export interface OrderEditAddVariant {
    orderEditAddVariant: {
        calculatedLineItem: {
            id: string;
            variant: {
                contextualPricing: {
                    price: {
                        amount: string;
                        currencyCode: string;
                    };
                };
            };
        };
        calculatedOrder: {
            id: string;
        };
        userErrors: UserError[];
    };
}
export interface OrderEditSetQuantity {
    orderEditSetQuantity: {
        calculatedLineItem: {
            id: string;
        };
        calculatedOrder: {
            id: string;
        };
        userErrors: UserError[];
    };
}
export interface OrderEditAddLineItemDiscount {
    orderEditAddLineItemDiscount: {
        addedDiscountStagedChange: {
            id: number;
        };
        calculatedLineItem: {
            id: number;
        };
        calculatedOrder: {
            id: number;
        };
        userErrors: UserError[];
    };
}
export interface OrderEditCommit {
    orderEditCommit: {
        order: {
            id: string;
        };
        userErrors: UserError[];
    };
}
export interface UserError {
    field: string;
    message: string;
}
