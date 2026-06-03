import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useDebounce,
  useThrottle,
  useMemoryCleanup,
  useResourceCleanup,
  useNetworkStatus,
} from "./useMemoryOptimization";

describe("useDebounce", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("collapses rapid calls into one, with the latest args", () => {
    const spy = vi.fn();
    const { result } = renderHook(() => useDebounce(spy, 200));

    act(() => {
      result.current("a");
      result.current("b");
      result.current("c");
    });
    expect(spy).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(200));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("c");
  });

  it("clears the pending timer on unmount", () => {
    const spy = vi.fn();
    const { result, unmount } = renderHook(() => useDebounce(spy, 200));

    act(() => result.current());
    unmount();
    act(() => vi.advanceTimersByTime(500));
    expect(spy).not.toHaveBeenCalled();
  });
});

describe("useThrottle", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("invokes immediately then suppresses calls within the interval", () => {
    const spy = vi.fn();
    const { result } = renderHook(() => useThrottle(spy, 100));

    act(() => result.current("first"));
    expect(spy).toHaveBeenCalledTimes(1);

    act(() => {
      result.current("ignored-1");
      result.current("ignored-2");
    });
    expect(spy).toHaveBeenCalledTimes(1);

    act(() => vi.advanceTimersByTime(100));
    act(() => result.current("second"));
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith("second");
  });
});

describe("useMemoryCleanup", () => {
  it("runs all cleanup functions on unmount", () => {
    const a = vi.fn();
    const b = vi.fn();
    const { unmount } = renderHook(() => useMemoryCleanup([a, b]));

    expect(a).not.toHaveBeenCalled();
    unmount();
    expect(a).toHaveBeenCalledTimes(1);
    expect(b).toHaveBeenCalledTimes(1);
  });

  it("swallows errors thrown by a cleanup function", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const good = vi.fn();
    const bad = vi.fn(() => {
      throw new Error("boom");
    });
    const { unmount } = renderHook(() => useMemoryCleanup([bad, good]));

    expect(() => unmount()).not.toThrow();
    expect(good).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe("useResourceCleanup", () => {
  it("runs registered cleanups on unmount and not before", () => {
    const cleanup = vi.fn();
    const { result, unmount } = renderHook(() => useResourceCleanup());

    act(() => result.current.addCleanup(cleanup));
    expect(cleanup).not.toHaveBeenCalled();
    unmount();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it("does not run a cleanup that was removed", () => {
    const cleanup = vi.fn();
    const { result, unmount } = renderHook(() => useResourceCleanup());

    act(() => {
      result.current.addCleanup(cleanup);
      result.current.removeCleanup(cleanup);
    });
    unmount();
    expect(cleanup).not.toHaveBeenCalled();
  });
});

describe("useNetworkStatus", () => {
  const setOnline = (value: boolean) =>
    Object.defineProperty(navigator, "onLine", { value, configurable: true });

  afterEach(() => setOnline(true));

  it("reflects navigator.onLine and reacts to connectivity events", () => {
    setOnline(true);
    const { result } = renderHook(() => useNetworkStatus());
    expect(result.current.isOnline).toBe(true);

    act(() => {
      setOnline(false);
      window.dispatchEvent(new Event("offline"));
    });
    expect(result.current.isOnline).toBe(false);

    act(() => {
      setOnline(true);
      window.dispatchEvent(new Event("online"));
    });
    expect(result.current.isOnline).toBe(true);
  });
});
