export interface Product {
    sku: string;
    variantId: number;
    handle: string;
    productType: string;
    variantTitle: string;
    store: 'US' | 'EU';
    status: 'active' | 'archived' | 'draft';
}
export interface BundleHandleCounts {
    [key: string]: number;
}
export interface BundleBreakdown {
    barsoap: BundleHandleCounts;
    deodorant: BundleHandleCounts;
    'hair-care': BundleHandleCounts;
    onetimes: BundleHandleCounts;
    toothpaste: BundleHandleCounts;
    'shower-boosters': BundleHandleCounts;
    shampoo: BundleHandleCounts;
    conditioner: BundleHandleCounts;
    colognes: BundleHandleCounts;
}
export interface BundlesBreakdown {
    [key: string]: BundleBreakdown;
}
export declare type ProductCategory = 'barsoap' | 'deodorant' | 'hair-care' | 'onetimes' | 'toothpaste' | 'shower-boosters' | 'shampoo' | 'conditioner' | 'colognes';
export declare const productCategories: ProductCategory[];
export declare class GenerateBundleBreakdown {
    #private;
    constructor({ bundlesFromShopifyUS, bundlesFromShopifyEU, productList, }: {
        bundlesFromShopifyUS: BundlesBreakdown;
        bundlesFromShopifyEU: BundlesBreakdown;
        productList: Product[];
    });
    /**
     * @returns a list of products; if there are multiple quantities of a single
     * product, the product is duplicated in the list (rather than kept a count of).
     */
    retrieveProducts: (bundleBreakdown: BundleBreakdown, variantTitle?: string, store?: 'US' | 'EU') => Product[];
    /**
   * @description This is for getting a deterministic bundle-breakdown given just SKU and store.
   * If more parameters are required, the resulting bundle-breakdown would return an empty array.
   *
   * That said, this was created for a very specific back-end/remorse-period processing
   * purpose of correcting any orders that happen to be missing info on what's contained
   * within a bundle added to the order.
   */
    getBundleBreakdownFromShopify: (sku: string, store?: 'US' | 'EU', variantTitle?: string) => Product[];
}
