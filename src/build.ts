import { writeFileSync } from 'fs';
import { join } from 'path';
import axios from 'axios';

const {
  CONTENT_DIRECTORY_PATH, // todo: verify that this path works as expected from consuming codebase
  CONTENT_BASE_URL,
} = process.env;

/**
 * @description This file is for 'building' the JSON flat-file data for this
 * library to depend on, but within the consuming/client code.
 *
 * This building phase should be run pre-build/bundle of the consuming/client code.
 *
 * @note the bundler in consuming/client code must know to keep/bundle these flat files.
 */
export const generateContent = async () => {
  try {
    [
      { filePath: 'fxRates.json', urlPath: 'fx-rates' },
      { filePath: 'productList.json', urlPath: 'product-list' },
      { filePath: 'bundlesFromShopifyUS.json', urlPath: 'product-metafields/us' },
      { filePath: 'bundlesFromShopifyEU.json', urlPath: 'product-metafields/eu' },
      { filePath: 'stateCodeToDistributionCenter.json', urlPath: 'state-to-dc' },
      { filePath: 'skuOldToNewForRecharge.json', urlPath: 'sku-old-to-new-recharge' },
    ].forEach(async ({ filePath, urlPath }) => {
      writeFileSync(
        join(CONTENT_DIRECTORY_PATH || './', filePath),
        JSON.stringify((await axios.get(`${CONTENT_BASE_URL}/${urlPath}`)).data),
        { encoding: 'utf-8' },
      );
    });
  } catch (err: any) {
    console.debug('CONTENT_DIRECTORY_PATH:', CONTENT_DIRECTORY_PATH);
    console.debug('CONTENT_BASE_URL:', CONTENT_BASE_URL);
    console.error(err.stack || err);
    throw err;
  }
};