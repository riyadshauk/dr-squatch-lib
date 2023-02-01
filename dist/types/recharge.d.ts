/**
 * @description make sure to only update with the correct/latest version
 * of the API, assuming that's what's being used in clients/services/here.
 * @version 2021-11
 */
export interface RechargeCustomer {
    id: number;
    analytics_data: AnalyticsData;
    created_at: Date;
    email: string;
    external_customer_id: ExternalCustomerID;
    first_charge_processed_at: null;
    first_name: string;
    has_card_error_in_dunning: boolean;
    has_valid_payment_method: boolean;
    hash: string;
    last_name: string;
    subscriptions_active_count: number;
    subscriptions_total_count: number;
    updated_at: Date;
}
export interface AnalyticsData {
    utm_params: UtmParam[];
}
export interface UtmParam {
    utm_source: string;
    utm_medium: string;
}
export interface ExternalCustomerID {
    ecommerce: string;
}
export interface ChargeWrapper {
    charge: Charge;
}
export interface Charge {
    id: number;
    address_id: number;
    analytics_data: RechargeAnalyticsData;
    billing_address: RechargeIngAddress;
    client_details: ClientDetails;
    created_at: Date;
    currency: string;
    customer: RechargeCustomer;
    discounts: any[];
    error: null;
    error_type: null;
    external_order_id: RechargeExternalID;
    external_transaction_id: ExternalTransactionID;
    has_uncommitted_changes: boolean;
    line_items: RechargeLineItem[];
    note: string;
    order_attributes: OrderAttribute[];
    orders_count: number;
    payment_processor: string;
    processed_at: null;
    retry_date: null;
    scheduled_at: Date;
    shipping_address: RechargeIngAddress;
    shipping_lines: RechargeShippingLine[];
    status: string;
    subtotal_price: string;
    tags: string;
    tax_lines: RechargeTaxLine[];
    taxable: boolean;
    total_discounts: string;
    total_line_items_price: string;
    total_price: string;
    total_refunds: string;
    total_tax: string;
    total_weight_grams: number;
    type: string;
    updated_at: Date;
}
export interface RechargeExternalID {
    ecommerce: null | string;
}
export interface RechargeAnalyticsData {
    utm_params: any[];
}
export interface RechargeAddress {
    address1: string;
    address2: null;
    city: string;
    company: null;
    /**
     * @example 'United States'
     */
    country?: string;
    /**
     * @example 'US'
     */
    country_code?: string;
    first_name: string;
    last_name: string;
    phone: string;
    province: string;
    zip: string;
}
export interface RechargeClientDetails {
    browser_ip: null;
    user_agent: null;
}
export interface RechargeLineItem {
    grams: number;
    images: Images;
    price: string;
    properties: Property[];
    quantity: number;
    shopify_product_id: string;
    shopify_variant_id: string;
    sku: string;
    subscription_id: number;
    tax_lines: any[];
    title: string;
    type: string;
    variant_title: string;
    vendor: string;
}
export interface Images {
    large: string;
    medium: string;
    original: string;
    small: string;
}
export interface Property {
    name: string;
    value: boolean | number | string;
}
export interface RechargeShippingLine {
    code: string;
    description: string;
    price: string;
    source: string;
    tax_lines: any[];
    title: string;
}
export interface SubscriptionsResponse {
    next_cursor: null;
    previous_cursor: null;
    subscriptions: Subscription[];
}
export interface Subscription {
    id: number;
    address_id: number;
    customer_id: number;
    analytics_data: RechargeAnalyticsData;
    cancellation_reason: null;
    cancellation_reason_comments: null;
    cancelled_at: null;
    charge_interval_frequency: number;
    created_at: Date;
    expire_after_specific_number_of_charges: null;
    external_product_id: ExternalTID;
    external_variant_id: ExternalTID;
    has_queued_charges: boolean;
    is_prepaid: boolean;
    is_skippable: boolean;
    is_swappable: boolean;
    max_retries_reached: boolean;
    next_charge_scheduled_at: Date;
    order_day_of_month: null;
    order_day_of_week: null;
    order_interval_frequency: number;
    order_interval_unit: string;
    presentment_currency: null;
    price: string;
    product_title: string;
    properties: Property[];
    quantity: number;
    sku?: string;
    sku_override: boolean;
    status: string;
    updated_at: Date;
    variant_title: string;
}
export interface ExternalTID {
    ecommerce: string;
}
export interface RechargeOrderWrapper {
    order: RechargeOrder;
}
export interface RechargeOrder {
    id: number;
    address_id: number;
    billing_address: RechargeIngAddress;
    charge: OrderCharge;
    client_details: ClientDetails;
    created_at: Date;
    currency: string;
    customer: RechargeCustomer;
    discounts: Discount[];
    error: null;
    external_cart_token: string;
    external_order_id: External;
    external_order_number: External;
    is_prepaid: boolean;
    line_items: RechargeLineItem[];
    note: string;
    order_attributes: OrderAttribute[];
    processed_at: Date;
    scheduled_at: Date;
    shipping_address: RechargeIngAddress;
    shipping_lines: RechargeShippingLine[];
    status: string;
    subtotal_price: string;
    tags: string;
    tax_lines: RechargeTaxLine[];
    taxable: boolean;
    total_discounts: string;
    total_line_items_price: string;
    total_price: string;
    total_refunds: string;
    total_tax: string;
    total_weight_grams: number;
    type: string;
    updated_at: Date;
}
export interface RechargeIngAddress {
    address1: string;
    address2: string;
    city: string;
    company: string;
    country_code: string;
    first_name: string;
    last_name: string;
    phone: string;
    province: string;
    zip: string;
}
export interface OrderCharge {
    id: number;
    external_transaction_id: ExternalTransactionID;
}
export interface ExternalTransactionID {
    payment_processor: string;
}
export interface ClientDetails {
    browser_ip: string;
    user_agent: string;
}
export interface External {
    ecommerce: string;
}
export interface Discount {
    id: number;
    code: string;
    value: number;
    value_type: string;
}
export interface OrderAttribute {
    name: string;
    value: string;
}
export interface RechargeTaxLine {
    price: string;
    rate: string;
    title: string;
    unit_price?: string;
}
export interface OneTime {
    id: number;
    address_id: number;
    customer_id: number;
    created_at: Date;
    external_product_id: ExternalTID;
    external_variant_id: ExternalTID;
    is_cancelled: boolean;
    next_charge_scheduled_at: Date;
    presentment_currency: string;
    price: string;
    product_title: string;
    properties: Property[];
    quantity: number;
    sku: null;
    sku_override: boolean;
    updated_at: Date;
    variant_title: string;
}
