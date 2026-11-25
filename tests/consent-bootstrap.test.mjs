import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const source = html.match(/<script id="woonomad-consent-bootstrap">([\s\S]*?)<\/script>/)[1];

function boot() {
  const scripts = [], cookies = [], timers = [];
  let reloads = 0;
  const window = {
    location: { hostname: 'www.woonomad.co', reload() { reloads++; } },
    dispatchEvent() {},
    setTimeout(cb) { timers.push(cb); return timers.length; },
    clearTimeout() {}
  };
  const document = {
    get cookie() { return '_ga=abc; required=keep'; },
    set cookie(v) { cookies.push(v); },
    createElement() { return {}; },
    head: { appendChild(s) { scripts.push(s.src); } }
  };
  runInNewContext(source, { window, document, Event: class {} });
  const update = v => window.gtag('consent','update',{analytics_storage:v});
  return { window, scripts, cookies, timers, update, reloads:()=>reloads };
}
test('default denied, CMP not ready: no Google tag', () => {
  const b=boot();
  assert.equal(b.scripts.length,0);
  assert.equal(b.window.dataLayer[0][2].analytics_storage,'denied');
  assert.equal(b.window.dataLayer[0][2].ad_user_data,'denied');
  assert.equal(b.window['ga-disable-G-WWPLMMXE76'],true);
});
test('CMP explicit deny does not load GTM; accessible GA cookies cleared', () => {
  const b=boot(); b.update('denied');
  assert.equal(b.scripts.length,0);
  assert.ok(b.cookies.some(x=>x.startsWith('_ga=')));
  assert.ok(!b.cookies.some(x=>x.startsWith('required=')));
});
test('explicit analytics grant loads GTM once after the update', () => {
  const b=boot(); b.update('granted'); b.update('granted');
  assert.equal(b.scripts.length,1);
  assert.match(b.scripts[0],/GTM-5GDVGHFN/);
  const layer=b.window.dataLayer;
  assert.equal(layer[1][1],'update');
  assert.equal(layer[2].event,'gtm.js');
  assert.equal(b.window['ga-disable-G-WWPLMMXE76'],false);
});
test('ad-only and malformed updates cannot grant analytics', () => {
  const b=boot(); b.window.gtag('consent','update',{ad_storage:'granted'});
  b.update('true'); b.window.gtag('consent','default',{analytics_storage:'granted'});
  assert.equal(b.scripts.length,0);
});
test('revocation disables GA and schedules reload', () => {
  const b=boot(); b.update('granted'); b.update('denied');
  assert.equal(b.window['ga-disable-G-WWPLMMXE76'],true);
  assert.equal(b.timers.length,1);
  b.timers[0](); assert.equal(b.reloads(),1);
});
test('affiliate grant independent of Google, reset on new document', () => {
  const b=boot(); b.window.woonomadConsent.setAffiliate(true);
  assert.equal(b.window.woonomadConsent.get().affiliate,true);
  assert.equal(b.scripts.length,0);
  assert.equal(boot().window.woonomadConsent.get().affiliate,false);
  b.window.woonomadConsent.setAffiliate(false);
  assert.equal(b.timers.length,1);
});
test('CMP tag order and no unconditional AdSense or GTM iframe', () => {
  assert.ok(html.indexOf('id="woonomad-consent-bootstrap"')<html.indexOf('https://cmp.inmobi.com'));
  assert.match(html,/B9t5q1Hffjt6F/);
  assert.match(html,/__tcfapiLocator/);
  assert.match(html,/__gppLocator/);
  assert.match(html,/__uspapi/);
  assert.doesNotMatch(html,/<script[^>]+src="https:\/\/pagead2\.googlesyndication\.com/);
  assert.doesNotMatch(html,/<iframe[^>]+googletagmanager\.com\/ns\.html/);
});
