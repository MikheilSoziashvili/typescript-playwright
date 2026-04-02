# /implement-test

Read an existing scaffold `.md` file and implement the full test — POMs (with live playwright-cli inspection for missing ones), flows (if needed), and spec.

## Usage

```
/implement-test ENG-2480
/implement-test ENG-17407
```

The argument `$ARGUMENTS` is the Jira key.

---

## Instructions

### Step 0 — Pre-flight: read project rules

Before doing anything else, read these files so all subsequent decisions follow project conventions:

```bash
# Always read
CLAUDE.md
.claude/rules/pom-pattern.md
.claude/rules/test-structure.md
.claude/rules/mcp-selectors.md
.claude/rules/xray-step-vocabulary.md
.claude/rules/anti-patterns.md
.claude/skills/mcp-selector-authoring.md
.claude/skills/playwright-cli/SKILL.md
```

Do not skip this step. These files define selector methodology, POM structure, spec patterns, auth patterns, and what to avoid — all of which directly affect the generated code.

---

### Step 1 — Parse arguments and locate scaffold

Extract `TEST_KEY` from `$ARGUMENTS`.

Check that the scaffold exists. Look first in the folder, then fall back to the legacy flat file:

```bash
ls tests/{TEST_KEY}-scaffold/{TEST_KEY}-scaffold.md 2>/dev/null \
  || ls tests/{TEST_KEY}-scaffold.md 2>/dev/null
```

If neither exists → stop and tell the user:
_"No scaffold found for `{TEST_KEY}`. Run `/xray-scaffold {TEST_KEY}` first."_

