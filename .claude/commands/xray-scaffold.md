# /xray-scaffold

Fetch a test from Xray by its Jira key and scaffold:

1. A folder `tests/{TEST_KEY}-scaffold/` containing the scaffold `.md` and any step attachments
2. CSV dataset file(s) under `datasets/` (only if the test has a dataset)

Use `/implement-test {TEST_KEY}` afterwards to implement the full test (POMs + flows + spec).

## Usage

```
/xray-scaffold ENG-2480
/xray-scaffold ENG-15981 rakeback-instant-rewards
```

The argument `$ARGUMENTS` contains the ticket key and optional CSV slug.

---

## Instructions

### Step 1 — Parse arguments

Extract from `$ARGUMENTS`:

- `TEST_KEY`: the Jira key (e.g. `ENG-2480`)
- `CSV_SLUG` (optional): any text after the key, lowercased and hyphenated. If not provided, derive it from the test summary (lowercase, spaces → hyphens, remove special chars, max ~40 chars).

**Check for existing scaffold (re-run mode):**

```bash
ls tests/{TEST_KEY}-scaffold/{TEST_KEY}-scaffold.md 2>/dev/null
ls datasets/{TEST_KEY}-*.csv 2>/dev/null
```

If `tests/{TEST_KEY}-scaffold/{TEST_KEY}-scaffold.md` already exists:

- Skip Steps 2, 3, 5, and 6 entirely
- Read the existing scaffold `.md` to extract summary, components, labels, steps, and CSV filenames
- Go directly to Step 4 (pre-flight checks), then Step 7 (report)
- In the report, note: _"Using existing scaffold from a previous run."_

---

### Step 2 — Fetch test steps and Test Execution type

Run both in parallel:

**2a — Fetch test steps:** Use `mcp__xray__get_test_with_steps` with the test key.

Extract:

- `summary`, `description`, `status`, `assignee`, `components` (array), `labels` (array)
- Steps: `action`, `data`, `expectedResult` for each
- **Step attachments**: for each step, extract any `attachments` array entries — capture `id` (UUID), `filename`, and `downloadLink`. Build a map: `stepAttachments = { stepIndex: [{ uuid, filename, downloadLink }] }`. Dimensions (width/height) come from inline attachment markup in the `result` field (e.g. `!xray-attachment://UUID|width=698,height=142!`) — parse them for reporting. Default extension from `filename` field; fall back to `png`.

**2b — Fetch Test Execution field and Component(s) from Jira:** Use `mcp__claude_ai_Atlassian__getJiraIssue` with `fields: ["customfield_10084", "components"]`.

Extract `customfield_10084.value` — possible values: `Manual`, `Automation`, `Partial Automation`.
If the field is null or missing → show as `Unknown`.

Extract `components` as an array of `{ name }` objects. Use this as the authoritative source for component names (prefer over any components returned by Xray in 2a). If empty → treat as no components.

---

### Step 3 — Fetch dataset via Xray GraphQL API

Use env vars directly (already exported in shell):

```bash
TOKEN=$(curl -s -X POST "https://xray.cloud.getxray.app/api/v2/authenticate" \
  -H "Content-Type: application/json" \
  -d "{\"client_id\":\"$XRAY_CLIENT_ID\",\"client_secret\":\"$XRAY_CLIENT_SECRET\"}" | tr -d '"')

curl -s -X POST "https://xray.cloud.getxray.app/api/v2/graphql" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"{ getTests(jql: \\\"issue = $TEST_KEY\\\", limit: 1) { results { issueId dataset { parameters { name } rows { Values } } } } }\"}"
```

If `dataset` is null or has no rows → **no CSV or dataset section needed**, skip Step 5.

**3b — Download step attachments** (run after 3a, or standalone if no dataset):

If `stepAttachments` is non-empty (any steps have attachments):

> ⚠️ **CRITICAL:** `mcp__xray__get_test_with_steps` constructs **wrong** attachment URLs:
> - Wrong (MCP-constructed): `https://xray.cloud.getxray.app/api/v2/attachment/{UUID}` → returns HTML 404
> - Correct (from raw GraphQL): `https://us.xray.cloud.getxray.app/api/v2/attachments/{UUID}` (`us.` prefix, plural `attachments`)
>
> Always use the `downloadLink` from the raw GraphQL query — never the "Link:" shown in the MCP tool result.
>
> The ordering of attachments in `attachments[]` may differ from their order in the `result` text (`!xray-attachment://...!` blocks). Use the `result` text order to assign step-N-M numbering.

