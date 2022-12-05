/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/first */
import process from 'process';
import { readFileSync, writeFileSync } from 'fs';
import { join as joinPath } from 'path';
import axios, { AxiosRequestConfig } from 'axios';
import batchRequest from 'batch-request-js';
import { config } from 'dotenv';

const {
  ENV_FILENAME,
} = process.env;

if (ENV_FILENAME !== undefined) {
  console.debug('Overriding env vars with those stored in ENV_FILENAME! If this is not intentded, please unset ENV_FILENAME in your env vars!');
  // only conditionally overwrite config for entire lib in case not in this use-case
  config({ path: joinPath(ENV_FILENAME || '') });
}

const {
  SHOPIFY_DOMAIN, SHOPIFY_ACCESS_TOKEN, SHOPIFY_SOURCE_STORE,
} = process.env;

import { EventEmitter } from 'stream';
import { ShopifyFulfillmentAndTags } from './shopifyScripts';
import { rawQuery } from './query';

// eslint-disable-next-line no-promise-executor-return
export const timeout = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const determineIfKencoOrder = (order: ShopifyFulfillmentAndTags): boolean => {
  let kencoOrder = true;
  const twoDayShippingCodes = 'DMS-2DAY,DMS-2DAY-SUB'.split(',');
  const allowedShippingCodes = 'DMS-STD,DMS-STD-SUB,DMS-PRI,DMS-PRI-SUB,DMS-2DAY,DMS-2DAY-SUB'.split(',');
  const kencoStates = 'FL,VA,WV,MS,UT,WY,MT,WA,CO,ID,OR,AL,GA,ND,ME,NE,AK,CA,NM,AZ,NV,CT,NH,MA,LA,TX,SC,OK,IL,NY,NJ,PA,TN,MO,MN,KY,IA,MI,WI,HI,AA,AE,AP,FM,GU,MP,PR,PW,VI,MH'.split(',');
  const walmartSkus = 'WMTPNTPCK-01,WMTFFLPCK-01,WMTMIXPCK-01,WMTMIXPCK-02'.split(',');
  let hasWalmartSku = false;
  const kencoOnlySkus = 'TOOTH-CM-MNG,TOOTH-SS-NHT,BAR-HAL-SC,BAR-STN-SC,BAR-BOD-SC'.split(',');
  let hasKencoOnlySku = false;
  const kableOnlySkus = 'BUN-LE-SP,BAR-WHY-01,BAR-CHM-01,BAR-A51,BAR-CM,BAR-FROSTY,BAR-MAR,BAR-VAL,BAR-WHSY,BAR-BOD-01,BAR-STN-01,BAR-HAL-01,BUN-LIQ-10OZ,LIQ-CC-10OZ,LIQ-CC-4OZ,LIQ-MM-10OZ,LIQ-MM-4OZ,BUN-LIQ-4OZ'.split(',');
  let hasKableOnlySku = false;

  for (const { node: { sku } } of order.lineItems.edges) {
    const skuUpper = sku.toUpperCase();
    const firstChars = skuUpper.slice(0, 3);
    if (firstChars === 'WH-' || firstChars === 'LIQ') {
      kencoOrder = false;
      break;
    }
    if (skuUpper.indexOf('HANDSAN') > -1) {
      kencoOrder = false;
      break;
    }
    if (skuUpper.indexOf('MUG') > -1 || skuUpper.indexOf('MRKT') > -1 || skuUpper.indexOf('MCH') > -1) {
      if (skuUpper !== 'MCH-RBE-BRN') {
        kencoOrder = false;
        break;
      }
    }
    if (walmartSkus.indexOf(skuUpper) > -1) {
      hasWalmartSku = true;
    }
    if (kencoOnlySkus.indexOf(skuUpper) > -1) {
      hasKencoOnlySku = true;
    }
    if (kableOnlySkus.indexOf(skuUpper) > -1) {
      hasKableOnlySku = true;
    }
  }

  if (hasKableOnlySku) {
    kencoOrder = false;
  } else if (twoDayShippingCodes.indexOf(order.shippingLines.nodes[0].code) > -1) {
    // kencoOrder = false no longer needed
  } else if (hasWalmartSku) {
    kencoOrder = true;
  } else if (hasKencoOnlySku) {
    kencoOrder = true;
  } else if (allowedShippingCodes.indexOf(order.shippingLines.nodes[0].code) > -1 || kencoStates.indexOf(order.shippingAddress.provinceCode) > -1) {
    // do nothing...
  } else {
    kencoOrder = false;
  }

  return kencoOrder;
};

