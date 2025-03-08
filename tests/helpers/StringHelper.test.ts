import { describe, test, expect } from 'vitest';
import { StringHelper } from '../../src/lib/helpers/StringHelper';

describe('StringHelper', () => {
  const stringHelper = new StringHelper();
  
  test('capitalizes first letter of a string', () => {
    expect(stringHelper.capitalize('english')).toBe('English');
    expect(stringHelper.capitalize('ENGLISH')).toBe('ENGLISH');
    expect(stringHelper.capitalize('')).toBe('');
  });
  
  test('formats numbers with commas for thousands', () => {
    expect(stringHelper.formatNumber(1000)).toBe('1,000');
    expect(stringHelper.formatNumber(1000000)).toBe('1,000,000');
    expect(stringHelper.formatNumber(0)).toBe('0');
  });
  
  test('replaces substrings correctly', () => {
    expect(stringHelper.replaceSubString('hello world', 'world', 'universe')).toBe('hello universe');
    expect(stringHelper.replaceSubString('english spanish', 'english', 'french')).toBe('french spanish');
    expect(stringHelper.replaceSubString('english', 'german', 'french')).toBe('english');
  });
});