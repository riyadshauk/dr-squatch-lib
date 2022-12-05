/* eslint-disable no-empty */
import axios, { AxiosResponse } from 'axios';
import { Charge, RechargeOrder } from './types/recharge';
import { EngineeringEvent, EngineeringEventName, SourceType } from './types/services';
import { ShopifyOrderObject } from './types/shopify';

const {
  ENGINEERING_EVENTS_URL_PROD,
  ENGINEERING_EVENTS_URL_FALLBACK,
} = process.env;

export const determineSourceType = (obj: any): SourceType => {
  let sourceType: SourceType = 'unknown';
  try {
    const charge = obj as Charge;
    if (charge.note.includes('next order in sequence')) {
      sourceType = 'rechargeCharge';
    }
  } catch { }
  try {
    const rechargeOrder = obj as RechargeOrder;
    if (rechargeOrder.charge.id) {
      sourceType = 'rechargeOrder';
    }
  } catch { }
  try {
    const shopifyOrder = obj as ShopifyOrderObject;
    if (shopifyOrder.admin_graphql_api_id) {
      sourceType = 'shopifyOrder';
    }
  } catch { }
  try {
    const narvarPayload = obj as any;
    if (narvarPayload.narvar_tracer_id !== undefined) {
      sourceType = 'narvarPayload';
    }
  } catch { }
  try {
    const shopifyFeeds = obj as any;
    if (shopifyFeeds.shopifyFeeds) {
      sourceType = 'shopifyFeeds';
    }
  } catch { }
  return sourceType;
};

export const eventTracker = async (
  obj: { id: any },
  eventName: EngineeringEventName,
  message?: string,
  props?: { [columnName: string]: any },
): Promise<any> => {
  const uid = obj.id || ''; // if this is empty, might be telling of a bug later on
  const sortKey = new Date().toISOString();

  const remainingProps = {
    message,
    ...props,
  };

  for (const [key, val] of Object.entries(remainingProps)) {
    if (val === undefined) {
      // @ts-ignore
      delete remainingProps[key];
    }
  }

  const engineeringEvent: EngineeringEvent = {
    uid,
    sortKey,
    eventName,
    sourceType: determineSourceType(obj),
    remainingEventProps: {
      ...remainingProps,
    },
  };

  if (!ENGINEERING_EVENTS_URL_PROD || !ENGINEERING_EVENTS_URL_FALLBACK) {
    console.error('Engineering events URLs are falsey! Service will crash here!');
    console.debug('ENGINEERING_EVENTS_URL_PROD:', ENGINEERING_EVENTS_URL_PROD);
    console.debug('ENGINEERING_EVENTS_URL_FALLBACK:', ENGINEERING_EVENTS_URL_FALLBACK);
  }

  try {
    const result = await axios.post(
      ENGINEERING_EVENTS_URL_PROD as string,
      engineeringEvent,
    );

    if (result.status >= 300 || result.status < 200) {
      const msg = 'eventTracker, ENGINEERING_EVENTS_URL_PROD service seems to be down! Trying fallback service URL';
      console.error(msg);
      throw new Error(msg);
    }
  } catch (err: any) {
    console.error('eventTracker, err:', err.stack || err);
    const result = await axios.post(
      ENGINEERING_EVENTS_URL_FALLBACK as string,
      engineeringEvent,
    );

    if (result.status >= 300 || result.status < 200) {
      const msg = 'eventTracker, ENGINEERING_EVENTS_URL_FALLBACK service seems to be down! Throwing an error!';
      console.error(msg);
      throw new Error(msg);
    }
  }
};

/**
 * @description this class is for consuming the engineering-events service from
 * client code, be it back-end, or front-end.
 */
export class EngineeringEvents {
  serviceName: string;

  transformer: (props: { [key: string]: any }) => { [key: string]: any };

  /**
   *
   * @param serviceName the name of the client service, such as 'remorse-period-transformer'
   * @param transformer any kind of property transformer to be run on any extra col names
   * passed in as props
   */
  constructor(
    serviceName: string,
    transformer?: (props: { [key: string]: any }) => { [key: string]: any },
  ) {
    this.serviceName = serviceName;
    this.transformer = transformer || ((props: { [key: string]: any }) => props);
  }

  sendCriticalErrorEvent = (
    obj: { id: any },
    props?: { [columnName: string]: any },
  ): Promise<AxiosResponse> => eventTracker(
    obj,
    'critical_error',
    undefined,

    this.transformer({ ...props, serviceName: this.serviceName }),
  );

  sendProcessingBeginEvent = (
    obj: { id: any },
    props?: { [columnName: string]: any },
  ): Promise<AxiosResponse> => eventTracker(
    obj,
    'processing_begin',
    undefined,
    this.transformer({ ...props, serviceName: this.serviceName }),
  );

  sendProcessingCompleteEvent = (
    obj: { id: any },
    props?: { [columnName: string]: any },
  ): Promise<AxiosResponse> => eventTracker(
    obj,
    'processing_complete',
    undefined,
    this.transformer({ ...props, serviceName: this.serviceName }),
  );
}
