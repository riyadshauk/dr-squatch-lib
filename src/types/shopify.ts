/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
/*
  Shopify Order Object example
  @see https://shopify.dev/api/admin-rest/2022-04/resources/webhook#top
  @see https://jsonformatter.org/json-to-typescript
  @example {
    "id": 820982911946154508,
    "email": "jon@doe.ca",
    "closed_at": null,
    "created_at": "2022-02-03T16:36:32-05:00",
    "updated_at": "2022-02-03T16:36:32-05:00",
    "number": 234,
    "note": null,
    "token": "123456abcd",
    "gateway": null,
    "test": true,
    "total_price": "403.00",
    "subtotal_price": "393.00",
    "total_weight": 0,
    "total_tax": "0.00",
    "taxes_included": false,
    "currency": "USD",
    "financial_status": "voided",
    "confirmed": false,
    "total_discounts": "5.00",
    "total_line_items_price": "398.00",
    "cart_token": null,
    "buyer_accepts_marketing": true,
    "name": "#9999",
    "referring_site": null,
    "landing_site": null,
    "cancelled_at": "2022-02-03T16:36:32-05:00",
    "cancel_reason": "customer",
    "total_price_usd": null,
    "checkout_token": null,
    "reference": null,
    "user_id": null,
    "location_id": null,
    "source_identifier": null,
    "source_url": null,
    "processed_at": null,
    "device_id": null,
    "phone": null,
    "customer_locale": "en",
    "app_id": null,
    "browser_ip": null,
    "landing_site_ref": null,
    "order_number": 1234,
    "discount_applications": [
      {
        "type": "manual",
        "value": "5.0",
        "value_type": "fixed_amount",
        "allocation_method": "each",
        "target_selection": "explicit",
        "target_type": "line_item",
        "description": "Discount",
        "title": "Discount"
      }
    ],
    "discount_codes": [

    ],
    "note_attributes": [

    ],
    "payment_gateway_names": [
      "visa",
      "bogus"
    ],
    "processing_method": "",
    "checkout_id": null,
    "source_name": "web",
    "fulfillment_status": "pending",
    "tax_lines": [

    ],
    "tags": "",
    "contact_email": "jon@doe.ca",
    "order_status_url": "https:\/\/jsmith.myshopify.com\/548380009\/orders\/123456abcd\/authenticate?key=abcdefg",
    "presentment_currency": "USD",
    "total_line_items_price_set": {
      "shop_money": {
        "amount": "398.00",
        "currency_code": "USD"
      },
      "presentment_money": {
        "amount": "398.00",
        "currency_code": "USD"
      }
    },
    "total_discounts_set": {
      "shop_money": {
        "amount": "5.00",
        "currency_code": "USD"
      },
      "presentment_money": {
        "amount": "5.00",
        "currency_code": "USD"
      }
    },
    "total_shipping_price_set": {
      "shop_money": {
        "amount": "10.00",
        "currency_code": "USD"
      },
      "presentment_money": {
        "amount": "10.00",
        "currency_code": "USD"
      }
    },
    "subtotal_price_set": {
      "shop_money": {
        "amount": "393.00",
        "currency_code": "USD"
      },
      "presentment_money": {
        "amount": "393.00",
        "currency_code": "USD"
      }
    },
    "total_price_set": {
      "shop_money": {
        "amount": "403.00",
        "currency_code": "USD"
      },
      "presentment_money": {
        "amount": "403.00",
        "currency_code": "USD"
      }
    },
    "total_tax_set": {
      "shop_money": {
        "amount": "0.00",
        "currency_code": "USD"
      },
      "presentment_money": {
        "amount": "0.00",
        "currency_code": "USD"
      }
    },
    "line_items": [
      {
        "id": 866550311766439020,
        "variant_id": 808950810,
        "title": "IPod Nano - 8GB",
        "quantity": 1,
        "sku": "IPOD2008PINK",
        "variant_title": null,
        "vendor": null,
        "fulfillment_service": "manual",
        "product_id": 632910392,
        "requires_shipping": true,
        "taxable": true,
        "gift_card": false,
        "name": "IPod Nano - 8GB",
        "variant_inventory_management": "shopify",
        "properties": [

        ],
        "product_exists": true,
        "fulfillable_quantity": 1,
        "grams": 567,
        "price": "199.00",
        "total_discount": "0.00",
        "fulfillment_status": null,
        "price_set": {
          "shop_money": {
            "amount": "199.00",
            "currency_code": "USD"
          },
          "presentment_money": {
            "amount": "199.00",
            "currency_code": "USD"
          }
        },
        "total_discount_set": {
          "shop_money": {
            "amount": "0.00",
            "currency_code": "USD"
          },
          "presentment_money": {
            "amount": "0.00",
            "currency_code": "USD"
          }
        },
        "discount_allocations": [

        ],
        "duties": [

        ],
        "admin_graphql_api_id": "gid:\/\/shopify\/LineItem\/866550311766439020",
        "tax_lines": [

        ]
      },
      {
        "id": 141249953214522974,
        "variant_id": 808950810,
        "title": "IPod Nano - 8GB",
        "quantity": 1,
        "sku": "IPOD2008PINK",
        "variant_title": null,
        "vendor": null,
        "fulfillment_service": "manual",
        "product_id": 632910392,
        "requires_shipping": true,
        "taxable": true,
        "gift_card": false,
        "name": "IPod Nano - 8GB",
        "variant_inventory_management": "shopify",
        "properties": [

        ],
        "product_exists": true,
        "fulfillable_quantity": 1,
        "grams": 567,
        "price": "199.00",
        "total_discount": "5.00",
        "fulfillment_status": null,
        "price_set": {
          "shop_money": {
            "amount": "199.00",
            "currency_code": "USD"
          },
          "presentment_money": {
            "amount": "199.00",
            "currency_code": "USD"
          }
        },
        "total_discount_set": {
          "shop_money": {
            "amount": "5.00",
            "currency_code": "USD"
          },
          "presentment_money": {
            "amount": "5.00",
            "currency_code": "USD"
          }
        },
        "discount_allocations": [
          {
            "amount": "5.00",
            "discount_application_index": 0,
            "amount_set": {
              "shop_money": {
                "amount": "5.00",
                "currency_code": "USD"
              },
              "presentment_money": {
                "amount": "5.00",
                "currency_code": "USD"
              }
            }
          }
        ],
        "duties": [

        ],
        "admin_graphql_api_id": "gid:\/\/shopify\/LineItem\/141249953214522974",
        "tax_lines": [

        ]
      }
    ],
    "fulfillments": [

    ],
    "refunds": [

    ],
    "total_tip_received": "0.0",
    "original_total_duties_set": null,
    "current_total_duties_set": null,
    "payment_terms": null,
    "admin_graphql_api_id": "gid:\/\/shopify\/Order\/820982911946154508",
    "shipping_lines": [
      {
        "id": 271878346596884015,
        "title": "Generic Shipping",
        "price": "10.00",
        "code": null,
        "source": "shopify",
        "phone": null,
        "requested_fulfillment_service_id": null,
        "delivery_category": null,
        "carrier_identifier": null,
        "discounted_price": "10.00",
        "price_set": {
          "shop_money": {
            "amount": "10.00",
            "currency_code": "USD"
          },
          "presentment_money": {
            "amount": "10.00",
            "currency_code": "USD"
          }
        },
        "discounted_price_set": {
          "shop_money": {
            "amount": "10.00",
            "currency_code": "USD"
          },
          "presentment_money": {
            "amount": "10.00",
            "currency_code": "USD"
          }
        },
        "discount_allocations": [

        ],
        "tax_lines": [

        ]
      }
    ],
    "billing_address": {
      "first_name": "Bob",
      "address1": "123 Billing Street",
      "phone": "555-555-BILL",
      "city": "Billtown",
      "zip": "K2P0B0",
      "province": "Kentucky",
      "country": "United States",
      "last_name": "Biller",
      "address2": null,
      "company": "My Company",
      "latitude": null,
      "longitude": null,
      "name": "Bob Biller",
      "country_code": "US",
      "province_code": "KY"
    },
    "shipping_address": {
      "first_name": "Steve",
      "address1": "123 Shipping Street",
      "phone": "555-555-SHIP",
      "city": "Shippington",
      "zip": "40003",
      "province": "Kentucky",
      "country": "United States",
      "last_name": "Shipper",
      "address2": null,
      "company": "Shipping Company",
      "latitude": null,
      "longitude": null,
      "name": "Steve Shipper",
      "country_code": "US",
      "province_code": "KY"
    },
    "customer": {
      "id": 115310627314723954,
      "email": "john@test.com",
      "accepts_marketing": false,
      "created_at": null,
      "updated_at": null,
      "first_name": "John",
      "last_name": "Smith",
      "orders_count": 0,
      "state": "disabled",
      "total_spent": "0.00",
      "last_order_id": null,
      "note": null,
      "verified_email": true,
      "multipass_identifier": null,
      "tax_exempt": false,
      "phone": null,
      "tags": "",
      "last_order_name": null,
      "currency": "USD",
      "accepts_marketing_updated_at": null,
      "marketing_opt_in_level": null,
      "sms_marketing_consent": null,
      "admin_graphql_api_id": "gid:\/\/shopify\/Customer\/115310627314723954",
      "default_address": {
        "id": 715243470612851245,
        "customer_id": 115310627314723954,
        "first_name": null,
        "last_name": null,
        "company": null,
        "address1": "123 Elm St.",
        "address2": null,
        "city": "Ottawa",
        "province": "Ontario",
        "country": "Canada",
        "zip": "K2H7A8",
        "phone": "123-123-1234",
        "name": "",
        "province_code": "ON",
        "country_code": "CA",
        "country_name": "Canada",
        "default": true
      }
    }
  }
*/
export interface ShopifyOrderObject {
  id: number;
  email: string;
  closed_at: null;
  created_at: Date;
  updated_at: Date;
  number: number;
  note: null|string;
  token: string;
  gateway: null;
  test: boolean;
  total_price: string;
  subtotal_price: string;
  total_weight: number;
  total_tax: string;
  taxes_included: boolean;
  currency: Currency;
  financial_status: string;
  confirmed: boolean;
  total_discounts: string;
  total_line_items_price: string;
  cart_token: null;
  buyer_accepts_marketing: boolean;
  name: string;
  referring_site: null;
  landing_site: null;
  cancelled_at: Date;
  cancel_reason: string;
  total_price_usd: null;
  checkout_token: null;
  reference: null;
  user_id: null;
  location_id: null;
  source_identifier: null;
  source_url: null;
  processed_at: null;
  device_id: null;
  phone: null;
  customer_locale: string;
  app_id: null;
  browser_ip: null;
  landing_site_ref: null;
  order_number: number;
  discount_applications: DiscountApplication[];
  discount_codes: any[];
  note_attributes: any[];
  payment_gateway_names: string[];
  processing_method: string;
  checkout_id: null;
  source_name: string;
  fulfillment_status: string;
  tax_lines: any[];
  tags: string;
  contact_email: string;
  order_status_url: string;
  presentment_currency: Currency;
  total_line_items_price_set: Set;
  total_discounts_set: Set;
  total_shipping_price_set: Set;
  subtotal_price_set: Set;
  total_price_set: Set;
  total_tax_set: Set;
  line_items: LineItem[];
  fulfillments: any[];
  refunds: any[];
  total_tip_received: string;
  original_total_duties_set: null;
  current_total_duties_set: null;
  payment_terms: null;
  admin_graphql_api_id: string;
  shipping_lines: ShippingLine[];
  billing_address: Address;
  shipping_address: Address;
  customer: Customer;
}

