# /xray-scaffold

Fetch a test from Xray by its Jira key and scaffold:

1. A markdown summary file with steps and dataset at `tests/{TEST_KEY}-scaffold.md`
2. CSV dataset file(s) under `datasets/` (only if the test has a dataset)
3. A ready-to-fill `.spec.ts` skeleton at `tests/{spec-filename}.spec.ts`

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
ls tests/{TEST_KEY}-scaffold.md 2>/dev/null
ls datasets/{TEST_KEY}-*.csv 2>/dev/null
```

If `tests/{TEST_KEY}-scaffold.md` already exists:

- Skip Steps 2, 3, 5, and 6 entirely
- Read the existing scaffold `.md` to extract summary, components, labels, steps, and CSV filenames
- Go directly to Step 4 (pre-flight checks), then Step 8 (report + ask about spec)
- In the report, note: _"Using existing scaffold from a previous run."_

---

### Step 2 — Fetch test steps and Test Execution type

Run both in parallel:

**2a — Fetch test steps:** Use `mcp__xray__get_test_with_steps` with the test key.

Extract:

- `summary`, `description`, `status`, `assignee`, `components` (array), `labels` (array)
- Steps: `action`, `data`, `expectedResult` for each

**2b — Fetch Test Execution field from Jira:** Use `mcp__claude_ai_Atlassian__getJiraIssue` with `fields: ["customfield_10084"]`.

Extract `customfield_10084.value` — possible values: `Manual`, `Automation`, `Partial Automation`.
If the field is null or missing → show as `Unknown`.

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
- **No match** → warn the user: _"⚠️ Component `{value}` not found in `JiraComponent` enum — add it to `enums/jira/jira-components.ts` before generating the spec."_ Leave a `// TODO: add JiraComponent.{SUGGESTED_KEY} to enum` placeholder in the generated spec.

**Do NOT infer or emit any `TestTag.*` values** — tags are added manually by the developer after reviewing the spec.

Infer spec filename from the first component:
| Component | Suggested spec file |
|---|---|
| Rewards | `tests/instant-rewards.spec.ts` (or create new if different feature) |
| Wallet | `tests/vault-tests.spec.ts` |
| Chat | `tests/chat-users.spec.ts` |
| Admin panel | `tests/admin/` subdirectory |
| _(any)_ | `tests/{csv-slug}.spec.ts` |

When in doubt, default to `tests/{csv-slug}.spec.ts`.

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

Create at `tests/{TEST_KEY}-scaffold.md`:

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

| #   | Action                               | Data   | Expected Result  |
| --- | ------------------------------------ | ------ | ---------------- |
| 1   | {action, with ${params} highlighted} | {data} | {expectedResult} |

...

## Dataset Parameters

{If no dataset:}
No dataset — this test uses hardcoded or no data.

{If dataset:}
**{N} parameters, {R} rows** → see CSV(s) below.

| {param1}                   | {param2} | ... |
| -------------------------- | -------- | --- |
| {first 5 rows previewed}   |
| _(N total rows — see CSV)_ |

## Generated Files

- `tests/{TEST_KEY}-scaffold.md` ← this file
- `tests/{spec-filename}.spec.ts` ← spec skeleton
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

### Step 7 — Generate the `.spec.ts` skeleton

**File location:** inferred in Step 4c (default: `tests/{csv-slug}.spec.ts`)

**Imports block** — always include these, add others only if needed:

```typescript
import { testDetails } from "@core/helpers/test-details-helper";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraUser } from "@enums/jira/jira-users";
import { test } from "@fixtures/fixtures";
```

If dataset exists, also add:

```typescript
import { CsvFilesName } from "@enums/csv-file-name";
import { testData } from "test-data/test-data-manager";
```

> Note: `parse_csv` + `DATASETS_DIR` is legacy — always use `testData().fromCsvRaw()` or `testData().fromCsvParsed()` instead.
> - **`fromCsvRaw`** — raw rows, typed via `CsvDtoMap`. Use by default.
> - **`fromCsvParsed`** — rows run through a transformer from `CsvTransformerMap`. Use only when transformation logic exists or is needed.

Only add `import { TestTag } from "@enums/test-tags";` if the developer will fill in tags manually — do **not** emit it automatically.

**For tests WITH a dataset** — use `testData().fromCsvRaw()` + `forEach` pattern:

```typescript
// TODO: add {ENUM_KEY} to CsvFilesName enum and complete DTO setup (see scaffold.md)
test.describe(
    "{component area} — {short summary}",
    testDetails()
        .withTags(JiraComponent.{COMPONENT})
        .apply(),
    () => {
        testData()
            .fromCsvRaw({ file: CsvFilesName.{ENUM_KEY} })
            .forEach((record) => {
                test(
                    `[{TEST_KEY}] {summary} - ${record.{first_meaningful_param}}`,
                    testDetails()
                        // TODO: add .withTags(TestTag.X) manually
                        .withAuthor(JiraUser.{AUTHOR})
                        .apply(),
                    async ({ browserSessionManager }) => {
                        // Step 1: {action — with ${params} replaced by record.param}
                        // Expected: {expectedResult}

                        // Step 2: {action}
                        // Expected: {expectedResult}

                        // ... one comment block per step
                    },
                );
            });
    },
);
```

**For tests WITHOUT a dataset:**

```typescript
test.describe(
    "{component area} — {short summary}",
    testDetails()
        .withTags(JiraComponent.{COMPONENT})
        .apply(),
    () => {
        test(
            "[{TEST_KEY}] {summary}",
            testDetails()
                // TODO: add .withTags(TestTag.X) manually
                .withAuthor(JiraUser.{AUTHOR})
                .apply(),
            async ({ browserSessionManager }) => {
                // Step 1: {action}
                // Expected: {expectedResult}

                // Step 2: {action}
                // Expected: {expectedResult}

                // ... one comment block per step
            },
        );
    },
);
```

**Step comment rules:**

- Replace `${param}` placeholders with `${record.param}` (template literal) when dataset exists, or leave as `// TODO: ${param}` when no dataset
- Include `// Data: {data}` line only when the step has non-empty data
- When a step has attachments in Xray, add: `// 📎 See Xray: {TEST_KEY} — Step {N}`

---

### Step 8 — Report and ask before generating spec

1. Report to the user:
    - Path to the markdown file
    - Path(s) to CSV file(s), or note that no dataset was found
    - Resolved `JiraComponent` value(s) and author (so user can verify)
    - ⚠️ Warning if an existing spec was found
    - ⚠️ Warning if any component was not found in the `JiraComponent` enum
    - The `CsvFilesName` enum entry to add (copy-pasteable) if dataset exists

2. **Ask the user:** _"Generate the `.spec.ts` skeleton? (yes/no)"_

3. Only proceed to Step 7 (spec generation) if the user answers yes.
