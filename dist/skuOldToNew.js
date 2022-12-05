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
var _SkuOldToNew_productList, _SkuOldToNew_stateToDC;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkuOldToNew = void 0;
class SkuOldToNew {
    constructor({ productList, stateToDC, }) {
        _SkuOldToNew_productList.set(this, void 0);
        _SkuOldToNew_stateToDC.set(this, void 0);
        this.retrieveProductInfo = (sku, store = 'US') => {
            for (const product of __classPrivateFieldGet(this, _SkuOldToNew_productList, "f")) {
                if (product.sku === sku && product.store === store) {
                    return product;
                }
            }
            throw new Error('Product mapping not found!');
        };
        // kind of superfluous, but just cuz...
        this.retrieveStateToDC = () => __classPrivateFieldGet(this, _SkuOldToNew_stateToDC, "f");
        __classPrivateFieldSet(this, _SkuOldToNew_productList, [
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
        __classPrivateFieldSet(this, _SkuOldToNew_stateToDC, stateToDC, "f");
    }
}
exports.SkuOldToNew = SkuOldToNew;
_SkuOldToNew_productList = new WeakMap(), _SkuOldToNew_stateToDC = new WeakMap();
