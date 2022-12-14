/* eslint-disable import/no-extraneous-dependencies */
import axios, { AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { ShopifyOrderObject } from './types/shopify';

const {
  SHOPIFY_API_KEY, SHOPIFY_DOMAIN,
} = process.env;
const SHOPIFY_GRAPHQL_URL = (shopifyStore?: string) => `https://${SHOPIFY_DOMAIN || shopifyStore}/admin/api/2023-01/graphql.json`;

const SHOPIFY_REST_URL = (shopifyStore?: string) => `https://${SHOPIFY_DOMAIN || shopifyStore}/admin/api/2023-01`;

axiosRetry(axios as any, { retries: 8, retryDelay: axiosRetry.exponentialDelay });

export type OnlyOneProperty<Union extends string, Value> = {
  [Key in Union]: Record<Key, Value> & { [K in Exclude<Union, Key>]?: never };
}[Union];

export const getShopifyOrder = async (orderId: number) => (
  await axios.get(`${SHOPIFY_REST_URL()}/orders/${orderId}.json`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_API_KEY || '',
    },
  })
).data.order as ShopifyOrderObject;

/**
 * @arg T is the type/interface of the object returned in the query
 * @arg U? is the type/interface of what the transformer would return in { data: U|T } response
 */
export async function shopifyGraphqlRequest<T, U = undefined>(
  requestPayload: {
    query?: string,
    mutation?: string,
    variables?: { [key: string]: any },
  },
  opts: {
    funcName?: string
    errorReporter?: (
      // eslint-disable-next-line no-unused-vars
      response: { data: any }
    ) => { error: string } | undefined,
    transform?: (data: { data: { [field in 'order' | 'customer' | 'tagsAdd']?: T } }) => U
    storeName?: string,
    apiKey?: string,
  },
): Promise<{
  error?: string, data?: U | T
}> {
  const {
    errorReporter, transform, storeName, apiKey,
  } = opts;
  const { data } = await axios({
    url: SHOPIFY_GRAPHQL_URL(storeName),
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': apiKey || SHOPIFY_API_KEY,
    },
    data: requestPayload,
  } as AxiosRequestConfig);
  if (errorReporter !== undefined) {
    const errorReport = errorReporter(data);
    if (errorReport !== undefined) {
      return errorReport;
    }
  }
  try { // in case trying to access data that isn't there for given query (in edge cases)
    if (transform) {
      return {
        error: '',
        data: transform(data),
      };
    }
    return {
      error: '',
      data: data.data.order || data.data.customer, // kind of hacky, but works for now
    };
  } catch (err: any) {
    return {
      error: err.stack,
    };
  }
}

export const getFulfillmentAndTagsFromShopify = async (orderId: number): Promise<{
  error?: string, data?: ShopifyFulfillmentAndTags
}> => shopifyGraphqlRequest<ShopifyFulfillmentAndTags>(
  {
    query: `
        {
          order(id: "gid://shopify/Order/${orderId}") {
            id
            tags
            fulfillments {
              status
            }
            lineItems(first: 100) {
                edges {
                  node {
                    sku
                }
              }
            }
            shippingLines(first: 1) {
              nodes {
                code
              }
            }
            shippingAddress {
              provinceCode
            }
          }
        }
        `,
  },
  {
    errorReporter: (data) => (!data.data.order ? { error: 'Order Id not found' } : undefined),
  },
);

export const getTagsFromShopifyOrder = async (orderId: number): Promise<{
  error?: string, data?: ShopifyOrderTagsResponse
}> => shopifyGraphqlRequest<ShopifyOrderTagsResponse>(
  {
    query: `
        {
          order(id: "gid://shopify/Order/${orderId}") {
            id
            tags
          }
        }
        `,
  },
  {
    errorReporter: (data) => (!data.data.order ? { error: 'Order Id not found' } : undefined),
  },
);

export const getTagsFromShopifyCustomer = async (customerId: number): Promise<{
  error?: string, data?: { id: string, tags: string[] }
}> => shopifyGraphqlRequest<{ id: string, tags: string[] }>(
  {
    query: `
        {
          customer(id: "gid://shopify/Customer/${customerId}") {
            id
            tags
          }
        }
        `,
  },
  {
    errorReporter: (data) => (!data.data.customer ? { error: 'Customer Id not found' } : undefined),
  },
);

export const getChannelInfo = async (orderId: number): Promise<
  { error?: string, data?: ShopifyChannelDefinition }
