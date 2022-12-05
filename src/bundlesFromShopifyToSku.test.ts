/* eslint-disable max-len */
/* eslint-disable no-console */
import {
  describe, expect, test,
} from '@jest/globals';
import { BundlesBreakdown, GenerateBundleBreakdown, Product } from './bundlesFromShopifyToSku';
import bundlesFromShopifyUS from '../content-test/bundlesFromShopifyUS-fromDB.json';
import bundlesFromShopifyEU from '../content-test/bundlesFromShopifyEU-fromDB.json';
import productList from '../content-test/productList-fromDB.json';

const generateBundleBreakdown = new GenerateBundleBreakdown({
  bundlesFromShopifyEU: bundlesFromShopifyEU as unknown as BundlesBreakdown,
  bundlesFromShopifyUS: bundlesFromShopifyUS as unknown as BundlesBreakdown,
  productList: productList as unknown as Product[],
});

console.debug('generateBundleBreakdown:', generateBundleBreakdown);

describe('bundlesFromShopifyToSku unit tests', () => {
  test('getBundleBreakdownFromShopify', async () => {
    try {
      [
        { input: ['EU-6PACK', 'EU'], expectedOutput: ['bar-pnt-01-eu', 'bar-cdc-01-eu', 'bar-brm-01-eu', 'bar-gms-01-eu', 'bar-alp-01-eu', 'BAR-BWB-01-EU'] },
        { input: ['BUN-CRC-3PK'], expectedOutput: ['bar-crc-01', 'bar-crc-01', 'bar-crc-01'] },
        { input: ['BUN-CLN-BCH', 'US', 'Beach Bundle / Influencer'], expectedOutput: ['bar-brm-01', 'bar-alp-01', 'bar-gpf-01', 'sav-1'] },
        { input: ['bun-hk-pts', 'US', 'Bundle / One-Time'], expectedOutput: ['smp-pnt-01', 'con-pnt-01', 'SCALP-SCRUB'] },
        { input: ['BUN-CLN-SQ', 'US', 'Squatch Bundle / Influencer'], expectedOutput: ['bar-pnt-01', 'bar-dsg-01', 'bar-gpf-01', 'sav-1'] },
        { input: ['BUN-GM-HAL'], expectedOutput: [] }, // unsupported bundle?
        { input: ['bun-riyad-bar'], expectedOutput: [] }, // bogus bundle
      ].forEach(({ input, expectedOutput }) => {
        console.debug(`test input: ${input}`);
        expect(generateBundleBreakdown.getBundleBreakdownFromShopify(input[0], input[1] as unknown as 'US' | 'EU', input[2]).map(p => p.sku)).toEqual(expectedOutput.map(v => v.toUpperCase()));
      });
    } catch (err: any) {
      console.error(err.stack);
      if (!(err.message.includes('bundle mapping non-existent') && err.message.toLowerCase().includes('bun-riyad-bar'))) {
        expect(false).toBeTruthy();
      }
    }
  });
});