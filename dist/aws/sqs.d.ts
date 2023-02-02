import { SQS } from 'aws-sdk';
export declare const sqs: SQS;
export interface SQSQueueEvent {
    Records: SQSQueueRecord[];
}
export interface SQSQueueRecord {
    messageId: string;
    receiptHandle: string;
    body: string;
    attributes: null[];
    messageAttributes: SQSMessageAttributes;
    md5OfBody: string;
    eventSource: string;
    eventSourceARN: string;
    awsRegion: string;
}
export interface SQSMessageAttributes {
}
