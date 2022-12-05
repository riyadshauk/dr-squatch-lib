import axios from 'axios';
import { Property, RechargeCustomer, SubscriptionsResponse } from './types/recharge';
import { exponentialBackoff, keyRotater } from './utils';

const {
  RECHARGE_API_KEYS,
  RECHARGE_API_BASE_URL,
} = process.env;

const rechargeApiKeys = (RECHARGE_API_KEYS || '').split(',');

const addRechargeOneTimeInternal = async ({
  addressId,
  variantId,
  price = '0.00',
  quantity = 1,
}: {
  addressId: number,
  variantId: number,
  // default use case is for order inserts (one free product)
  price?: string,
  quantity?: number,
}): Promise<{ status: number, id: number }> => {
  const { status, data: { onetime: { id } } } = await axios({
    method: 'post',
    url: `${RECHARGE_API_BASE_URL}/onetimes`,
    headers: {
      'X-Recharge-Version': '2021-11',
      'X-Recharge-Access-Token': keyRotater(rechargeApiKeys, addressId),
    },
    data: {
      address_id: addressId,
      add_to_next_charge: true,
      price,
      quantity,
      external_variant_id: {
        ecommerce: String(variantId),
      },
    },
  });
  if (status === 429) {
    throw new Error('addRechargeOneTime, response status === 429 (rate limited)');
  }
  return { status, id };
};

export const addRechargeOneTime = async (opts: {
  addressId: number,
  variantId: number,
}): Promise<{ status: number, id: number }> => exponentialBackoff(addRechargeOneTimeInternal, [opts], { funcName: 'addRechargeOneTime' });

const removeRechargeOneTimeInternal = async ({
  onetimeId,
}: {
  onetimeId: number,
}): Promise<{ status: number }> => {
  const { status } = await axios({
    method: 'delete',
    url: `${RECHARGE_API_BASE_URL}/onetimes/${onetimeId}`,
    headers: {
      'X-Recharge-Version': '2021-11',
      'X-Recharge-Access-Token': keyRotater(rechargeApiKeys, onetimeId),
    },
  });
  if (status === 429) {
    throw new Error('removeRechargeOneTime, response status === 429 (rate limited)');
  }
  return { status };
};

export const removeRechargeOneTime = async (opts: {
  onetimeId: number,
}): Promise<{ status: number }> => exponentialBackoff(removeRechargeOneTimeInternal, [opts], { funcName: 'removeRechargeOneTime' });

const getShopifyCustomerIdInternal = async ({
  rechargeCustomerId,
}: {
  rechargeCustomerId: number
}) => {
  const { data, status } = await axios({
    method: 'get',
    url: `${RECHARGE_API_BASE_URL}/customers/${rechargeCustomerId}`,
    headers: {
      'X-Recharge-Version': '2021-11',
      'X-Recharge-Access-Token': keyRotater(rechargeApiKeys, rechargeCustomerId),
    },
  }) as { data: { customer: RechargeCustomer }, status: number };
  if (status === 429) {
    throw new Error('getShopifyCustomerId, response status === 429 (rate limited)');
  }
  const { external_customer_id: { ecommerce: shopifyCustomerId } } = data.customer;
  return shopifyCustomerId;
};

export const getShopifyCustomerId = async (opts: { rechargeCustomerId: number }) => exponentialBackoff(getShopifyCustomerIdInternal, [opts], { funcName: 'getShopifyCustomerIdInternal' });

const deleteSubscriptionInternal = async ({
  subscriptionId,
}: {
  subscriptionId: number,
}): Promise<{ status: number }> => {
  const { status } = await axios({
    method: 'delete',
    url: `${RECHARGE_API_BASE_URL}/subscriptions/${subscriptionId}`,
    headers: {
      'X-Recharge-Version': '2021-11',
      'X-Recharge-Access-Token': keyRotater(rechargeApiKeys, subscriptionId),
    },
  });
  if (status === 429) {
    throw new Error('removeRechargeOneTime, response status === 429 (rate limited)');
  }
  return { status };
};

export const deleteSubscription = async (opts: {
  subscriptionId: number,
}): Promise<{ status: number }> => exponentialBackoff(deleteSubscriptionInternal, [opts], { funcName: 'deleteSubscriptionInternal' });

const getSubscriptionsInternal = async ({
  addressId,
}: {
  addressId: number,
}): Promise<SubscriptionsResponse> => {
  const { status, data } = await axios({
    method: 'get',
    url: `${RECHARGE_API_BASE_URL}/subscriptions?address_id=${addressId}`,
    headers: {
      'X-Recharge-Version': '2021-11',
      'X-Recharge-Access-Token': keyRotater(rechargeApiKeys, addressId),
    },
  });
  if (status === 429) {
    throw new Error('removeRechargeOneTime, response status === 429 (rate limited)');
  }
  return data as SubscriptionsResponse;
};

export const getSubscriptions = async (opts: {
  addressId: number,
}): Promise<SubscriptionsResponse> => exponentialBackoff(getSubscriptionsInternal, [opts], { funcName: 'getSubscriptionsInternal' });

const refundRechargeChargeInternal = async ({
  chargeId,
}: {
  chargeId: number,
}): Promise<{ status: number }> => {
  const { status } = await axios({
    method: 'post',
    url: `${RECHARGE_API_BASE_URL}/charges/${chargeId}/refund`,
    headers: {
      'X-Recharge-Version': '2021-11',
      'X-Recharge-Access-Token': keyRotater(rechargeApiKeys, chargeId),
    },
    data: {
      full_refund: true,
    },
  });
  if (status === 429) {
    throw new Error('removeRechargeOneTime, response status === 429 (rate limited)');
  }
  return { status };
};

/**
 * @description uses the Recharge API to refund a subscription charge (cur use case: full_refund),
 * which also marks the order as Refunded and Archived in Shopify.
 */
export const refundRechargeCharge = async (opts: {
  chargeId: number,
}): Promise<{ status: number }> => exponentialBackoff(refundRechargeChargeInternal, [opts], { funcName: 'refundRechargeChargeInternal' });

const updateSubscriptionInternal = async ({
  subscriptionId,
  properties,
  sku,
}: {
  subscriptionId: number,
  properties?: Property[],
  sku?: string,
}): Promise<void> => {
  const data: any = {};
  if (properties) {
    data.properties = properties;
  }
  if (sku) {
    data.sku = sku;
  }
  const { status } = await axios({
    method: 'put',
    url: `${RECHARGE_API_BASE_URL}/subscriptions/${subscriptionId}`,
    headers: {
      'X-Recharge-Version': '2021-11',
      'X-Recharge-Access-Token': keyRotater(rechargeApiKeys, subscriptionId),
    },
    data,
  });
  if (status === 429) {
    throw new Error('removeRechargeOneTime, response status === 429 (rate limited)');
  }
  if (status !== 200) {
    throw new Error(`Properties could not be updated for subscription (${subscriptionId}), properties: (${JSON.stringify(properties)}), status-code: ${status}`);
  }
  return Promise.resolve();
};

/**
 * @description attributes will be updated/replaced with the exact attributes
 * passed in, iff passed in.
 */
export const updateSubscription = async (opts: {
  subscriptionId: number,
  properties?: Property[],
  sku?: string,
}): Promise<void> => exponentialBackoff(updateSubscriptionInternal, [opts], { funcName: 'updateSubscriptionInternal' });