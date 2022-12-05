/* eslint-disable no-use-before-define */
import axios from 'axios';

const {
  SHOPIFY_GRAPHQL_URL,
  SHOPIFY_API_KEY,
} = process.env as { [key: string]: any }; // to ignore eslint null warning

export const orderEditBegin = async ({ orderId }: { orderId: number }): Promise<OrderEditBegin> => {
  const data = JSON.stringify({
    query: `mutation orderEditBegin($id: ID!) {
    orderEditBegin(id: $id) {
      calculatedOrder {
        id
      }
      userErrors {
        field
        message
      }
    }
  }`,
    variables: { id: `gid://shopify/Order/${orderId}` },
  });

  const response: { data: { data: OrderEditBegin } } = await axios({
    method: 'post',
    url: SHOPIFY_GRAPHQL_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_API_KEY,
    },
    data,
  });

  const { userErrors } = response.data.data.orderEditBegin;
  if (userErrors.length > 0) {
    console.error('orderEditBegin, userErrors:', JSON.stringify(userErrors));
    throw new Error(JSON.stringify(userErrors));
  }

  return response.data.data as OrderEditBegin;
};

/**
 *
 * @param orderId
 * @param variantId ex, official soap saver to use: gid://shopify/ProductVariant/31305057960041
 * @param quantity
 */
export const orderEditAddLineItemAndQuantity = async ({
  variantId,
  calculatedOrderGid,
  quantity = 1,
  allowDuplicates = true,
  countryCode = 'US',
}: {
  variantId: number,
  calculatedOrderGid: string,
  quantity?: number,
  allowDuplicates?: boolean,
  countryCode?: string,
}) => {
  const variantGid = `gid://shopify/ProductVariant/${variantId}`;
  const data = JSON.stringify({
    query: `mutation orderEditAddVariant($id: ID!, $quantity: Int!, $variantId: ID!, $allowDuplicates: Boolean!, $country: CountryCode!) {
    orderEditAddVariant(id: $id, quantity: $quantity, variantId: $variantId, allowDuplicates: $allowDuplicates) {
      calculatedLineItem {
        id
        variant {
            contextualPricing(context: { country: $country }) {
                price {
                    amount
                    currencyCode
                }
            }
        }
      }
      calculatedOrder {
        id
      }
      userErrors {
        field
        message
      }
    }
  }`,
    variables: {
      allowDuplicates,
      id: calculatedOrderGid,
      quantity,
      variantId: variantGid,
      country: countryCode,
    },
  });

  const response: { data: { data: OrderEditAddVariant } } = await axios({
    method: 'post',
    url: SHOPIFY_GRAPHQL_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_API_KEY,
    },
    data,
  });

  const { userErrors } = response.data.data.orderEditAddVariant;
  if (userErrors.length > 0) {
    console.error('orderEditAddLineItemAndQuantity, userErrors:', JSON.stringify(userErrors));
    throw new Error(JSON.stringify(userErrors));
  }

  return response.data.data as OrderEditAddVariant;
};

/**
 *
 * @param orderId
 * @param calculatedLineItemGid ex, Line Item ID to use, just renamed as CaluclatedLineItem: gid://shopify/CalculatedLineItem/11606399484084
 * @param quantity
 */
export const orderEditSetQuantity = async ({
  calculatedLineItemGid,
  calculatedOrderGid,
  quantity,
  restock = true,
}: {
  calculatedLineItemGid: string,
  calculatedOrderGid: string,
  quantity: number,
  restock?: boolean,
}) => {
  const data = JSON.stringify({
    query: `mutation orderEditSetQuantityWrapper($id: ID!, $lineItemId: ID!, $quantity: Int!, $restock: Boolean!) {
    orderEditSetQuantity(id: $id, lineItemId: $lineItemId, quantity: $quantity, restock: $restock) {
      calculatedLineItem {
        # CalculatedLineItem fields
        id
      }
      calculatedOrder {
        # CalculatedOrder fields
        id
      }
      userErrors {
        field
        message
      }
    }
  }`,
    variables: {
      id: calculatedOrderGid,
      lineItemId: calculatedLineItemGid,
      quantity,
      restock,
    },
  });

  const response: { data: { data: OrderEditSetQuantity } } = await axios({
    method: 'post',
    url: SHOPIFY_GRAPHQL_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_API_KEY,
    },
    data,
  });

  const { userErrors } = response.data.data.orderEditSetQuantity;
  if (userErrors.length > 0) {
    console.error('orderEditAddLineItemAndQuantity, userErrors:', JSON.stringify(userErrors));
    throw new Error(JSON.stringify(userErrors));
  }

  return response.data.data as OrderEditSetQuantity;
};

