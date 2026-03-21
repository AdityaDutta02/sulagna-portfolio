// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { DrillProvider, useDrill } from '../drill-context';
import type { ReactNode } from 'react';

function wrapper({ children }: { children: ReactNode }) {
  return <DrillProvider>{children}</DrillProvider>;
}

describe('useDrill', () => {
  it('starts with closed state', () => {
    const { result } = renderHook(() => useDrill(), { wrapper });
    expect(result.current.isOpen).toBe(false);
    expect(result.current.reportId).toBeNull();
  });

  it('openDrill sets isOpen and reportId', () => {
    const { result } = renderHook(() => useDrill(), { wrapper });
    act(() => result.current.openDrill('test-id'));
    expect(result.current.isOpen).toBe(true);
    expect(result.current.reportId).toBe('test-id');
  });

  it('closeDrill resets to initial state', () => {
    const { result } = renderHook(() => useDrill(), { wrapper });
    act(() => result.current.openDrill('test-id'));
    act(() => result.current.closeDrill());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.reportId).toBeNull();
  });

  it('open then close returns to initial state', () => {
    const { result } = renderHook(() => useDrill(), { wrapper });
    act(() => result.current.openDrill('report-a'));
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.closeDrill());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.reportId).toBeNull();
  });
});
