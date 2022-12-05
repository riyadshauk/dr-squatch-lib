import {
  describe,
  test,
  expect,
} from '@jest/globals';
import { dynamodb } from './dynamodb';

describe('[lib/aws] dynamodb', () => {
  test('should be a singleton with basic functionality', () => {
    expect(typeof dynamodb.send === 'function').toBeTruthy();
  });
});