# Consent / GA4 release gate — 2026-11-25

## Scope and decisions
- Basic Consent Mode v2: GTM-5GDVGHFN is deferred until analytics opt-in; the default and update commands are queued before loading. No new GA4 configuration tag. The live GTM container is managed separately.
- Explicit, independent analytics and embedded partner-tool choices; old accepted/rejected local storage is not migrated as consent. New record expires after 180 days; withdrawal reloads the document and clears accessible GA cookies when analytics is denied.
- Five known third-party script/iframe components are gated. Direct affiliate links are unchanged; no conversion or commission attribution is fabricated.
- AdSense script is suspended globally pending an approved Google-certified CMP/TCF integration. Review commercial impact before merge. Do not enable ads on the basis of the custom banner alone.
- Drive bootstrap in the main branch is already commented out. Do not re-enable it (existing wrong-city Agoda redirect issue). Drive was observed live: verify deployed HTML, GTM and any externally injected script before release. If an external integration injects Drive, it must obey partner-tool consent separately; the custom Google consent signal cannot block it.
- Cookie/privacy notices are draft technical updates; validate provider URLs, actual storage lifetimes, controller, transfers, legal basis and wording with the owner before release. No assertion of full KVKK/GDPR compliance.

## Acceptance tests (fresh Chrome profile, then mobile)
1. Fresh visit: no GTM gtm.js, GA collect, AdSense loader, tpemd.com/tp.media widget requests, or optional cookies prior to selection; no noscript GTM iframe. Inspect Network and Application.
2. Reject all: same as fresh visit, including after navigation and reload. Content/direct affiliate links still available.
3. Analytics only: default denied then analytics_storage granted; all ad consent remains denied. One page_view on initial page and one per SPA navigation with correct URL/title. Verify GA4 DebugView and non-preview Realtime in property 518268596.
4. Partner tools only: known widgets load; no GTM/GA requests. Analytics only must not load gated widgets.
5. Both allowed: verify 3 affiliate links (Aviasales/Hotellook/Airalo) and clean link_url, partner/service_type/city/page_type, one affiliate_click per tested click; verify no duplicate Google configuration. Airalo access remains a separate issue. Test Drive injection, Klook/Agoda and iframe flows separately.
6. Change preferences / revoke: denied update, reload, no later optional requests for revoked category; accessible GA cookies removed. Test another tab and repeat visits.
7. Check Enhanced Measurement outbound click URLs for high-cardinality or personal data. Clean URL in the custom event alone does not sanitize standard click events.
8. Verify AdSense does not load; choose and configure certified CMP before restoring it. Check deployment SHA and www/non-www behavior, mobile banner, blocked storage and existing PWA cache.
9. GTM Preview cannot attach before analytics permission in Basic mode by design. Accept analytics first or inspect the queued consent commands in dataLayer. Check that the live container contains exactly one GA base tag.

References:
- https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic
- https://support.google.com/adsense/answer/13554116