export const orderEditAddLineItemDiscount = async (
  {
    calculatedOrderGid,
    calculatedLineItemGid,
    fixedDiscountAmount,
    fixedDiscountCurrencyCode,
    percentageDiscount,
  }: {
    calculatedOrderGid: string,
    calculatedLineItemGid: string,
    fixedDiscountAmount?: number,
    /**
     * @description 3-letter code, like USD, CAD, GBP, etc
     */
    fixedDiscountCurrencyCode?: string,
    /**
     * @description perecentage number in range [0, 100]
     */
    percentageDiscount?: number,
  },
) => {
  const discount = {
    description: '',
  };
  if (fixedDiscountAmount !== undefined && fixedDiscountCurrencyCode !== undefined) {
    // @ts-ignore
    discount.fixedValue = {
      amount: fixedDiscountAmount,
      currencyCode: fixedDiscountCurrencyCode,
    };
  } else if (percentageDiscount !== undefined) {
    // @ts-ignore
    discount.percentValue = percentageDiscount;
  } else {
    throw new Error('orderEditAddLineItemDiscount, Invalid discount amount provided (missing fixed and/or percentage values)!');
  }
  const data = JSON.stringify({
    query: `mutation orderEditAddLineItemDiscount($discount: OrderEditAppliedDiscountInput!, $id: ID!, $lineItemId: ID!) {
    orderEditAddLineItemDiscount(discount: $discount, id: $id, lineItemId: $lineItemId) {
      addedDiscountStagedChange {
        id
      }
      calculatedLineItem {
        id
      }
      calculatedOrder {
        id
      }
      userErrors {
        field
        message
      }
    }
  }`,
    variables: {
      discount,
      id: calculatedOrderGid,
      lineItemId: calculatedLineItemGid,
    },
  });

  const response: { data: { data: OrderEditAddLineItemDiscount } } = await axios({
    method: 'post',
    url: SHOPIFY_GRAPHQL_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_API_KEY,
    },
    data,
  });

  const { userErrors } = response.data.data.orderEditAddLineItemDiscount;
  if (userErrors.length > 0) {
    console.error('orderEditAddLineItemDiscount, userErrors:', JSON.stringify(userErrors));
    throw new Error(JSON.stringify(userErrors));
  }

  return response.data.data as OrderEditAddLineItemDiscount;
};

export const orderEditAddLineItemDiscount100Percent = async (
  {
    calculatedOrderGid,
    calculatedLineItemGid,
  }: {
    calculatedOrderGid: string,
    calculatedLineItemGid: string,
  },
) => orderEditAddLineItemDiscount({
  calculatedOrderGid,
  calculatedLineItemGid,
  percentageDiscount: 100,
});

export const orderEditCommit = async ({
  calculatedOrderGid,
  notifyCustomer = false,
}: {
  calculatedOrderGid: string,
  notifyCustomer?: boolean,
}) => {
  const data = JSON.stringify({
    query: `mutation orderEditCommit($id: ID!) {
    orderEditCommit(id: $id) {
      order {
        id
      }
      userErrors {
        field
        message
      }
    }
  }`,
    variables: { id: calculatedOrderGid, notifyCustomer },
  });

  const response: { data: { data: OrderEditCommit } } = await axios({
    method: 'post',
    url: SHOPIFY_GRAPHQL_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_API_KEY,
    },
    data,
  });

  const { userErrors } = response.data.data.orderEditCommit;
  if (userErrors.length > 0) {
    console.error('orderEditCommit, userErrors:', JSON.stringify(userErrors));
    throw new Error(JSON.stringify(userErrors));
  }

  return response.data.data as OrderEditCommit;
};

export interface OrderEditBegin {
  orderEditBegin: {
    calculatedOrder: {
      id: string,
    },
    userErrors: UserError[],
  }
}

export interface OrderEditAddVariant {
  orderEditAddVariant: {
    calculatedLineItem: {
      id: string,
      variant: {
        contextualPricing: {
          price: {
            amount: string,
            currencyCode: string,
          }
        }
      }
    }
    calculatedOrder: {
      id: string,
    }
    userErrors: UserError[]
  }
}

export interface OrderEditSetQuantity {
  orderEditSetQuantity: {
    calculatedLineItem: {
      id: string,
    }
    calculatedOrder: {
      id: string,
    }
    userErrors: UserError[]
  }
}

export interface OrderEditAddLineItemDiscount {
  orderEditAddLineItemDiscount: {
    addedDiscountStagedChange: {
      id: number,
    },
    calculatedLineItem: {
      id: number,
    }
    calculatedOrder: {
      id: number,
    }
    userErrors: UserError[],
  }
}

export interface OrderEditCommit {
  orderEditCommit: {
    order: {
      id: string,
    },
    userErrors: UserError[],
  }
}

export interface UserError {
  field: string,
  message: string,
}
