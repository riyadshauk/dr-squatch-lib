import {
  DynamoDBClient, DeleteItemCommand, GetItemCommand, PutItemCommand,
} from '@aws-sdk/client-dynamodb';

export const dynamodb = new DynamoDBClient({
  region: process.env.DYNAMODB_REGION || 'us-east-1',
});

export { DeleteItemCommand, GetItemCommand, PutItemCommand };