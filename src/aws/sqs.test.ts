import {
  describe,
  test,
  expect,
} from '@jest/globals';
import { sqs } from './sqs';

describe('[lib/aws] sqs', () => {
  test('should be a singleton with basic functionality', () => {
    expect(typeof sqs.sendMessage === 'function').toBeTruthy();
  });
});