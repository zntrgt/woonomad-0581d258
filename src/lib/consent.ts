import { useSyncExternalStore } from 'react';

type ConsentState = { decided: boolean; analytics: boolean; affiliate: boolean };
type TcfPing = { cmpLoaded?: boolean; gdprApplies?: boolean; cmpStatus?: string };

declare global {
  interface Window {
    woonomadConsent?: {
      get: () => ConsentState;
      setAffiliate: (allowed: boolean) => void;
    };
    __tcfapi?: (command: string, version: number, callback: (data: TcfPing, success?: boolean) => void) => void;
    __uspapi?: (command: string, version?: number, callback?: () => void) => void;
  }
}

const fallback: ConsentState = { decided: false, analytics: false, affiliate: false };
const changeEvent = 'woonomad:consent-change';

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
export function setAffiliateConsent(allowed: boolean) {
  window.woonomadConsent?.setAffiliate(allowed);
}
export function openCookiePreferences() {
  if (typeof window.__tcfapi !== 'function') return;
  window.__tcfapi('ping', 2, data => {
    if (data?.gdprApplies === false && typeof window.__uspapi === 'function') {
      window.__uspapi('displayUspUi', 1, () => {});
    } else {
      window.__tcfapi?.('displayConsentUi', 2, () => {});
    }
  });
}