// @ts-ignore
> => shopifyGraphqlRequest<ShopifyChannelInfo, ShopifyChannelDefinition>(
  {
    query: `
        {
          order(id: "gid://shopify/Order/${orderId}") {
            channelInformation {
              channelDefinition {
                channelName
                handle
              }
            }
          }
        }
        `,
  },
  {
    errorReporter: (data) => (!data.data.order ? { error: 'Order Id not found' } : undefined),
    /**
     * @description if channelInformation is null, we don't know the channel type.
     * Note that Recharge orders also happen to have channelInformation === null
     * (as oppose to standard Shopify-based orders).
     */
    transform: data => data.data.order!.channelInformation === null ? ({
      channelName: 'unknown',
      handle: 'unknown',
    }) : data.data.order!.channelInformation.channelDefinition,
  },
);

/**
 * @description hits REST API to cancel order
 * Throws if non-200 status, with status code in error message. Makes one attempt to cancel order.
 * @see https://community.shopify.com/c/shopify-apis-and-sdks/how-to-cancel-order-with-graphql-api/td-p/577457
 */
// export const cancelOrder = async (orderId: number) => {
//   const { status } = await axios.post(`${SHOPIFY_REST_URL()}/orders/${orderId}/cancel.json`, {
//     headers: {
//       'Content-Type': 'application/json',
//       'X-Shopify-Access-Token': SHOPIFY_API_KEY || '',
//     },
//   });
//   if (status !== 200) {
//     throw new Error(`Could not cancel order! API status is ${status}`);
//   }
// };

export const addTagsInShopify = async (
  gid: string,
  tags: string[],
): Promise<{
  error?: string,
  data?: any,
}> => shopifyGraphqlRequest<any>(
  {
    query: `mutation tagsAdd($id: ID!, $tags: [String!]!) {
              tagsAdd(id: $id, tags: $tags) {
                userErrors {
                  field
                  message
                }
              }
            }`,
    variables: {
      id: gid,
      tags: tags.map(tag => tag.substring(0, 40)),
    },
  },
  {
    // eslint-disable-next-line max-len
    errorReporter: data => (data.data.tagsAdd.userErrors.length > 0 ? { error: JSON.stringify(data.data.tagsAdd.userErrors) } : undefined),
    transform: data => data.data?.order || data.data?.customer,
  },
);

export const removeTagsInShopify = async (
  gid: string,
  tags: string[],
): Promise<{
  error?: string,
  data?: any,
}> => shopifyGraphqlRequest<any>(
  {
    query: `mutation tagsRemove($id: ID!, $tags: [String!]!) {
              tagsRemove(id: $id, tags: $tags) {
                userErrors {
                  field
                  message
                }
              }
            }`,
    variables: {
      id: gid,
      tags,
    },
  },
  {
    // eslint-disable-next-line max-len
    errorReporter: data => (data.data.tagsRemove.userErrors.length > 0 ? { error: JSON.stringify(data.data.tagsRemove.userErrors) } : undefined),
    transform: data => data.data?.order || data.data?.customer,
  },
);

export const refundLineItem = async (args: {
  orderId: number,
  lineItemId: number,
  quantity: number,
  note?: string,
  notifyCustomer?: boolean,
}): Promise<{
  error?: string,
  data?: any,
}> => shopifyGraphqlRequest<any>(
  {
    query: `mutation refundCreate($input: RefundInput!) {
      refundCreate(input: $input) {
        userErrors {
          field
          message
        }
      }
    }`,
    variables: {
      input: {
        note: args.note || '',
        notify: args.notifyCustomer || false,
        orderId: `gid://shopify/Order/${args.orderId}`,
        refundLineItems: [
          {
            lineItemId: `gid://shopify/LineItem/${args.lineItemId}`,
            quantity: args.quantity,
          },
        ],
      },
    }
    ,
  },
  {
    // eslint-disable-next-line max-len
    errorReporter: data => (data.data.refundCreate.userErrors.length > 0 ? { error: JSON.stringify(data.data.refundCreate.userErrors) } : undefined),
    // @ts-ignore
    transform: data => data.data?.refundCreate,
  },
);

export const cancelOrderREST = async (args: {
  orderId: number,
  notifyCustomer?: boolean,
}) => {
  const resp = await axios.post(
    `${SHOPIFY_REST_URL()}/orders/${args.orderId}/cancel.json`,
    {
      email: args.notifyCustomer ? args.notifyCustomer : false,
    },
    {
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_API_KEY || '',
        'Content-Type': 'application/json',
      },
    },
  );
  if (resp.status !== 200) {
    throw new Error(`Could not cancel order for order of, orderId: ${args.orderId}`);
  }
};

export const closeOrder = async (
  gid: string,
): Promise<{
  error?: string,
  data?: any,
}> => shopifyGraphqlRequest<any>(
  {
    query: `mutation orderClose($input: OrderCloseInput!) {
      orderClose(input: $input) {
        order {
          id
        }
        userErrors {
          field
          message
        }
      }
    }`,
    variables: {
      input: {
        id: gid,
      },
    },
  },
  {
    // eslint-disable-next-line max-len
    errorReporter: data => (data.data.orderClose.userErrors.length > 0 ? { error: JSON.stringify(data.data.orderClose.userErrors) } : undefined),
    transform: data => data.data?.order || data.data?.customer,
  },
);

