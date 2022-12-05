import { Product } from './bundlesFromShopifyToSku';
import productList from './productList.json';

export const retrieveProductInfo = (sku: string, store: 'US' | 'EU' = 'US') => {
  for (const product of productList as Product[]) {
    if (product.sku === sku && product.store === store) {
      return product;
    }
  }
  throw new Error('Product mapping not found!');
};