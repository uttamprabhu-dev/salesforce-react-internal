# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A Salesforce DX project for "Vantage Estates," an internal (non-Experience Cloud) Salesforce app built as a UI Bundle (`force-app/main/default/uiBundles/VantageEstates`) — a React/Vite/TypeScript app — plus a small amount of supporting Apex. The app has four pages: a static marketing Home page, a Contact form that emails an internal list via a custom Apex REST endpoint, an Account list (search + paginated table), and an Account detail page. Account data is read over the platform GraphQL (uiapi) bridge; the Contact form is the one path that goes through Apex REST instead (see "Data flow" below).

There are two independent npm projects:
- **Repo root** (`package.json`) — SFDX tooling, org setup/deploy scripts, root-level lint/prettier for any Apex/LWC/Aura files.
- **UI Bundle** (`force-app/main/default/uiBundles/VantageEstates/package.json`) — the actual React app (Vite, TS, Vitest, Playwright). Almost all day-to-day frontend work happens here, in its own `node_modules`.

## Commands

Run from repo root unless noted.

```bash
npm install                      # root deps (SFDX scripts)
npm run sf-project-setup         # installs UI Bundle deps, builds, starts dev server at :5173
npm run setup -- --target-org <alias> [--yes]   # full deploy pipeline: login check, build, deploy, graphql schema fetch, codegen
npm run dev:preview              # start dev server only (post-setup)
npm run lint                     # root eslint over any aura/lwc js (not the React app)
npm run prettier / prettier:verify
```

Inside the UI Bundle (`cd force-app/main/default/uiBundles/VantageEstates`):

```bash
npm install
npm run dev                      # Vite dev server (:5173)
npm run build                    # tsc -b && vite build -> dist/
npm run lint                     # eslint . (TS/React rules incl. graphql-eslint)
npm test                         # vitest (watch mode by default)
npm run graphql:schema           # fetch schema.graphql from the org (needs auth'd default org)
npm run graphql:codegen          # regenerate src/api/graphql-operations-types.ts from *.graphql docs
```

Single test file / single test: `npx vitest run path/to/file.test.tsx` or `npx vitest run -t "test name"`.

E2E (Playwright, `e2e/app.spec.ts`, config in `playwright.config.ts`): build with `npm run build:e2e` first (rewrites asset paths for the served bundle), then run Playwright normally.

Deploy the UI Bundle to an org:
```bash
cd force-app/main/default/uiBundles/VantageEstates && npm install && npm run build && cd -
sf project deploy start --source-dir force-app/main/default/uiBundles --target-org <alias>
```

The GraphQL schema (`schema.graphql`, referenced by `.graphqlrc.yml`/`codegen.yml` as `../../../../../schema.graphql`, i.e. repo root) must be fetched from a real org before codegen will work — it is not checked in populated by default.

## Architecture

### Data flow: GraphQL for Account data, Apex REST for the Contact form
Account reads go through `src/api/graphqlClient.ts` (`executeGraphQL`), a thin wrapper around `@salesforce/platform-sdk`'s `createDataSDK().graphql`. It auto-routes `mutation` operations to `.mutate` and everything else to `.query` by sniffing the operation string, and normalizes SDK errors into thrown `Error`s. `*.graphql` documents live co-located with the page that uses them (`src/pages/getAccountList.graphql`, `src/pages/getAccountDetail.graphql`) and are imported with Vite's `?raw` suffix — there is no codegen step wired up for them (schema.graphql isn't fetched by default; see below), so query response types are hand-written in `src/types/account.ts`.

The Contact form is the one path GraphQL can't express — it POSTs to a custom Apex REST endpoint (`ContactUsController`, `/services/apexrest/contactus`) via `src/api/contactApi.ts`, which uses `sdk.fetch` (the data SDK's REST escape hatch) rather than `sdk.graphql`. That Apex class reads the `Contact_Us_Recipient_Emails` custom label (semicolon-separated addresses) and emails the submitted Name/Email/Message to that list — no Salesforce record is created from a submission.

### Routing and shell
`src/app.tsx` mounts a `createBrowserRouter` from `src/routes.tsx`, with `basename` derived from `SFDC_ENV.basePath` (must strip trailing slash to match the Lightning-hosted URL, e.g. `/lwr/application/ai/c-app`). `src/appLayout.tsx` is the top-level layout (nav + outlet + the sonner `<Toaster/>`); routes carry a `handle: { showInNavigation, label }` that `router-utils.tsx`'s `getAllRoutes()` reads to build the nav — adding a page to the menu means adding that `handle` to its route, not editing the nav component. Current routes: `/` (Home), `/contact` (Contact), `/accounts` (Account list), `/accounts/:recordId` (Account detail), `*` (NotFound).

### Account list pagination
`src/pages/AccountList.tsx` uses forward-only Relay cursor pagination (`first`/`after`) against the `uiapi` Account connection, plus a client-side stack of `after` cursors for the "Previous" button (push the current `endCursor` on Next, pop on Previous) — deliberately not `last`/`before`, since bidirectional cursor support wasn't verified against this org's schema. The search box (Name-only, debounced 300ms via `useDebouncedValue`) resets the cursor stack to the first page on every new term; an empty term passes `where: null` rather than omitting the variable.

### UI primitives
`src/components/ui/` is a shadcn/Radix ("new-york" style, neutral base color, per `components.json`) component set — only what the four pages need: button, input, textarea, label, card, table, badge, skeleton, alert, pagination, sonner — plus `src/lib/utils.ts` (re-exports `cn` from the `cn` npm package, per current shadcn CLI convention). Regenerate/add more via `npx shadcn add <name>` from the UI Bundle root; it reads `components.json`, whose `tailwind.css` path must stay `src/styles/global.css` (matching where `app.tsx` actually imports it from) or the CLI can't locate the theme file.

### Config-driven org setup
`scripts/org-setup.config.json` (validated by `scripts/validate-org-setup-config.mjs` against a zod schema in `scripts/org-setup-config-schema.mjs`) drives permission-set assignment during `npm run setup`; it auto-discovers permission sets under `force-app/main/default/permissionsets/*.permissionset-meta.xml`, so a new/edited permission set needs no script changes to get assigned.

### Backend metadata
`force-app/main/default/classes/ContactUsController.cls` (+ `ContactUsControllerTest.cls`) and `force-app/main/default/labels/CustomLabels.labels-meta.xml` are the only Apex/label metadata in the org. `VantageEstates_Access.permissionset-meta.xml` grants `ApiEnabled`, Apex class access to `ContactUsController`, and read access to the Account fields the two pages query — extend it (or add a new permission set) rather than assuming a running user already has access. The Custom Label's value is a placeholder (`admin@vantageestates.example.com`) — edit it in Setup → Custom Labels with the real recipient address(es) before relying on the Contact form in a real org, and confirm Setup → Email Administration → Deliverability is "All Email" or `Messaging.sendEmail` will fail.
