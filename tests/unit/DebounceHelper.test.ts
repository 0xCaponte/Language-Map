import { describe, it, expect, vi } from 'vitest';
import DebounceHelper from '$lib/helpers/DebounceHelper';

describe('DebounceHelper', () => {
  it('should debounce the function call', () => {
    vi.useFakeTimers();
    const func = vi.fn();
    const debouncer = new DebounceHelper(500);
    const debouncedFunc = debouncer.debounce(func);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should call the function with the latest arguments', () => {
    vi.useFakeTimers();
    const func = vi.fn();
    const debouncer = new DebounceHelper(500);
    const debouncedFunc = debouncer.debounce(func);

    debouncedFunc(1);
    debouncedFunc(2);
    debouncedFunc(3);

    vi.advanceTimersByTime(500);

    expect(func).toHaveBeenCalledWith(3);
  });

  it('should reset the timeout on subsequent calls', () => {
    vi.useFakeTimers();
    const func = vi.fn();
    const debouncer = new DebounceHelper(500);
    const debouncedFunc = debouncer.debounce(func);

    debouncedFunc();
    vi.advanceTimersByTime(250);
    debouncedFunc();
    vi.advanceTimersByTime(250);
    debouncedFunc();

    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(500);

    expect(func).toHaveBeenCalledTimes(1);
  });
});