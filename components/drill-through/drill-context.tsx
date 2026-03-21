'use client';
import React, { createContext, useCallback, useContext } from 'react';
import { useEffect, useState, type ReactNode } from 'react';

export type DrillState = {
  isOpen: boolean;
  reportId: string | null;
};

export interface DrillContextValue extends DrillState {
  openDrill: (reportId: string) => void;
  closeDrill: () => void;
}


/** Closed state reused by initial render and closeDrill resets. */
const INITIAL_STATE: DrillState = { isOpen: false, reportId: null };

/** Internal React context — consume only via useDrill(). */
const DrillContext = createContext<DrillContextValue | null>(null);

interface DrillProviderProps {
  children: ReactNode;
}

/** Provides drill-through open/close state to the subtree. */
export function DrillProvider({ children }: DrillProviderProps): React.ReactElement {
  const [state, setState] = useState<DrillState>(INITIAL_STATE);
  const openDrill = useCallback((reportId: string) => {
    setState({ isOpen: true, reportId });
  }, []);
  const closeDrill = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  // Lock / unlock body scroll based on open state
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = state.isOpen ? 'hidden' : '';
  }, [state.isOpen]);

  // Dismiss panel on Escape keypress
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') closeDrill();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeDrill]);

  // Restore scroll on unmount
  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') document.body.style.overflow = '';
    };
  }, []);

  return (
    <DrillContext.Provider value={{ ...state, openDrill, closeDrill }}>
      {children}
    </DrillContext.Provider>
  );
}

/** Hook to consume drill context. Must be called inside DrillProvider. */
export function useDrill(): DrillContextValue {
  const ctx = useContext(DrillContext);
  if (ctx === null) throw new Error('useDrill must be used inside <DrillProvider>');
  return ctx;
}
