import { describe, test, expect } from 'vitest';
import { SetHelper } from '../../src/lib/helpers/SetHelper';

describe('SetHelper', () => {
  const setHelper = new SetHelper();
  
  test('checks if two sets are equal', () => {
    const set1 = new Set(['a', 'b', 'c']);
    const set2 = new Set(['a', 'b', 'c']);
    const set3 = new Set(['a', 'b', 'd']);
    
    expect(setHelper.areSetsEqual(set1, set2)).toBe(true);
    expect(setHelper.areSetsEqual(set1, set3)).toBe(false);
    expect(setHelper.areSetsEqual(new Set(), new Set())).toBe(true);
  });
  
  test('finds the difference between two sets', () => {
    const set1 = new Set(['a', 'b', 'c']);
    const set2 = new Set(['a', 'b']);
    
    const diff1 = setHelper.difference(set1, set2);
    expect(diff1.size).toBe(1);
    expect(diff1.has('c')).toBe(true);
    
    const diff2 = setHelper.difference(set2, set1);
    expect(diff2.size).toBe(0);
  });
});