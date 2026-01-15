import { useCallback, useRef } from "react";

interface QrScannerLockOptions {
  cooldownMs?: number;
}

export function useQrScannerLock(options?: QrScannerLockOptions) {
  const { cooldownMs = 1500 } = options || {};
  const isLockedRef = useRef(false);
  const lastValueRef = useRef<string | null>(null);
  const cooldownTimerRef = useRef<number | null>(null);

  const canProcess = useCallback((value: string) => {
    if (isLockedRef.current) return false;
    if (lastValueRef.current === value) return false;

    isLockedRef.current = true;
    lastValueRef.current = value;

    cooldownTimerRef.current = window.setTimeout(() => {
      isLockedRef.current = false;
    }, cooldownMs);

    return true;
  }, [cooldownMs]);

  const reset = useCallback(() => {
    isLockedRef.current = false;
    lastValueRef.current = null;

    if (cooldownTimerRef.current) {
      clearTimeout(cooldownTimerRef.current);
      cooldownTimerRef.current = null;
    }
  }, []);

  return {
    canProcess, // call this before verify
    reset,      // call on scan again / close
    isLocked: () => isLockedRef.current,
  };
}
