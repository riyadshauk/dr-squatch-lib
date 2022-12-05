import { Product } from './bundlesFromShopifyToSku';
export declare class SkuOldToNew {
    #private;
    constructor({ productList, stateToDC, }: {
        productList: Product[];
        stateToDC: {
            [stateCode: string]: string;
        };
    });
    retrieveProductInfo: (sku: string, store?: 'US' | 'EU') => Product;
    retrieveStateToDC: () => {
        [stateCode: string]: string;
    };
}
