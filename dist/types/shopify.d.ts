export interface ShopifyOrderObject {
    id: number;
    email: string;
    closed_at: null;
    created_at: Date;
    updated_at: Date;
    number: number;
    note: null | string;
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
export declare enum Currency {
    Usd = "USD"
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
