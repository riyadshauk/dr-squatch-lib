import { Product } from './bundlesFromShopifyToSku';

export class SkuOldToNew {
  readonly #productList: Product[];

  readonly #stateToDC: { [stateCode: string]: string };

  constructor({
    productList,
    stateToDC,
  }: {
    productList: Product[],
    stateToDC: { [stateCode: string]: string },
  }) {
    this.#productList = [
      // adding in a 'poison pill' to error out when attempting to add unmatched item to order
      {
        sku: 'NON-EXISTENT-PRODUCT',
        variantId: 1,
        handle: 'non-existent-product-no-match',
        productType: 'BarSoap',
        variantTitle: 'Non-existant Product Variant',
        store: 'US',
        status: 'draft',
      },
      ...productList,
    ];
    this.#stateToDC = stateToDC;
  }

  retrieveProductInfo = (sku: string, store: 'US' | 'EU' = 'US') => {
    for (const product of this.#productList as Product[]) {
      if (product.sku === sku && product.store === store) {
        return product;
      }
    }
    throw new Error('Product mapping not found!');
  };

  // kind of superfluous, but just cuz...
  retrieveStateToDC = () => this.#stateToDC;
}