export interface Address {
  first_name: null | string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: null | string;
  address2: null | string;
  company: null | string;
  latitude?: null;
  longitude?: null;
  name: string;
  country_code: string;
  province_code: string;
  id?: number;
  customer_id?: number;
  country_name?: string;
  default?: boolean;
}

// eslint-disable-next-line no-shadow
export enum Currency { // idk why eslint would be erroring here, autogenerated anyways, seems fine.
  // eslint-disable-next-line no-unused-vars
  Usd = 'USD',
}

export interface Customer {
  id: number;
  email: string;
  accepts_marketing: boolean;
  created_at: null;
  updated_at: null;
  first_name: string;
  last_name: string;
  orders_count: number;
  state: string;
  total_spent: string;
  last_order_id: null;
  note: null;
  verified_email: boolean;
  multipass_identifier: null;
  tax_exempt: boolean;
  phone: null;
  tags: string;
  last_order_name: null;
  currency: Currency;
  accepts_marketing_updated_at: null;
  marketing_opt_in_level: null;
  sms_marketing_consent: null;
  admin_graphql_api_id: string;
  default_address: Address;
}

export interface DiscountApplication {
  type: string;
  value: string;
  value_type: string;
  allocation_method: string;
  target_selection: string;
  target_type: string;
  description: string;
  title: string;
}

