"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateContent = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const axios_1 = __importDefault(require("axios"));
const { CONTENT_DIRECTORY_PATH, // todo: verify that this path works as expected from consuming codebase
CONTENT_BASE_URL, } = process.env;
/**
 * @description This file is for 'building' the JSON flat-file data for this
 * library to depend on, but within the consuming/client code.
 *
 * This building phase should be run pre-build/bundle of the consuming/client code.
 *
 * @note the bundler in consuming/client code must know to keep/bundle these flat files.
 */
const generateContent = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        [
            { filePath: 'fxRates.json', urlPath: 'fx-rates' },
            { filePath: 'productList.json', urlPath: 'product-list' },
            { filePath: 'bundlesFromShopifyUS.json', urlPath: 'product-metafields/us' },
            { filePath: 'bundlesFromShopifyEU.json', urlPath: 'product-metafields/eu' },
            { filePath: 'stateCodeToDistributionCenter.json', urlPath: 'state-to-dc' },
            { filePath: 'skuOldToNewForRecharge.json', urlPath: 'sku-old-to-new-recharge' },
        ].forEach(({ filePath, urlPath }) => __awaiter(void 0, void 0, void 0, function* () {
            (0, fs_1.writeFileSync)((0, path_1.join)(CONTENT_DIRECTORY_PATH || './', filePath), JSON.stringify((yield axios_1.default.get(`${CONTENT_BASE_URL}/${urlPath}`)).data), { encoding: 'utf-8' });
        }));
    }
    catch (err) {
        console.debug('CONTENT_DIRECTORY_PATH:', CONTENT_DIRECTORY_PATH);
        console.debug('CONTENT_BASE_URL:', CONTENT_BASE_URL);
        console.error(err.stack || err);
        throw err;
    }
});
exports.generateContent = generateContent;