```bash
mkdir -p tests/{TEST_KEY}-scaffold/

# Reuse $TOKEN from 3a if already set; otherwise re-authenticate:
TOKEN=$(curl -s -X POST "https://xray.cloud.getxray.app/api/v2/authenticate" \
  -H "Content-Type: application/json" \
  -d "{\"client_id\":\"$XRAY_CLIENT_ID\",\"client_secret\":\"$XRAY_CLIENT_SECRET\"}" | tr -d '"')

# Extract downloadLinks in result-text order via Python (handles multi-attachment steps):
LINKS=$(curl -s -X POST "https://xray.cloud.getxray.app/api/v2/graphql" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"{ getTests(jql: \\\"issue = $TEST_KEY\\\", limit: 1) { results { steps { attachments { id filename downloadLink } } } } }\"}" | python3 -c "
import sys, json
data = json.load(sys.stdin)
steps = data['data']['getTests']['results'][0]['steps']
for i, step in enumerate(steps, 1):
    for j, att in enumerate(step.get('attachments', []), 1):
        print(f'step-{i}-{j}|{att[\"downloadLink\"]}')
")

# Download each; -L follows the redirect to the signed S3 URL
while IFS='|' read -r name url; do
  curl -sL -H "Authorization: Bearer $TOKEN" "$url" \
    -o "tests/{TEST_KEY}-scaffold/${name}.png"
done <<< "$LINKS"

# Verify — every file should say "PNG image data", not "HTML document" or "JSON data"
file tests/{TEST_KEY}-scaffold/step-*.png
```

File naming convention: `step-{N}-{M}.png` where N = step number, M = attachment index within step (both 1-based).

If any file shows "HTML document" or "JSON data" after `file` check → download failed; do not silently continue — report the error and the failing URL to the user.

If `stepAttachments` is empty → skip 3b entirely (no `mkdir` needed yet; Step 6 will create the folder when writing the `.md`).

---

### Step 4 — Pre-flight checks and inferences

Run these in parallel:

**4a — Detect existing spec file:**

```bash
grep -rl "$TEST_KEY" tests/ --include="*.spec.ts" 2>/dev/null
```

If a match is found → warn the user: _"⚠️ Existing spec found at {path} — scaffold created anyway, merge manually."_

**4b — Get author from git config:**

```bash
git config user.email
```

Map email prefix to `JiraUser` enum:
| email prefix | JiraUser |
|---|---|
| svetoslav | `JiraUser.SVETOSLAV_LAZAROV` |
| angel | `JiraUser.ANGEL_PETROV` |
| ivaylo | `JiraUser.IVAYLO_STOYCHEV` |
| raluca | `JiraUser.RALUCA_ARITON` |
| nikolay | `JiraUser.NIKOLAY_GENOV` |

If no match → use `JiraUser.SVETOSLAV_LAZAROV` as default and note it.

Also map the Xray `assignee` field to `JiraUser` using the same table (first-name match). If assignee is unassigned → use the git-derived author.

**4c — Resolve JiraComponent and infer file path:**

For each component name returned from the Jira issue, check whether a matching entry already exists in `enums/jira/jira-components.ts` (case-insensitive / normalised comparison):

- **Match found** → use `JiraComponent.{MATCHING_KEY}` in the spec
- **No match** → add the missing entry directly to `enums/jira/jira-components.ts` (derive the key as `SCREAMING_SNAKE_CASE` of the component name), then use `JiraComponent.{NEW_KEY}` in the spec. Inform the user: _"Added `JiraComponent.{NEW_KEY} = \"{name}\"` to `enums/jira/jira-components.ts`."_

**Do NOT infer or emit any `TestTag.*` values** — tags are added manually by the developer after reviewing the spec.

**4d — Detect auth pattern and page coverage (run in parallel with 4a–4c):**

**Auth detection** — scan all step Actions for login/session language and resolve to `TestUserRole`:

| Step text pattern | Resolved session |
|---|---|
| "login as regular / standard / player user" | `loginAs(TestUserRole.REGULAR)` |
| "login as regular user with [X] balance/coins" | `loginAs(TestUserRole.REGULAR, { regularUserOptions: { amount: X } })` |
| "login as superadmin / super admin" | `loginAs(TestUserRole.SUPERADMIN, { reuseContext: true })` |
| "login as user info admin" | `loginAs(TestUserRole.ADMIN_USER_INFO_ADMIN, { reuseContext: true })` |
| "login as crypto admin" | `loginAs(TestUserRole.ADMIN_CRYPTOSUPADMIN, { reuseContext: true })` |
| "login as streamer" | `loginAs(TestUserRole.REGULAR, { regularUserOptions: { tags: [UserTags.Streamer] } })` |
| "User A" + "User B" in different steps | 2 sessions — dual `loginAs()` |
| Admin steps + user steps combined | 2 sessions — admin first with `reuseContext: true` |

Determine: **how many sessions**, **which roles**, **which is first**.

**Page coverage check** — for each UI surface mentioned in step Actions:

```bash
# Check each page name (iterate for each page mentioned in steps)
find /Users/svetoslavlazarov/e2e/pages -type d -iname "*{slug}*" 2>/dev/null
grep -r "{PageName}" /Users/svetoslavlazarov/e2e/pages/index.ts 2>/dev/null
```

Produce a coverage table:
- ✅ POM exists → note fixture key
- ❌ No POM → flag as "needs MCP inspection in /implement-test"

