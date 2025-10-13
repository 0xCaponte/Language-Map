import { describe, test, expect } from 'vitest';
import { StringHelper } from '$lib/helpers/StringHelper';

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

  describe('formatPercentageNumber', () => {
    test('formats numbers greater than or equal to 0.5 as integers', () => {
      expect(stringHelper.formatPercentageNumber(50.6)).toBe('51');
      expect(stringHelper.formatPercentageNumber(0.5)).toBe('1');
    });

    test('formats numbers less than 0.5 with one decimal place', () => {
      expect(stringHelper.formatPercentageNumber(0.49)).toBe('0.5');
      expect(stringHelper.formatPercentageNumber(0.01)).toBe('0.1');
    });

    test('formats 0 as "0"', () => {
      expect(stringHelper.formatPercentageNumber(0)).toBe('0');
    });
  });

  describe('replaceSubString', () => {
    test('replaces substrings correctly', () => {
      expect(stringHelper.replaceSubString('hello world', 'world', 'universe')).toBe('hello universe');
      expect(stringHelper.replaceSubString('english spanish', 'english', 'french')).toBe('french spanish');
      expect(stringHelper.replaceSubString('english', 'german', 'french')).toBe('english');
    });

    test('is case-insensitive when finding substring to replace', () => {
      expect(stringHelper.replaceSubString('Hello World', 'world', 'Universe')).toBe('Hello Universe');
    });
  });
});