import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

// GIGW accessibility controls: text size (scales the root font size, so every rem-based value follows)
// and a high-contrast theme. Preferences persist per browser; storage failures are ignored.

const SCALES = [0.875, 1, 1.125, 1.25] as const;
const DEFAULT_SCALE_INDEX = 1;
const STORAGE_KEY = 'ipc:a11y';

interface A11yState {
  scaleIndex: number;
  highContrast: boolean;
}

interface A11yContextValue extends A11yState {
  canDecrease: boolean;
  canIncrease: boolean;
  decrease: () => void;
  reset: () => void;
  increase: () => void;
  toggleContrast: () => void;
}

const A11yContext = createContext<A11yContextValue | null>(null);

function readStored(): A11yState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const v = JSON.parse(raw) as Partial<A11yState>;
      const scaleIndex = typeof v.scaleIndex === 'number' && v.scaleIndex >= 0 && v.scaleIndex < SCALES.length ? v.scaleIndex : DEFAULT_SCALE_INDEX;
      return { scaleIndex, highContrast: v.highContrast === true };
    }
  } catch {
    /* storage unavailable */
  }
  return { scaleIndex: DEFAULT_SCALE_INDEX, highContrast: false };
}

export function A11yProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<A11yState>(readStored);

  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${SCALES[state.scaleIndex] * 100}%`;
    if (state.highContrast) root.dataset.contrast = 'high';
    else delete root.dataset.contrast;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state]);

  const setScale = useCallback((fn: (i: number) => number) => {
    setState(s => ({ ...s, scaleIndex: Math.min(SCALES.length - 1, Math.max(0, fn(s.scaleIndex))) }));
  }, []);

  const value = useMemo<A11yContextValue>(() => ({
    ...state,
    canDecrease: state.scaleIndex > 0,
    canIncrease: state.scaleIndex < SCALES.length - 1,
    decrease: () => setScale(i => i - 1),
    reset: () => setScale(() => DEFAULT_SCALE_INDEX),
    increase: () => setScale(i => i + 1),
    toggleContrast: () => setState(s => ({ ...s, highContrast: !s.highContrast })),
  }), [state, setScale]);

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}

export function useA11y() {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error('useA11y must be used inside A11yProvider');
  return ctx;
}