// /**
//  * @todo refactor from batchRequest library, to accept multiple params (ids, trackingNumbers)...
//  *
//  * @todo download JSON version of domestic spreadsheet over/under 1lb to reverse-engineer carrier + url
//  *
//  * @see https://github.com/kunal-mandalia/batch-request-js/blob/master/batch-request.js
//  * @param records
//  * @param request
//  * @param options
//  * @returns
//  */
// const batchSend = (records, request = () => {}, options = { batchSize: 100, delay: 100 }) => new Promise(async (resolve) => {
//   let response = [];
//   const data = [];
//   const error = [];

//   for (let i = 0; i < records.length; i += options.batchSize) {
//     const batch = records.slice(i, i + options.batchSize);
//     // capture individual errors
//     // as per https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all#Promise.all_fail-fast_behaviour
//     const result = await Promise.all(
//       batch.map((record) => request(record).catch((e) => ({ record, error: new Error(e) }))),
//     );
//     response = response.concat(result);
//     await delay(options.delay);
//   }
//   // separate successful requests from errors
//   response.forEach((res) => {
//     res && (res.error instanceof Error) ? error.push(res) : data.push(res);
//   });
//   resolve({
//     error,
//     data,
//   });
// });

// const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

const processAsyncEventEmitter = new EventEmitter();

export async function processAsyncSlidingWindow<T>(
  // eslint-disable-next-line no-unused-vars
  f: (arr: T, ee: EventEmitter, doneEvent: string, jobIdx: number) => Promise<void>,
  tasks: T[],
  state: {
    currentIdx: number,
    windowSize: number,
    errors: T[],
    completed?: number,
    jobs: Promise<void>[],
  } = {
    currentIdx: 0,
    windowSize: 10,
    errors: [],
    completed: 0,
    jobs: [],
  },
) {
  // initial kick off of sliding window, event-based loop
  if (state.jobs.length < state.windowSize) {
    for (let i = state.jobs.length; i < state.windowSize; i++) {
      // continue processing, as long as there are still tasks to process (for edge-case where tasks.length < state.windowSize)
      // @ts-ignore
      if (state.completed < tasks.length) {
        // eslint-disable-next-line no-param-reassign
        state.currentIdx++;
        state.jobs.push(f(tasks[state.currentIdx], processAsyncEventEmitter, 'doneEvent', state.jobs.length));
      }
    }
  }
  // while (state.completed < tasks.length) {
  //   await new Promise((resolve) => setTimeout(() => resolve(), 100));
  // }
}

processAsyncEventEmitter.addListener('doneEvent', (
  // eslint-disable-next-line no-unused-vars
  f: (arr: any, ee: EventEmitter, doneEvent: string, jobIdx: number) => Promise<void>,
  tasks: any[],
  state: {
    currentIdx: number,
    currentlyProcessing: number,
    windowSize: number,
    errors: any[],
    completed?: number,
    jobs: Promise<void>[],
  },
  jobIdx: number,
) => {
  // eslint-disable-next-line no-param-reassign
  state.completed = state.completed ? state.completed : 0;
  // eslint-disable-next-line no-param-reassign
  state.completed++;
  const percentage = state.completed + 1 / tasks.length;
  console.log(`${percentage * 100}% | (${state.completed + 1}/${tasks.length})`); // only displays if success
  // continue looping, as long as their are more tasks to process
  if (state.completed < tasks.length) {
    // eslint-disable-next-line no-param-reassign
    state.jobs[jobIdx] = processAsyncSlidingWindow(f, tasks, state);
  }
});

/**
 * @description Runs process on each orderId passed in. Uses passed in delayMs,
 * defaults to 50ms in each loop iteration.
 */
