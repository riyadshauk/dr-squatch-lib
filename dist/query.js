"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawQuery = exports.queryOrders = void 0;
// eslint-disable-next-line import/no-extraneous-dependencies
const snowflake_sdk_1 = require("snowflake-sdk");
const { SNOWFLAKE_ACCOUNT, SNOWFLAKE_USERNAME, SNOWFLAKE_PASSWORD, SNOWFLAKE_DATABASE, } = process.env;
let conn;
const initConnection = () => new Promise((resolve, reject) => {
    (0, snowflake_sdk_1.createConnection)({
        account: SNOWFLAKE_ACCOUNT || '',
        username: SNOWFLAKE_USERNAME || '',
        password: SNOWFLAKE_PASSWORD || '',
        database: SNOWFLAKE_DATABASE || '',
        // schema: SNOWFLAKE_SCHEMA_NAME || '',
    }).connect((err, con) => (err ? reject(err) : resolve(con)));
});
const queryOrders = (sqlQueryText) => __awaiter(void 0, void 0, void 0, function* () {
    if (!conn) {
        conn = yield initConnection();
    }
    return new Promise((resolve) => {
        conn.execute({
            sqlText: sqlQueryText,
            // @ts-ignore
            complete: (error, statement, rows) => {
                if (error) {
                    console.error(error.stack);
                    console.error('statement and rows:');
                    console.error(statement);
                    console.error(rows);
                }
                resolve({
                    error,
                    ordersIds: rows.map(({ ORDER_ID }) => ORDER_ID),
                });
            },
        });
    });
});
exports.queryOrders = queryOrders;
const rawQuery = (sqlQueryText) => __awaiter(void 0, void 0, void 0, function* () {
    if (!conn) {
        conn = yield initConnection();
    }
    return new Promise((resolve) => {
        conn.execute({
            sqlText: sqlQueryText || '',
            // @ts-ignore
            complete: (error, statement, rows) => {
                if (error) {
                    console.error(error.stack);
                    console.error('statement and rows:');
                    console.error(statement);
                    console.error(rows);
                }
                resolve({
                    error,
                    rows,
                });
            },
        });
    });
});
exports.rawQuery = rawQuery;