export interface LineItem {
  id: number;
  variant_id: number;
  title: string;
  quantity: number;
  sku: string;
  variant_title: null;
  vendor: null;
  fulfillment_service: string;
  product_id: number;
  requires_shipping: boolean;
  taxable: boolean;
  gift_card: boolean;
  name: string;
  variant_inventory_management: string;
  properties: any[];
  product_exists: boolean;
  fulfillable_quantity: number;
  grams: number;
  price: string;
  total_discount: string;
  fulfillment_status: null;
  price_set: Set;
  total_discount_set: Set;
  discount_allocations: DiscountAllocation[];
  duties: any[];
  admin_graphql_api_id: string;
  tax_lines: any[];
}

export interface DiscountAllocation {
  amount: string;
  discount_application_index: number;
  amount_set: Set;
}

export interface Set {
  shop_money: Money;
  presentment_money: Money;
}

export interface Money {
  amount: string;
  currency_code: Currency;
}

export interface ShippingLine {
  id: number;
  title: string;
  price: string;
  code: null;
  source: string;
  phone: null;
  requested_fulfillment_service_id: null;
  delivery_category: null;
  carrier_identifier: null;
  discounted_price: string;
  price_set: Set;
  discounted_price_set: Set;
  discount_allocations: any[];
  tax_lines: any[];
}