**Step translation draft** — for each step, produce a one-line framework call using the patterns from the `xray-step-vocabulary` rule. Mark unresolvable steps explicitly.

---

### Step 5 — Generate CSV file(s)

**Naming:** `datasets/{TEST_KEY}-{csv-slug}.csv`

**When to split:**

- If a column clearly groups rows (e.g. `static_page`, `page_type`, `scenario`) → one CSV per distinct value of that column, named `{TEST_KEY}-{slugified-group-value}.csv`
- Otherwise → single CSV with all rows

**Format rules:**

- Header: param names lowercased, spaces → underscores (`social account` → `social_account`)
- One row per iteration
- Quote values containing commas
- Trailing newline, no trailing spaces

---

### Step 6 — Generate the scaffold `.md` file

Create at `tests/{TEST_KEY}-scaffold/{TEST_KEY}-scaffold.md` (create the folder if it doesn't exist yet):

```markdown
# {TEST_KEY} — {Summary}

## Details

- **Status:** {status}
- **Test Execution:** {customfield_10084.value — e.g. Manual / Automation / Partial Automation}
- **Assignee:** {assignee}
- **Components:** {components}
- **Labels:** {labels}

## Description

{description or "No description provided."}

## Test Steps

| #   | Action                               | Data   | Expected Result  | Attachments |
| --- | ------------------------------------ | ------ | ---------------- | ----------- |
| 1   | {action, with ${params} highlighted} | {data} | {expectedResult} | {If step has attachments: `![Step N](./step-N-1.png)` for each; otherwise: —} |

...

> Steps with no attachments show `—` in the Attachments column. Steps with multiple attachments show multiple images inline.

## Dataset Parameters

{If no dataset:}
No dataset — this test uses hardcoded or no data.

{If dataset:}
**{N} parameters, {R} rows** → see CSV(s) below.

| {param1}                   | {param2} | ... |
| -------------------------- | -------- | --- |
| {first 5 rows previewed}   |
| _(N total rows — see CSV)_ |

## Framework Analysis

### Sessions Required
- **Count:** {N} session(s)
- **Session 1:** `loginAs(TestUserRole.{ROLE1}{, { reuseContext: true } if admin/API-only})`
  - Triggered by: Step {N} — "{login step action text}"
- {If 2nd session:}
- **Session 2:** `loginAs(TestUserRole.{ROLE2})`
  - Triggered by: Step {N} — "{login step action text}"
- **Flows required:** {Yes — dual session + {N} pages / No — single page direct spec}

### Page Coverage
| Step Mentions | POM Exists | Fixture Key | Action |
| --- | --- | --- | --- |
| {page name from step} | ✅ / ❌ | `{fixtureKey}` or — | Ready / Needs MCP inspection |

### Step Translations
| # | Xray Action | Framework Call |
| --- | --- | --- |
| 1 | {action text} | `{resolved framework call}` |
| {N} | {unresolvable action text} | `// NOTE: {reason} — manual implementation needed` |

### Unresolvable Steps
{If none: "None — all steps have framework equivalents."}
{If any:}
- Step {N}: "{action}" — {reason why unresolvable}

## Generated Files

- `tests/{TEST_KEY}-scaffold/{TEST_KEY}-scaffold.md` ← this file
- {For each downloaded attachment: `tests/{TEST_KEY}-scaffold/step-{N}-{M}.png` ← Step N UI screenshot ({width}×{height})}
  {CSV lines if applicable}

## TODO (CSV data pipeline)

{Only if dataset exists:}
To wire up the CSV data, complete these steps:

1. Add to `enums/csv-file-name.ts`: `{ENUM_KEY} = "{csv-filename}"`
2. Create DTO at `dtos/csv/{csv-slug}.dto.ts` with fields: {field list}
3. Map DTO in `test-data/mappings/csv-dto-map.ts`
4. (If parsed) Create parser in `test-data/parsers/{csv-slug}/`
```

---

### Step 7 — Report

Report to the user:
- Path to the markdown file (`tests/{TEST_KEY}-scaffold/{TEST_KEY}-scaffold.md`)
- Path(s) to CSV file(s), or note that no dataset was found
- Resolved `JiraComponent` value(s) and author (so user can verify)
- ⚠️ Warning if an existing spec was found at `{path}` — scaffold created anyway, merge manually when implementing
- ⚠️ Warning if any component was added to the `JiraComponent` enum
- The `CsvFilesName` enum entry to add (copy-pasteable) if dataset exists
- 📎 If attachments were downloaded: list each file with dimensions, e.g.:
  ```
  📎 Attachments downloaded:
    - tests/{TEST_KEY}-scaffold/step-2-1.png (698×142)
  ```
  If no attachments: omit this section.

Then print the **Next Steps** guidance:

```
Next steps for {TEST_KEY}:

1. Implement the full test (POMs + flows + spec):
   /implement-test {TEST_KEY}

2. Review before opening PR:
   /pr-review
```