Read the scaffold file (prefer folder path; use flat file if that's what exists). Extract:
- `Summary`
- `Components` → derive `JiraComponent.*` values
- `Test Execution` type
- `Assignee` → map to `JiraUser.*` (or derive from git: `git config user.email`)
- All test steps (Action, Data, Expected Result, **Attachments** per step)
- Dataset information (CSV files, if any)
- `Framework Analysis` section if present (Sessions Required, Page Coverage, Step Translations — use as starting point for Step 2c)

**Attachment awareness:** if a step has an `Attachments` cell pointing to `./step-{N}-{M}.png`, that image is available at `tests/{TEST_KEY}-scaffold/step-{N}-{M}.png`. During playwright-cli inspection (Step 3), reference these screenshots to understand which UI elements to target — they show the expected UI state at that step.

---

### Step 2 — Identify pages and check coverage

Read through all test steps. For each distinct UI surface mentioned (pages, admin panels, modals, components):

**2a — Search for existing coverage:**

```bash
# Check for existing POM directory
find /Users/svetoslavlazarov/e2e/pages -type d -iname "*{slug}*" 2>/dev/null

# Check for existing fixture registration
grep -r "{PageName}" /Users/svetoslavlazarov/e2e/pages/index.ts 2>/dev/null

# Check for existing test flows covering this scenario
find /Users/svetoslavlazarov/e2e/test-flows -name "*.ts" | xargs grep -l "{keyword}" 2>/dev/null
```

**2b — Classify each page as:**
- **Covered** — POM and/or flow exists that handles this step's interaction → note the fixture name, use it directly
- **Partially covered** — POM exists but is missing specific locators/methods needed for this test → note what's missing, extend in Step 3
- **Not covered** — No POM exists → proceed to Step 3 to create it via playwright-cli inspection

---

### Step 2c — Translate scaffold steps to framework calls

Before writing any code, parse every scaffold step and resolve it to a framework equivalent. If the scaffold already contains a "Framework Analysis → Step Translations" section (produced by a recent `/xray-scaffold` run), use it as the starting point and validate/extend it. Otherwise derive the translations from scratch.

Produce an internal **translation table** — one row per step — that Steps 5 and 6 will use to emit real code instead of `// TODO` comments.

**Use `.claude/rules/xray-step-vocabulary.md` as the authoritative reference** for translating auth steps → `loginAs()`, navigation steps → fixture calls, API/DB setup steps, and assertion patterns. That file is the single source of truth — do not invent translations not covered there.

**Multi-user detection — apply automatically:**
- If 2+ distinct login steps for different roles → dual session; count determines flows-vs-direct (Step 4)
- If "User A" / "User B" language → two named sessions
- See `xray-step-vocabulary.md` for the exact `loginAs` calls per role

**Unresolvable steps — flag explicitly:**
- Steps mentioning "wait for blockchain", "solve captcha", "try again from step N", "verify alignment" → emit `// NOTE: [reason] — manual implementation needed` and list them in the Step 7 report

---

### Step 3 — Create missing POMs via playwright-cli inspection

For each page classified as "Not covered" or "Partially covered" in Step 2:

**3a — Determine the page URL from the scaffold steps.** Look for URLs or page paths mentioned in the step Actions. Resolve the base URL from `configuration.ts`:
```bash
grep "^ENVIRONMENT_URL" .env 2>/dev/null | cut -d'=' -f2 | tr -d '"' \
  || grep -oE '"https://[^"]+"' configuration.ts | head -1 | tr -d '"'
```
Full URL: `{environment_url}{/path}`

If any scaffold step has an attachment screenshot (`tests/{TEST_KEY}-scaffold/step-{N}-{M}.png`), review it before navigating — it shows the expected UI state and helps identify which elements to target.

**3b — Ask the user which view to inspect** (if not obvious from context):
_"I'll inspect `{PageName}` via playwright-cli. Should I use the superadmin view or the regular user view?"_
Different roles see different elements — confirm before navigating.

**3c — Authenticate and navigate:** Follow `mcp-selector-authoring.md` Step 0 (Layer 1 for OAuth proxy bypass, Layer 2 if the page requires a logged-in Gamdom user).

**3d — Inspect the page:** Follow `mcp-selector-authoring.md` Steps 1–2 for the complete inspection procedure (snapshot → Container → Content → Role → selector priority).

**Only inspect the elements needed for THIS test's steps.** Do not exhaustively map every element on the page.

**3e — Generate POM files** using the `pom-scaffold` skill with the real selectors discovered:
- `pages/{dir}/{slug}-page-map.ts` — locators from inspection
- `pages/{dir}/{slug}-page.ts` — actions + navigation
- `pages/{dir}/{slug}-page-asserter.ts` — assertions for elements verified in the test
- `pages/{dir}/{slug}-page-steps.ts` — at minimum `navigateAndVerifyLoaded()` if navigable
- Register in `pages/index.ts` and the appropriate fixture file
- Add endpoint to `constants/page-endpoints.ts` if the page has a distinct URL

**For partially covered POMs:** add only the missing getters/methods to the existing files. Do not regenerate files that already exist.

---

### Step 4 — Decide: flows or direct spec?

| Condition | Decision |
|---|---|
| 3+ distinct pages/panels | Create test flows |
| Session switching (admin ↔ regular user) | Create test flows |
| Test body would exceed ~15 lines of orchestration | Create test flows |
| Single page, ≤ 2 steps, no session switch | Write spec directly (no flows) |

---

### Step 5 — Create test flows (if needed)

Create under `test-flows/{feature-slug}/`:

- `{feature}-setup-test-flow.ts` — user/session creation, initial navigation
- `{feature}-action-test-flow.ts` — core business interaction (maps to scaffold steps)
- `{feature}-verification-test-flow.ts` — outcome validation
- `{feature}-scenario-test-flow.ts` — composes the above; **this is the fixture**

Follow `.claude/rules/test-flows.md` for all flow conventions (base class, decorators, constructor rules, fixture registration). That file is authoritative.

**Step → flow method mapping:**
- Steps that create state (login, navigate, create entity) → setup flow
- Steps that perform core business logic → action flow
- Steps that verify outcomes → verification flow

---

### Step 6 — Write the spec

**File location:** First check for an existing spec that covers the same feature area:
```bash
ls tests/ | grep -i "{feature-keyword}"
```
If a matching spec exists (e.g. `casino-add-games-to-favorites.spec.ts` for a casino favorites test) → add the new test to it and follow its existing auth pattern exactly.

If no match → create a new file:
- Admin panel → `tests/admin/{feature-slug}.spec.ts`
- Otherwise → `tests/{feature-slug}.spec.ts` where slug describes the feature, NOT the ticket key

**Never name spec files with a ticket key prefix** (e.g. `eng-5305-*.spec.ts` is wrong — use `casino-favorite-liked-tag.spec.ts`).

Follow `.claude/rules/test-structure.md` for all spec conventions (imports, skeleton, `testDetails()` builder, naming, auth via `test.use()`). That file is authoritative.

**Auth choice — pick one, never both in the same test:**
- Simple single-user test → `test.use(storageStateNewUserDB())` at describe level; no `loginAs` in test body; use injected fixture pages directly
- Needs specific user options (balance, XP, tags) or multi-session → `browserSessionManager.loginAs(ROLE, { reuseContext: true })` inside the test body; see `xray-step-vocabulary.md` for the full rule

**If adding to an existing spec file → match its existing auth pattern exactly.**

**Step translation rules:**
- Use the translation table from Step 2c to emit **real code calls**, not `// TODO` comments
- Each step that has a resolved translation → emit the actual `loginAs()` / `page.navigate()` / `api.*()` / `asserter.*()` call
- Each step that is unresolvable → emit `// NOTE: [reason] — manual implementation needed`
- `${param}` placeholders in step text → `record.param` in generated code (CSV mode) or `// TODO: supply ${param}` (no CSV)
- `{{expectedValue}}` in expected results → literal string in assertion (e.g. `"1.00"`)
- Formulas in expected results (e.g. `bet * (multiplier - 1)`) → compute inline as a `const` and use in assertion
- If dataset exists: wrap in `testData().fromCsvRaw({ file: CsvFilesName.{ENUM_KEY} }).forEach(...)` pattern

---

### Step 7 — Report

Tell the user:

1. Files created/modified (paths), grouped by: POMs created, flows created, spec file
2. Locator strategy used for each new POM (any last-resort CSS class selectors that should be revisited once the frontend adds data-testid)
3. Any UI areas that could not be reliably mapped during playwright-cli inspection (flag for manual review)
4. The `CsvFilesName` enum entry to add (if dataset)
5. Run check: `npx tsc --noEmit --pretty` to confirm compilation
