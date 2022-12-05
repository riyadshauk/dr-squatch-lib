import axios from 'axios';
import { RechargeCustomer } from './types/recharge';
import { ShopifyOrderObject } from './types/shopify';
import { exponentialBackoff } from './utils';

const {
  SQUATCH_RECHARGE_PROXY_API_KEY,
  SQUATCH_RECHARGE_PROXY_API_BASE_URL,
} = process.env;

const getNumberOfSubscriptionsInternal = async (shopifyOrder: ShopifyOrderObject) => {
  const { data } = await axios({
    method: 'get',
    url: `${SQUATCH_RECHARGE_PROXY_API_BASE_URL}/customer?email=${shopifyOrder.email}`,
    headers: {
      'X-Recharge-Version': '2021-11',
      'x-api-key': SQUATCH_RECHARGE_PROXY_API_KEY as string,
    },
  }) as { data: RechargeCustomer };
  if (!data) {
    return {
      active: -1,
      total: -1,
    };
  }
  return {
    active: data.subscriptions_active_count,
    total: data.subscriptions_total_count,
  };
};

export const getNumberOfSubscriptions = async (
  shopifyOrder: ShopifyOrderObject,
): Promise<{
  active: number,
  total: number,
}> => exponentialBackoff(
  getNumberOfSubscriptionsInternal,
  [shopifyOrder],
  { funcName: 'getNumberOfSubscriptions' },
);