/**
 * @description This is useful for when we want to remove+refund line-item
 * for a Recharge order. Such orders cannot be refunded directly in Shopify.
 *
 * If no amountsToRefund specified, this will only remove the item from the
 * order (and not actually refund anything)!
 *
 * Currency must be the presentment_currency in orders where there
 * is a presentment_currency and a shop_currency; 3-letters, all-caps.
 *
 * Any ids, such as lineItemId, should be GID values.
 */
export const removeLineItemFromShopifyOrderWithRefund = async ({
  orderGid,
  refundLineItems,
  gateway,
  amountsToRefund,
  currency = 'USD',
  kind = 'REFUND',
  notify = false,
}: {
  orderGid: string,
  refundLineItems: { lineItemId: string, quantity: number }[],
  amountsToRefund: number[],
  currency?: string,
  gateway?: string,
  kind?: string,
  notify?: boolean,
}): Promise<{
  error?: string,
  data?: any,
}> => shopifyGraphqlRequest<any>(
  {
    query: `mutation refundCreate($input: RefundInput!) {
      refundCreate(input: $input) {
        order {
          # Order fields
          id
        }
        refund {
          # Refund fields
          id
        }
        userErrors {
          field
          message
        }
      }
    }`,
    variables: {
      input: {
        note: 'Removing line-item',
        notify,
        orderId: orderGid,
        currency,
        refundLineItems,
        transactions: Array.isArray(amountsToRefund) ? amountsToRefund.map(amount => ({
          amount, // $ amount, including applicable tax associated with item
          gateway,
          kind,
          orderId: orderGid,
        })) : [],
      },
    },
  },
  {
    // eslint-disable-next-line max-len
    errorReporter: data => (data.data.refundCreate.userErrors.length > 0 ? { error: JSON.stringify(data.data.refundCreate.userErrors) } : undefined),
    // @ts-ignore
    transform: data => data.data?.refundCreate,
  },
);

/**
 * @description This is useful for when we want to remove+refund line-item
 * for a Recharge order. Such orders cannot be refunded directly in Shopify.
 */
export const removeLineItemFromShopifyOrderWithoutRefunding = async ({
  orderGid,
  refundLineItems,
  notify = false,
}: {
  orderGid: string,
  refundLineItems: { lineItemId: string, quantity: number }[],
  quantity: number,
  notify?: boolean,
}): Promise<{
  error?: string,
  data?: any,
}> => removeLineItemFromShopifyOrderWithRefund({
  orderGid, refundLineItems, notify, amountsToRefund: [],
});

