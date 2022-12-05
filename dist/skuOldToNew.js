"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveProductInfo = void 0;
const productList_json_1 = __importDefault(require("./productList.json"));
const retrieveProductInfo = (sku, store = 'US') => {
    for (const product of productList_json_1.default) {
        if (product.sku === sku && product.store === store) {
            return product;
        }
    }
    throw new Error('Product mapping not found!');
};
exports.retrieveProductInfo = retrieveProductInfo;