// eslint-disable-next-line no-unused-vars
export const adHocProcess = async (
  orderIds: any[],
  // eslint-disable-next-line no-unused-vars
  processOrder: (orderIdOrObj: number|any, ee?: EventEmitter, doneEvent?: string, jobIdx?: number) => Promise<any>,
  adhocConfig: {
    delayMs?: number,
    batchRequestFlag?: boolean,
    errorsProcessed?: any[],
    asyncWindow: boolean,
    windowSize: number,
    errors?: any[],
  },
) => {
  const {
    delayMs,
    batchRequestFlag,
    errorsProcessed = [],
    asyncWindow = false,
    windowSize,
    errors = [],
  } = adhocConfig;
  const totalRows = orderIds.length;
  let count = 0;
  if (batchRequestFlag) {
    // do nothing for now
    let error = [];
    let orderIdsToAttempt = [...orderIds];
    do {
      // eslint-disable-next-line no-await-in-loop
      error = (await batchRequest(
        orderIdsToAttempt,
        processOrder,
        { batchSize: 10, delay: 1000 },
      )).error;
      if (error.length !== 0) {
        console.debug('error:', JSON.stringify(error));
        // orderIdsToAttempt = error.map(({ record }) => record);
        orderIdsToAttempt = errorsProcessed;
        console.debug('retrying batchRequest on errored orderIds:', JSON.stringify(orderIdsToAttempt));
        console.debug('errorsLength:', JSON.stringify(orderIdsToAttempt.length));
      }
    } while (error.length !== 0);
  } else if (asyncWindow) {
    await processAsyncSlidingWindow(processOrder, orderIds, {
      currentIdx: 0, windowSize, errors, jobs: [],
    });
    console.log('errors:', JSON.stringify(errors));
    console.log('errors.length:', errors.length);
    if (errors.length === 0) {
      console.log('Successfully completed without any errors!');
    }
  } else {
    for (const orderId of orderIds) {
      try {
        count++;
        // eslint-disable-next-line no-await-in-loop
        await processOrder(orderId);
        // const result =
        // console.log('result:', result);
        // eslint-disable-next-line no-await-in-loop
        await timeout(delayMs || 100); // artificially delay, bc, why not?
        const percentage = count / totalRows;
        console.log(`${percentage * 100}% | (${count}/${totalRows})`); // only displays if success
      } catch (err: any) {
        console.error(`adHocProcess, Error for orderId: ${JSON.stringify(orderId)}`);
        console.error(err.stack);
        errors.push({ orderId, err });
      }
    }
  }
  console.log(`Completed processing; orderIds: ${totalRows}, errors: ${errors.length}`);
  console.log('errors', JSON.stringify(errors));

  if (errors.length > 0) {
    writeFileSync(joinPath(__dirname, `adhocErrors${new Date().toISOString()}.json`), JSON.stringify(errors), { encoding: 'utf-8' });
  }

  return errors.length === 0 ? true : errors; // true iff successful, else return errors
};

export const removeTagsFromOrder = async (orderId: number, tags: string[]) => {
  const id = Buffer.from(`gid://shopify/Order/${orderId}`).toString('base64');
  const stringifiedTagsTrailingComma = tags.reduce((acc, tag) => `${acc}"${tag}",`, '');
  const stringifiedTags = stringifiedTagsTrailingComma.substring(0, stringifiedTagsTrailingComma.length - 1);
  const { data } = await axios({
    method: 'POST',
    url: `https://${SHOPIFY_DOMAIN}/admin/api/graphql.json`,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
    },
    data: JSON.stringify({
      query: `
          mutation {
            tagsRemove(id:"${id}", tags: [${stringifiedTags}]) {
            node {
              id
            }
          }
        }
        `,
    }),
  } as AxiosRequestConfig);
  console.debug('removeTagsFromOrder, data:', JSON.stringify(data));
  if (((data.data.tagsRemove || {}).node || {}).id) {
    // eslint-disable-next-line prefer-destructuring
    const gid = data.data.tagsRemove.node.id;
    return `success: ${gid.replace('gid://shopify/Order/', '')}`;
  }
  console.error('tagsRemove fail:', JSON.stringify(data));
  return 'fail';
};

/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} array to split
 * @param chunkSize {Integer} Size of every group
 * @see https://ourcodeworld.com/articles/read/278/how-to-split-an-array-into-chunks-of-the-same-size-easily-in-javascript
 * @example
 * // Split in group of 3 items
 * const result = chunkArray([1,2,3,4,5,6,7,8], 3);
 * // Outputs : [ [1,2,3] , [4,5,6] ,[7,8] ]
 * console.log(result);
 */
const chunkArray = (arr: any[], chunkSize: number) => {
  let index = 0;
  const ret = [];
  for (index = 0; index < arr.length; index += chunkSize) {
    const chunk = arr.slice(index, index + chunkSize);
    ret.push(chunk);
  }
  return ret;
};

/**
 * @description calls cancelDeposcoOders, eg. Requires a JSON of orderIds to be passed in. And orderId is the number in shopify URL after `orders/`.
 * For example, https://drsquatchsoapco.myshopify.com/admin/orders/4460284444777 => orderId == 4460284444777
 * @example npx ts-node cancelDeposcoOrders.ts orderIds.json
 * @param orderInfo is usually just orderId: number, but for addFulfillments, passed in an object
 */
