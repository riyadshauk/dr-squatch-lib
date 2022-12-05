// eslint-disable-next-line import/no-extraneous-dependencies
import {
  Connection, createConnection, Statement, SnowflakeError,
} from 'snowflake-sdk';

const {
  SNOWFLAKE_ACCOUNT,
  SNOWFLAKE_USERNAME,
  SNOWFLAKE_PASSWORD,
  SNOWFLAKE_DATABASE,
} = process.env;

let conn: Connection;

const initConnection = (): Promise<Connection> => new Promise(
  (resolve, reject) => {
    createConnection({
      account: SNOWFLAKE_ACCOUNT || '',
      username: SNOWFLAKE_USERNAME || '',
      password: SNOWFLAKE_PASSWORD || '',
      database: SNOWFLAKE_DATABASE || '',
      // schema: SNOWFLAKE_SCHEMA_NAME || '',
    }).connect((err, con) => (err ? reject(err) : resolve(con)));
  },
);

export const queryOrders = async (sqlQueryText: string): Promise<{
  error: SnowflakeError,
  ordersIds: number[]
}> => {
  if (!conn) {
    conn = await initConnection();
  }
  return new Promise((resolve) => {
    conn.execute({
      sqlText: sqlQueryText,
      // @ts-ignore
      complete: (
        error: SnowflakeError,
        statement: Statement,
        rows: { ORDER_ID: number }[],
      ) => {
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
};

export const rawQuery = async (sqlQueryText?: string): Promise<{
  error: SnowflakeError,
  rows: any[]
}> => {
  if (!conn) {
    conn = await initConnection();
  }
  return new Promise((resolve) => {
    conn.execute({
      sqlText: sqlQueryText || '',
      // @ts-ignore
      complete: (
        error: SnowflakeError,
        statement: Statement,
        rows: any[],
      ) => {
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
};