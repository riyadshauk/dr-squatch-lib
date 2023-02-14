"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GenerateBundleBreakdown_productList, _GenerateBundleBreakdown_bundlesFromShopifyUS, _GenerateBundleBreakdown_bundlesFromShopifyEU;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateBundleBreakdown = exports.productCategories = void 0;
/* eslint-disable max-len */
const utils_1 = require("./utils");
exports.productCategories = ['barsoap', 'deodorant', 'hair-care', 'onetimes', 'toothpaste', 'shower-boosters', 'shampoo', 'conditioner', 'colognes'];
/**
 * @description to be used with a max PQ (higher score means more relevant
 * product, eg, the product likely/significantly matches 1:1 with the passed in
 * category/handle/store defining tuple).
 *
 * @summary this algorithm depends on 2 data-sets:
 * 1) Product data pulled from Snowflake, synced from Shopify via Fivetran connector
 * 2) Metafield data for (bundle) products also pulled from Snowflake
 */
const determineProductRelevancyScore = (product, category, handle, store = 'US') => {
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
class GenerateBundleBreakdown {
    constructor({ bundlesFromShopifyUS, bundlesFromShopifyEU, productList, }) {
        _GenerateBundleBreakdown_productList.set(this, void 0);
        _GenerateBundleBreakdown_bundlesFromShopifyUS.set(this, void 0);
        _GenerateBundleBreakdown_bundlesFromShopifyEU.set(this, void 0);
        /**
         * @returns a list of products; if there are multiple quantities of a single
         * product, the product is duplicated in the list (rather than kept a count of).
         */
        // eslint-disable-next-line class-methods-use-this
        this.retrieveProducts = (bundleBreakdown, variantTitle = '', store = 'US') => {
            // console.debug('retrieveProducts:', { bundleBreakdown, variantTitle, store });
            let bundleBreakdownForVariant = bundleBreakdown;
            if (variantTitle !== '') {
                for (const [variationName, variationBreakdown] of Object.entries(bundleBreakdown)) {
                    if ((variantTitle || '').includes(variationName)) {
                        bundleBreakdownForVariant = variationBreakdown;
                        break;
                    }
                }
            }
            // console.debug('bundleBreakdownForVariant:', bundleBreakdownForVariant);
            const products = [];
            [...exports.productCategories, variantTitle, 'Default Title'].forEach((category) => {
                // @ts-ignore
                const handleCounts = (bundleBreakdownForVariant || {})[category] || bundleBreakdown[category]; // this falsey check is in case a bogus bundle is passed in
                if (typeof handleCounts !== 'object' || handleCounts === null) {
                    return;
                }
                Object.entries(handleCounts).forEach(([handle, count]) => {
                    const q = new utils_1.MaxQueue(1000);
                    __classPrivateFieldGet(this, _GenerateBundleBreakdown_productList, "f").forEach((p, idx) => q.push(idx, determineProductRelevancyScore(p, category, handle, store)));
                    const productIdx = q.pop();
                    // @ts-ignore
                    for (let i = 0; i < count; i++) {
                        products.push(__classPrivateFieldGet(this, _GenerateBundleBreakdown_productList, "f")[productIdx]);
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
        this.getBundleBreakdownFromShopify = (sku, store = 'US', variantTitle = '') => {
            const bundlesMap = store === 'US' ? __classPrivateFieldGet(this, _GenerateBundleBreakdown_bundlesFromShopifyUS, "f") : __classPrivateFieldGet(this, _GenerateBundleBreakdown_bundlesFromShopifyEU, "f");
            // console.debug('getBundleBreakdownFromShopify, bundlesMap:', bundlesMap);
            console.debug('getBundleBreakdownFromShopify:', { sku, variantTitle });
            if (bundlesMap[sku.toUpperCase()] === undefined) {
                throw new Error(`bundle mapping non-existent for bundle: ${JSON.stringify({ sku, store, variantTitle })}`);
            }
            const productsAttemptWithVariantTitle = this.retrieveProducts(bundlesMap[sku.toUpperCase()], variantTitle, store);
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
        __classPrivateFieldSet(this, _GenerateBundleBreakdown_bundlesFromShopifyUS, bundlesFromShopifyUS, "f");
        __classPrivateFieldSet(this, _GenerateBundleBreakdown_bundlesFromShopifyEU, bundlesFromShopifyEU, "f");
        __classPrivateFieldSet(this, _GenerateBundleBreakdown_productList, [
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
        ], "f");
    }
}
exports.GenerateBundleBreakdown = GenerateBundleBreakdown;
_GenerateBundleBreakdown_productList = new WeakMap(), _GenerateBundleBreakdown_bundlesFromShopifyUS = new WeakMap(), _GenerateBundleBreakdown_bundlesFromShopifyEU = new WeakMap();
