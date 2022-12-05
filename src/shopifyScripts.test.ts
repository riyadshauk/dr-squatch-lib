/* eslint-disable no-console */
import {
  describe, expect, test,
} from '@jest/globals';
import {
  addTagsInShopify,
  // getChannelInfo,
  removeTagsInShopify,
} from './shopifyScripts';

describe('shopifyScripts tests', () => {
  // test('getChannelInfo', async () => {
  //   try {
  //     const channelInfo = await getChannelInfo(4736972456041);
  //     const { handle, channelName } = channelInfo.data!;
  //     expect(handle).toBe('shop');
  //     expect(channelName).toBe('Shop');

  //     // eg, a Recharge order doesn't have a 'channel'
  //     const channelInfoBad = await getChannelInfo(4740295852137);
  //     expect(channelInfoBad.data).toBeUndefined();
  //     expect(channelInfoBad.error).toBeDefined();
  //   } catch (err: any) {
  //     console.error(err.stack);
  //     expect(false).toBeTruthy();
  //   }
  // });

  test('tagsAdd', async () => {
    const gid = 'gid://shopify/Order/4535146086505'; // an old test order
    const date = Date.now();
    const result = await addTagsInShopify(gid, [date.toString()]);
    expect(result.error).toBeFalsy();
    const result2 = await removeTagsInShopify(gid, [date.toString()]);
    expect(result2.error).toBeFalsy();
  });
});