// @ts-ignore
export const queryOrderDataWithPaymentAndFulfillmentStatus: Promise<{
  displayFulfillmentStatus: string
  displayFinancialStatus: string
  tags: Array<string>
  id: string
  originalTotalDutiesSet: any
  totalReceivedSet: {
    presentmentMoney: {
      amount: string
      currencyCode: string
    }
    shopMoney: {
      amount: string
      currencyCode: string
    }
  }
  totalShippingPriceSet: {
    presentmentMoney: {
      amount: string
      currencyCode: string
    }
    shopMoney: {
      amount: string
      currencyCode: string
    }
  }
  totalRefundedSet: {
    presentmentMoney: {
      amount: string
      currencyCode: string
    }
    shopMoney: {
      amount: string
      currencyCode: string
    }
  }
  transactions: Array<{
    id: string
    gateway: string
    formattedGateway: string
    parentTransaction: any
    amountSet: {
      presentmentMoney: {
        amount: string
        currencyCode: string
      }
      shopMoney: {
        amount: string
        currencyCode: string
      }
    }
    fees: Array<{
      amount: {
        amount: string
        currencyCode: string
      }
      flatFee: {
        amount: string
        currencyCode: string
      }
      flatFeeName: any
      id: string
      rate: string
      rateName: string
      taxAmount: {
        amount: string
        currencyCode: string
      }
      type: string
    }>
  }>
  lineItems: {
    edges: Array<{
      node: {
        id: string
        sku: string
        title: string
        refundableQuantity: number
        originalUnitPriceSet: {
          presentmentMoney: {
            amount: string
            currencyCode: string
          }
          shopMoney: {
            amount: string
            currencyCode: string
          }
        }
        discountedUnitPriceSet: {
          presentmentMoney: {
            amount: string
            currencyCode: string
          }
          shopMoney: {
            amount: string
            currencyCode: string
          }
        }
        duties: Array<any>
      }
    }>
  }
}> = async (
  orderId: number,
) => shopifyGraphqlRequest<any>(
  {
    query: `{
      # The ID of the order.
      order(id: "gid://shopify/Order/${orderId}") {
        # The total amount of duties after returns, in shop and presentment currencies. Returns 'null' if duties aren't applicable.
        # currentTotalDutiesSet {
        #     presentmentMoney {
        #         amount
        #         currencyCode
        #     }
        #     shopMoney {
        #         amount
        #         currencyCode
        #     }
        # }
        displayFulfillmentStatus
        displayFinancialStatus
        tags
        id
        # currentTotalDutiesSet {
        #     presentmentMoney {
        #         amount
        #         currencyCode
        #     }
        #   shopMoney {
        #     amount
        #     currencyCode
        #   }
        # }
        # discountApplications {
        #     pageInfo {
        #         startCursor
        #         endCursor
        #     }
        #     a
        # }
        # subtotalPriceSet {
        #     presentmentMoney {
        #         amount
        #         currencyCode
        #     }
        #     shopMoney {
        #         amount
        #         currencyCode
        #     }
        # }
        # originalTotalPriceSet {
        #     presentmentMoney {
        #         amount
        #         currencyCode
        #     }
        #     shopMoney {
        #         amount
        #         currencyCode
        #     }
        # }
        originalTotalDutiesSet {
            presentmentMoney {
                amount
                currencyCode
            }
            shopMoney {
                amount
                currencyCode
            }
        }
        # totalDiscountsSet {
        #     presentmentMoney {
        #         amount
        #         currencyCode
        #     }
        #     shopMoney {
        #         amount
        #         currencyCode
        #     }
        # }
        totalReceivedSet {
            presentmentMoney {
                amount
                currencyCode
            }
            shopMoney {
                amount
                currencyCode
            }
        }
        totalShippingPriceSet {
            presentmentMoney {
                amount
                currencyCode
            }
            shopMoney {
                amount
                currencyCode
            }
        }
        # totalTaxSet {
        #     presentmentMoney {
        #         amount
        #         currencyCode
        #     }
        #     shopMoney {
        #         amount
        #         currencyCode
        #     }
        # }
        totalRefundedSet {
            presentmentMoney {
                amount
                currencyCode
            }
            shopMoney {
                amount
                currencyCode
            }
        }
        transactions (first: 10) {
            id
            gateway
            formattedGateway
            parentTransaction {
                id
            }
            amountSet {
                presentmentMoney {
                    amount
                    currencyCode
                }
                shopMoney {
                    amount
                    currencyCode
                }
            }
            fees {
                amount {
                    amount
                    currencyCode
                }
                flatFee {
                    amount
                    currencyCode
                }
                flatFeeName
                id
                rate
                rateName
                taxAmount {
                    amount
                    currencyCode
                }
                type
            }
        }
        lineItems(first: 10) {
          edges {
            node {
              id
              sku
              title
              refundableQuantity
              originalUnitPriceSet {
                  presentmentMoney {
                    amount
                    currencyCode
                }
                shopMoney {
                    amount
                    currencyCode
                }
              }
              discountedUnitPriceSet {
                  presentmentMoney {
                    amount
                    currencyCode
                }
                shopMoney {
                    amount
                    currencyCode
                }
              }
              # The duties associated with the line item.
              duties {
                id
                harmonizedSystemCode
                price {
                  shopMoney {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }`,
    variables: {},
  },
  {
    // eslint-disable-next-line max-len
    errorReporter: data => (data.data.order.userErrors.length > 0 ? { error: JSON.stringify(data.data.order.userErrors) } : undefined),
    // @ts-ignore
    transform: data => data.data?.order,
  },
);

// export const addTagsInShopify = async (gid: string, tags: string[]) => backOff(
//   // eslint-disable-next-line no-return-await
//   async () => await addTagWithoutRetry(gid, tags),
//   {
//     jitter: 'full',
//     retry: (err, attemptNumber) => {
//       console.error('addTagsInShopify, retry, error:', err);
//       console.error('addTagsInShopify, retry, attemptNumber:', attemptNumber);
//       return true; // keep retrying until (default) numAttempts
//     },
//   },
// );

export interface ShopifyFulfillmentAndTags {
  id: string;
  tags: string[];
  fulfillments: { status: string }[];
  lineItems: { edges: { node: { sku: string } }[] };
  shippingLines: { nodes: { code: string }[] };
  shippingAddress: { provinceCode: string };
}

export interface ShopifyOrderTagsResponse {
  id: string;
  tags: string[];
}

interface ShopifyChannelInfo {
  channelInformation: {
    channelDefinition: ShopifyChannelDefinition;
  }
}

export interface ShopifyChannelDefinition {
  channelName: string;
  handle: string;
}