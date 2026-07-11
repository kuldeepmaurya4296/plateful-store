'use client';

import { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';

export function usePersistedState<T>(
  key: string,
  fallbackValue: T
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [state, setState] = useState<T>(fallbackValue);
  const [isInitialized, setIsInitialized] = useState(false);
  const didMountRef = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setTimeout(() => {
            setState(parsed);
            setIsInitialized(true);
          }, 0);
        } catch (e) {
          console.error(`Error parsing persisted state for key ${key}`, e);
          setTimeout(() => {
            setState(fallbackValue);
            setIsInitialized(true);
          }, 0);
        }
      } else {
        setTimeout(() => {
          setState(fallbackValue);
          setIsInitialized(true);
        }, 0);
      }
    }
  }, [key, fallbackValue]);

  // Sync to localStorage on state change (only after initial load has finished)
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      // Prevent running on the very first mount before initial load
      if (!didMountRef.current) {
        didMountRef.current = true;
        return;
      }
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state, isInitialized]);

  return [state, setState, isInitialized];
}
