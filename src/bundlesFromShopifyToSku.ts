/* eslint-disable max-len */
import { MaxQueue } from './utils';

export interface Product {
  sku: string,
  variantId: number,
  handle: string,
  productType: string,
  variantTitle: string,
  store: 'US' | 'EU',
  status: 'active' | 'archived' | 'draft',
}

export interface BundleHandleCounts {
  [key: string]: number;
}

export interface BundleBreakdown {
  barsoap: BundleHandleCounts,
  deodorant: BundleHandleCounts,
  'hair-care': BundleHandleCounts,
  onetimes: BundleHandleCounts
  toothpaste: BundleHandleCounts,
  'shower-boosters': BundleHandleCounts,
  shampoo: BundleHandleCounts,
  conditioner: BundleHandleCounts,
  colognes: BundleHandleCounts,
}

export interface BundlesBreakdown {
  [key: string]: BundleBreakdown;
}

export type ProductCategory = 'barsoap' | 'deodorant' | 'hair-care' | 'onetimes' | 'toothpaste' | 'shower-boosters' | 'shampoo' | 'conditioner' | 'colognes';

export const productCategories: ProductCategory[] = ['barsoap', 'deodorant', 'hair-care', 'onetimes', 'toothpaste', 'shower-boosters', 'shampoo', 'conditioner', 'colognes'];

/**
 * @description to be used with a max PQ (higher score means more relevant
 * product, eg, the product likely/significantly matches 1:1 with the passed in
 * category/handle/store defining tuple).
 *
 * @summary this algorithm depends on 2 data-sets:
 * 1) Product data pulled from Snowflake, synced from Shopify via Fivetran connector
 * 2) Metafield data for (bundle) products also pulled from Snowflake
 */
const determineProductRelevancyScore = (product: Product, category: string, handle: string, store: 'US' | 'EU' = 'US'): number => {
  if (product.handle !== handle) {
    return 0;
  }
  if (product.store !== store) {
    return 0;
  }
  // eslint-disable-next-line no-nested-ternary
  const statusScore = product.status === 'active' ? 10 : product.status === 'archived' ? 8 : product.status === 'draft' ? 6 : 0;
  const categoryScore = (() => {
    switch (category) {
      case 'barsoap':
        return product.productType === 'BarSoap' ? 20 : 19;
      case 'deodorant':
        return product.productType === 'Deodorant' ? 20 : 19;
      case 'hair-care':
        return product.productType === 'HairCare' ? 20 : 19;
      case 'onetimes':
        return (product.variantTitle || '').includes('One-Time') ? 20 : 19;
      case 'toothpaste':
        return product.productType === 'Toothpaste' || (product.handle || '').includes('toothpaste') ? 20 : 19;
      case 'shower-boosters':
        return product.productType === 'Booster' || (product.variantTitle || '').toLocaleLowerCase().includes('shower booster') ? 20 : 19;
      case 'shampoo':
        return product.productType === 'HairCare' && (product.handle || '').includes('shampoo') ? 20 : 19;
      case 'conditioner':
        return product.productType === 'HairCare' && (product.handle || '').includes('conditioner') ? 20 : 19;
      case 'colognes':
        return product.productType === 'Cologne' ? 20 : 19;
      default:
        return 0;
    }
  })();
  return categoryScore + statusScore;
};

export class GenerateBundleBreakdown {
  #productList: Product[];

  #bundlesFromShopifyUS: BundlesBreakdown;

  #bundlesFromShopifyEU: BundlesBreakdown;

  constructor({
    bundlesFromShopifyUS,
    bundlesFromShopifyEU,
    productList,
  }: {
    bundlesFromShopifyUS: BundlesBreakdown,
    bundlesFromShopifyEU: BundlesBreakdown,
    productList: Product[],
  }) {
    this.#bundlesFromShopifyUS = bundlesFromShopifyUS;
    this.#bundlesFromShopifyEU = bundlesFromShopifyEU;
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
  }

  /**
   * @returns a list of products; if there are multiple quantities of a single
   * product, the product is duplicated in the list (rather than kept a count of).
   */
  // eslint-disable-next-line class-methods-use-this
  retrieveProducts = (bundleBreakdown: BundleBreakdown, variantTitle = '', store: 'US' | 'EU' = 'US'): Product[] => {
    // console.debug('retrieveProducts:', { bundleBreakdown, variantTitle, store });
    let bundleBreakdownForVariant = bundleBreakdown;
    if (variantTitle !== '') {
      for (const [variationName, variationBreakdown] of Object.entries(bundleBreakdown)) {
        if ((variantTitle || '').includes(variationName)) {
          bundleBreakdownForVariant = variationBreakdown as unknown as BundleBreakdown;
          break;
        }
      }
    }
    // console.debug('bundleBreakdownForVariant:', bundleBreakdownForVariant);
    const products: Product[] = [];
    [...productCategories, variantTitle, 'Default Title'].forEach((category) => {
      // @ts-ignore
      const handleCounts = (bundleBreakdownForVariant || {})[category] || bundleBreakdown[category]; // this falsey check is in case a bogus bundle is passed in
      if (typeof handleCounts !== 'object' || handleCounts === null) {
        return;
      }
      Object.entries(handleCounts).forEach(([handle, count]) => {
        const q = new MaxQueue(1000);
        (this.#productList as Product[]).forEach(
          (p, idx) => q.push(idx, determineProductRelevancyScore(p, category, handle, store)),
        );
        const productIdx = q.pop();
        // @ts-ignore
        for (let i = 0; i < count; i++) {
          products.push(this.#productList[productIdx as unknown as number] as unknown as Product);
        }
      });
    });
    // console.debug('retrieveProducts:', { products });
    return products;
  };

  /**
 * @description This is for getting a deterministic bundle-breakdown given just SKU and store.
 * If more parameters are required, the resulting bundle-breakdown would return an empty array.
 *
 * That said, this was created for a very specific back-end/remorse-period processing
 * purpose of correcting any orders that happen to be missing info on what's contained
 * within a bundle added to the order.
 */
  // eslint-disable-next-line class-methods-use-this
  getBundleBreakdownFromShopify = (sku: string, store: 'US' | 'EU' = 'US', variantTitle: string = ''): Product[] => {
    const bundlesMap: BundlesBreakdown = store === 'US' ? this.#bundlesFromShopifyUS as unknown as BundlesBreakdown : this.#bundlesFromShopifyEU as unknown as BundlesBreakdown;
    // console.debug('getBundleBreakdownFromShopify, bundlesMap:', bundlesMap);
    console.debug('getBundleBreakdownFromShopify:', { sku, variantTitle });
    if (bundlesMap[sku.toUpperCase()] === undefined) {
      throw new Error(`bundle mapping non-existent for bundle: ${JSON.stringify({ sku, store, variantTitle })}`);
    }
    const productsAttemptWithVariantTitle = this.retrieveProducts(
      bundlesMap[sku.toUpperCase()],
      variantTitle,
      store,
    );
    if (productsAttemptWithVariantTitle.length > 0) {
      return productsAttemptWithVariantTitle;
    }
    const productsAttemptWithoutVariantTitle = this.retrieveProducts(bundlesMap[sku.toUpperCase()], undefined, store);
    if (productsAttemptWithoutVariantTitle.length > 0) {
      return productsAttemptWithoutVariantTitle;
    }
    console.error('bundle breakdown not found!!', { sku, variantTitle });
    return [];
  };
}