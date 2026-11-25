import { useSyncExternalStore } from 'react';

type ConsentState = { decided: boolean; analytics: boolean; affiliate: boolean };

declare global {
  interface Window {
    woonomadConsent?: {
      get: () => ConsentState;
      save: (analytics: boolean, affiliate: boolean) => void;
    };
  }
}

const fallback: ConsentState = { decided: false, analytics: false, affiliate: false };
const changeEvent = 'woonomad:consent-change';
export const openPreferencesEvent = 'woonomad:open-cookie-preferences';

function snapshot(): ConsentState {
  return typeof window === 'undefined' ? fallback : window.woonomadConsent?.get() ?? fallback;
}
function subscribe(listener: () => void) {
  window.addEventListener(changeEvent, listener);
  return () => window.removeEventListener(changeEvent, listener);
}
export function useConsent() {
  return useSyncExternalStore(subscribe, snapshot, () => fallback);
}
export function openCookiePreferences() {
  window.dispatchEvent(new Event(openPreferencesEvent));
}
export function saveConsent(analytics: boolean, affiliate: boolean): boolean {
  if (!window.woonomadConsent) return false;
  window.woonomadConsent.save(analytics, affiliate);
  return true;
}
