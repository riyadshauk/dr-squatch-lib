import { AxiosResponse } from 'axios';
import { EngineeringEventName, SourceType } from './types/services';
export declare const determineSourceType: (obj: any) => SourceType;
export declare const eventTracker: (obj: {
    id: any;
}, eventName: EngineeringEventName, message?: string, props?: {
    [columnName: string]: any;
} | undefined) => Promise<any>;
/**
 * @description this class is for consuming the engineering-events service from
 * client code, be it back-end, or front-end.
 */
export declare class EngineeringEvents {
    serviceName: string;
    transformer: (props: {
        [key: string]: any;
    }) => {
        [key: string]: any;
    };
    /**
     *
     * @param serviceName the name of the client service, such as 'remorse-period-transformer'
     * @param transformer any kind of property transformer to be run on any extra col names
     * passed in as props
     */
    constructor(serviceName: string, transformer?: (props: {
        [key: string]: any;
    }) => {
        [key: string]: any;
    });
    sendCriticalErrorEvent: (obj: {
        id: any;
    }, props?: {
        [columnName: string]: any;
    } | undefined) => Promise<AxiosResponse>;
    sendProcessingBeginEvent: (obj: {
        id: any;
    }, props?: {
        [columnName: string]: any;
    } | undefined) => Promise<AxiosResponse>;
    sendProcessingCompleteEvent: (obj: {
        id: any;
    }, props?: {
        [columnName: string]: any;
    } | undefined) => Promise<AxiosResponse>;
}
