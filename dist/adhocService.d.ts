/// <reference types="node" />
import { EventEmitter } from 'stream';
import { ShopifyFulfillmentAndTags } from './shopifyScripts';
export declare const timeout: (ms: number) => Promise<unknown>;
export declare const determineIfKencoOrder: (order: ShopifyFulfillmentAndTags) => boolean;
export declare function processAsyncSlidingWindow<T>(f: (arr: T, ee: EventEmitter, doneEvent: string, jobIdx: number) => Promise<void>, tasks: T[], state?: {
    currentIdx: number;
    windowSize: number;
    errors: T[];
    completed?: number;
    jobs: Promise<void>[];
}): Promise<void>;
/**
 * @description Runs process on each orderId passed in. Uses passed in delayMs,
 * defaults to 50ms in each loop iteration.
 */
export declare const adHocProcess: (orderIds: any[], processOrder: (orderIdOrObj: number | any, ee?: EventEmitter, doneEvent?: string, jobIdx?: number) => Promise<any>, adhocConfig: {
    delayMs?: number;
    batchRequestFlag?: boolean;
    batchSize?: number;
    errorsProcessed?: any[];
    asyncWindow: boolean;
    windowSize: number;
    errors?: any[];
}) => Promise<true | any[]>;
export declare const removeTagsFromOrder: (orderId: number, tags: string[]) => Promise<string>;
/**
 * @description calls cancelDeposcoOders, eg. Requires a JSON of orderIds to be passed in. And orderId is the number in shopify URL after `orders/`.
 * For example, https://drsquatchsoapco.myshopify.com/admin/orders/4460284444777 => orderId == 4460284444777
 * @example npx ts-node cancelDeposcoOrders.ts orderIds.json
 * @param orderInfo is usually just orderId: number, but for addFulfillments, passed in an object
 */
export declare const adhocProcessOfOrderIdsViaCli: (processOrder: (orderIdOrObj: number | any, ee?: EventEmitter, doneEvent?: string, jobIdx?: number) => Promise<any>, cliConfig?: {
    orderNumbers: boolean;
    delayMs?: number;
    batchRequestFlag?: boolean;
    batchSize?: number;
    addFulfillments?: any;
    errors?: any[];
    listWithIds?: boolean;
    logs?: any[];
    asyncWindow?: boolean;
    windowSize?: number;
}) => Promise<void>;