// eslint-disable-next-line no-unused-vars
export const adhocProcessOfOrderIdsViaCli = async (processOrder: (orderIdOrObj: number|any, ee?: EventEmitter, doneEvent?: string, jobIdx?: number) => Promise<any>, cliConfig: { orderNumbers: boolean, delayMs?: number, batchRequestFlag?: boolean, addFulfillments?: any, errors?: any[], listWithIds?: boolean, logs?: any[], asyncWindow?: boolean, windowSize?: number, } = {
  orderNumbers: false, delayMs: 50, batchRequestFlag: false, errors: [], listWithIds: false, logs: [], asyncWindow: false, windowSize: 10,
}) => {
  if (ENV_FILENAME === undefined) {
    throw new Error('ENV_FILENAME is undefined. Please export ENV_FILENAME=.env.{storeHandle} when running the script via CLI');
  }
  try {
    const {
      orderNumbers: orderNumbersPassedInInsteadOfOrderIds, delayMs, batchRequestFlag, addFulfillments, listWithIds, logs, errors, asyncWindow, windowSize,
    } = cliConfig;
    const args = process.argv;
    const orderIdsFileName = args[2];
    let orderIds: string[] = [];
    let list: { num: number, id?: number, tn?: string }[] = [];
    if (listWithIds === true) {
      list = JSON.parse(readFileSync(joinPath(orderIdsFileName), { encoding: 'utf-8' }));
      orderIds = list.map(({ id }) => String(id));
    } else if (addFulfillments === true) {
      list = JSON.parse(readFileSync(joinPath(orderIdsFileName), { encoding: 'utf-8' }));
      orderIds = list.map(({ num }) => String(num));
    } else {
      orderIds = JSON.parse(readFileSync(joinPath(orderIdsFileName), { encoding: 'utf-8' }));
    }
    orderIds = Array.from(new Set(orderIds));
    let orderIdsWithOrderNumbers: any[] = [];
    if (orderNumbersPassedInInsteadOfOrderIds) {
      const orderNumbers = orderIds;
      console.log('orderNumbers:', JSON.stringify(orderNumbers));
      /**
       * @description to avoid Snowflake SQL error of, eg,
       * OperationFailedError: SQL compilation error: error line 4 at position
       * 28 maximum number of expressions in a list exceeded, expected at
       * most 16,384, got 29,598
       */
      const orderNumbersChunks = chunkArray(orderNumbers, 15000);
      let orderIdsPartial: any[] = [];
      for (const orderNumbersChunk of orderNumbersChunks) {
        // eslint-disable-next-line no-await-in-loop
        const orderIdsWithOrderNumbersPartial = (await rawQuery(`SELECT o.RAW_ID, o.ORDER_NUMBER
        FROM ANALYTICS.MODELED_DATA.SHOPIFY_ORDERS_00_UNION  o
        WHERE o.SOURCE_STORE = '${SHOPIFY_SOURCE_STORE}'
        AND o.ORDER_NUMBER IN (${orderNumbersChunk.map((v: any) => String(v).replace(/\D/g, '')).join(',')});`)).rows;
        orderIdsPartial = [...orderIdsPartial, ...(orderIdsWithOrderNumbersPartial.map((row) => row.RAW_ID) as string[])];
        orderIdsWithOrderNumbers = [...orderIdsWithOrderNumbers, ...orderIdsWithOrderNumbersPartial];
      }
      orderIds = orderIdsPartial;
    }
    console.log('orderIds:', JSON.stringify(orderIds));

    if (listWithIds) {
      // @ts-ignore
      orderIds = list; // hack, ignoring type here to not deal with more type logic/wrapping/etc
    } else if (addFulfillments !== undefined && addFulfillments) {
      const orderNumberToOrderId = orderIdsWithOrderNumbers.reduce((acc, cur) => ({ ...acc, [cur.ORDER_NUMBER]: cur.RAW_ID }), {});
      list = list.map((item) => ({
        ...item,
        id: orderNumberToOrderId[item.num],
      }));
      console.log('list:', JSON.stringify(list));
      // @ts-ignore
      orderIds = list; // hack, ignoring type here to not deal with more type logic/wrapping/etc
    }
    const isSuccess = await adHocProcess(orderIds, processOrder, {
      // @ts-ignore
      delayMs, batchRequestFlag, asyncWindow, windowSize, errorsProcessed: errors, errors,
    });
    console.log(`${Array.isArray(isSuccess) ? 'errors' : 'isSuccess'}:`, JSON.stringify(isSuccess));
    console.log('logs:', JSON.stringify(logs));
  } catch (err: any) {
    console.error(err.stack);
  }
};
