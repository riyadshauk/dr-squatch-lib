export declare type SourceType = 'rechargeCharge' | 'rechargeOrder' | 'shopifyOrder' | 'narvarPayload' | 'shopifyFeeds' | 'unknown';
export declare type EngineeringEventName = 'processing_begin' | 'processing_complete' | 'critical_error';
export interface EngineeringEvent {
    /**
     * @description Shouuld be a unique ID for the object being processed, eg, chargeId, orderId, etc
     */
    uid: string;
    /**
     * @description Can be, eg, a date, or just an incrementing counter
     */
    sortKey: string;
    eventName: EngineeringEventName;
    sourceType: SourceType;
    remainingEventProps: {
        [columnName: string]: any;
    };
}
export interface SlackPayload {
    blocks: Block[];
}
export interface Block {
    type: 'section' | 'image';
    text?: Text;
    block_id?: string;
    accessory?: Accessory;
    fields?: Text[];
}
export interface Accessory {
    type: string;
    image_url: string;
    alt_text: string;
}
export interface Text {
    type: string;
    text: string;
}
