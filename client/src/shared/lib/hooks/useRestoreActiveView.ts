import { useEffect, useState } from 'react';
import { AnyAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

type UseRestoreActiveViewParams<T extends string> = {
  localStorageKey: string;
  validViews: readonly T[];
  setAction: (view: T) => AnyAction;
};

/**
 * Restores the active view from localStorage on the client and dispatches the provided action.
 * Returns isReady to allow callers to defer rendering until state is restored, preventing UI flicker.
 */
export const useRestoreActiveView = <T extends string>({
  localStorageKey,
  validViews,
  setAction,
}: UseRestoreActiveViewParams<T>): { isReady: boolean } => {
  const dispatch = useDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(localStorageKey) as T | null;
      if (saved && (validViews as readonly string[]).includes(saved)) {
        dispatch(setAction(saved as T));
      }
    }
    setIsReady(true);
    // setAction is a stable action creator from a slice; include for completeness
  }, [dispatch, localStorageKey, validViews, setAction]);

  return { isReady };
};
