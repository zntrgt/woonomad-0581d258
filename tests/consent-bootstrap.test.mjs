import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const source = html.match(/<script id="woonomad-consent-bootstrap">([\s\S]*?)<\/script>/)[1];
const KEY = 'woonomad-cookie-consent-v2';

function boot(initial = {}, storageFails = false) {
  const storage = new Map(Object.entries(initial));
  const scripts = [], cookies = [], listeners = {};
  let reloads = 0;
  const window = {
    location: { hostname: 'www.woonomad.co', reload() { reloads++; } },
    localStorage: {
      getItem(k) { if (storageFails) throw Error('blocked'); return storage.get(k) ?? null; },
      setItem(k, v) { if (storageFails) throw Error('blocked'); storage.set(k, v); }
    },
    dispatchEvent() {},
    addEventListener(type, handler) { listeners[type] = handler; },
  };
  const document = {
    get cookie() { return '_ga=abc; _ga_TEST=xyz; required=keep'; },
    set cookie(v) { cookies.push(v); },
    createElement() { return {}; },
    head: { appendChild(s) { scripts.push(s.src); } }
  };
  runInNewContext(source, { window, document, Event: class {} });
  const commands = () => window.dataLayer.filter(x => x[0] === 'consent').map(x => [x[1], x[2]]);
  return { window, scripts, cookies, storage, commands, listeners, reloads: () => reloads };
}

test('fresh and reject: no GTM, all optional consent denied', () => {
  const b = boot({ 'woonomad-cookie-consent': 'accepted' });
  assert.equal(b.scripts.length, 0);
  assert.equal(b.commands()[0][0], 'default');
  assert.equal(b.commands()[0][1].analytics_storage, 'denied');
  b.window.woonomadConsent.save(false, false);
  assert.equal(b.scripts.length, 0);
  assert.equal(b.commands().at(-1)[1].ad_user_data, 'denied');
  assert.equal(b.window.woonomadConsent.get().decided, true);
  assert.ok(b.cookies.some(x => x.startsWith('_ga=')));
  assert.ok(!b.cookies.some(x => x.startsWith('required=')));
});

test('analytics opt-in: update precedes one GTM load, ads remain denied', () => {
  const b = boot();
  b.window.woonomadConsent.save(true, false);
  b.window.woonomadConsent.save(true, false);
  assert.equal(b.scripts.length, 1);
  assert.match(b.scripts[0], /GTM-5GDVGHFN/);
  const layer = b.window.dataLayer;
  const firstUpdate = layer.findIndex(x => x[0] === 'consent' && x[1] === 'update');
  assert.ok(firstUpdate < layer.findIndex(x => x.event === 'gtm.js'));
  assert.equal(b.commands().at(-1)[1].analytics_storage, 'granted');
  assert.equal(b.commands().at(-1)[1].ad_personalization, 'denied');
  assert.equal(b.window['ga-disable-G-WWPLMMXE76'], false);
});

test('affiliate-only does not start Google tags', () => {
  const b = boot();
  b.window.woonomadConsent.save(false, true);
  assert.equal(b.window.woonomadConsent.get().affiliate, true);
  assert.equal(b.scripts.length, 0);
});

test('stored choice restored; expired choice denied', () => {
  const record = savedAt => JSON.stringify({ analytics: true, affiliate: false, savedAt });
  assert.equal(boot({ [KEY]: record(Date.now()) }).scripts.length, 1);
  assert.equal(boot({ [KEY]: record(Date.now() - 181*86400000) }).scripts.length, 0);
});

test('revocation disables GA and reloads; saved refusal survives reload', () => {
  const b = boot();
  b.window.woonomadConsent.save(true, true);
  b.window.woonomadConsent.save(false, true);
  assert.equal(b.reloads(), 1);
  assert.equal(b.window['ga-disable-G-WWPLMMXE76'], true);
  assert.equal(b.commands().at(-1)[1].analytics_storage, 'denied');
  assert.equal(boot(Object.fromEntries(b.storage)).scripts.length, 0);
});

test('cross-tab withdrawal reloads and disables GA', () => {
  const b = boot();
  b.window.woonomadConsent.save(true, true);
  b.storage.set(KEY, JSON.stringify({ analytics: false, affiliate: false, savedAt: Date.now() }));
  b.listeners.storage({ key: KEY });
  assert.equal(b.reloads(), 1);
  assert.equal(b.window['ga-disable-G-WWPLMMXE76'], true);
});

test('blocked storage fails closed on new document', () => {
  const b = boot({}, true);
  assert.equal(b.scripts.length, 0);
  assert.equal(b.window.woonomadConsent.get().decided, false);
});

test('no unconditional Adsense or GTM noscript iframe in source', () => {
  assert.doesNotMatch(html, /<script[^>]+src="https:\/\/pagead2\.googlesyndication\.com/);
  assert.doesNotMatch(html, /<iframe[^>]+googletagmanager\.com\/ns\.html/);
});
