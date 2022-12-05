"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PutItemCommand = exports.GetItemCommand = exports.DeleteItemCommand = exports.dynamodb = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
Object.defineProperty(exports, "DeleteItemCommand", { enumerable: true, get: function () { return client_dynamodb_1.DeleteItemCommand; } });
Object.defineProperty(exports, "GetItemCommand", { enumerable: true, get: function () { return client_dynamodb_1.GetItemCommand; } });
Object.defineProperty(exports, "PutItemCommand", { enumerable: true, get: function () { return client_dynamodb_1.PutItemCommand; } });
exports.dynamodb = new client_dynamodb_1.DynamoDBClient({
    region: process.env.DYNAMODB_REGION || 'us-east-1',
});
