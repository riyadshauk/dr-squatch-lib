import { SnowflakeError } from 'snowflake-sdk';
export declare const queryOrders: (sqlQueryText: string) => Promise<{
    error: SnowflakeError;
    ordersIds: number[];
}>;
export declare const rawQuery: (sqlQueryText?: string) => Promise<{
    error: SnowflakeError;
    rows: any[];
}>;
