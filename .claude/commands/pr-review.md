You are a senior test automation engineer performing a thorough code review on this Playwright/TypeScript E2E project (Gamdom E2E). Your goal is to identify issues **before merge**, grouped by severity and category.

---

## ARGUMENTS

This command accepts an optional branch name:

```
/pr-review                     # reviews the currently checked-out branch
/pr-review my-feature-branch   # reviews the specified branch without checking it out
```

The argument is available as `$ARGUMENTS`. If `$ARGUMENTS` is non-empty, treat it as the target branch name and use it in place of `HEAD` throughout — e.g., `git diff master...$ARGUMENTS`. You do **not** need to check out that branch; all git commands work against the branch ref directly.

---

## STEP 0 — Safety check

**Determine the target branch:**
- If `$ARGUMENTS` is non-empty: target = `$ARGUMENTS`. Skip the `main`/`master` and detached HEAD checks below (those only apply to the working checkout).
- If `$ARGUMENTS` is empty: run `git branch --show-current` to get the current branch name and use that as target.

**If no argument was passed and the current branch is `main` or `master`:** stop and tell the user:

> "You are on the `main`/`master` branch. Either pass a branch name (`/pr-review my-branch`) or checkout your feature branch first, then re-run `/pr-review`."

**If no argument was passed and `git branch --show-current` returns empty** (detached HEAD): stop and tell the user:

> "You appear to be in a detached HEAD state. Pass the branch name explicitly (`/pr-review my-branch`) or checkout your feature branch first, then re-run `/pr-review`."

**Otherwise** — proceed to STEP 1 with the resolved target branch.

---

## STEP 1 — Gather context

First, sync the local `master` ref so the diff is accurate:

```bash
git fetch origin master
```

If `git fetch` fails (e.g., no network or no `origin` remote), print a warning and continue:

> "Could not fetch origin/master — diffing against the local master ref, which may be stale."

Then run:

```bash
git diff master...<target-branch>
git diff master...<target-branch> --name-only
```

**If `--name-only` returns no output** (empty diff), stop and tell the user:

> "The diff against `master` is empty — no changed files detected. Possible causes: the branch may already be merged, it has no commits ahead of `master`, or the branch name is wrong. Verify and re-run."

Always read `CLAUDE.md` — it applies to every review. Then read **only the rule files relevant to the changed paths**:

| Read this rule file | When the diff contains... |
|---|---|
| `.claude/rules/anti-patterns.md` | any changed file (always read) |
| `.claude/rules/base-asserter-methods.md` | `pages/**/*asserter*` |
| `.claude/rules/pom-pattern.md` | `pages/**`, `fixtures/*pages*`, `fixtures/*components*`, `fixtures/*modal*` |
| `.claude/rules/test-structure.md` | `tests/**` |
| `.claude/rules/test-flows.md` | `test-flows/**` |
| `.claude/rules/test-data.md` | `test-data/**`, `dtos/**` |
| `.claude/rules/fixtures.md` | `fixtures/**` |
| `.claude/rules/api-and-db.md` | `api/**`, `db/**`, `services/**` |

Then read every changed file in full.

---

## STEP 1.5 — Load active review checklists

Based on the changed file paths from `--name-only`, determine which review checklist bundles to load. **Read only the bundles whose trigger condition matches** — skip the rest entirely.

| Bundle file | Active when diff contains... |
|---|---|
| `.claude/rules/pr-review-checks/core-typescript.md` | any `.ts` file |
| `.claude/rules/pr-review-checks/pom-and-locators.md` | `pages/**`, `fixtures/*pages*`, `fixtures/*components*`, `fixtures/*modal*` |
| `.claude/rules/pr-review-checks/test-authoring.md` | `tests/**` |
| `.claude/rules/pr-review-checks/session-oop-patterns.md` | `pages/**`, `tests/**`, `fixtures/**`, `test-flows/**` |
| `.claude/rules/pr-review-checks/test-flows.md` | `test-flows/**` |
| `.claude/rules/pr-review-checks/data-and-api.md` | `api/**`, `db/**`, `services/**`, `test-data/**`, `dtos/**` |
| `.claude/rules/pr-review-checks/security.md` | any file (always read) |
| `.claude/rules/pr-review-checks/cicd.md` | `.github/workflows/**` |

Read each active bundle file now. These contain the section-by-section checklists (A through Y) for Step 2. At the top of the Step 2 output, list which bundles are **active** and which are **skipped**.

---

## STEP 2 — Review each file against ALL active checklist sections

Apply every checkbox from the loaded bundle files against the changed code. If a bundle references a rule file (e.g., "Verify all rules from `.claude/rules/pom-pattern.md`"), you already read that file in Step 1 — apply those rules too.

---

## STEP 3 — Write the report file

Assign a sequential number to every issue found, starting from **#1**. Numbers never reset between severity groups.

Write the full report to **`pr-review-report.md` in the project root** using the Write tool. The file must contain:

1. A header with branch name, date, and PR title (from git log)
2. The severity legend table
3. Every issue ordered: BLOCKING first, then IMPORTANT, then SUGGESTION
4. The decision table
5. The "How to apply fixes" instruction

### Severity levels

| Level | Label | Meaning |
|---|---|---|
| BLOCKING | Must fix before merge. Test failure, flakiness, security, broken reporting, or architecture corruption. |
| IMPORTANT | Should fix before merge. Maintenance burden, inconsistency, or likely future bug. |
| SUGGESTION | Nice to have. Readability, naming, convention alignment. Safe to defer. |

### Issue format

```
---

**#N** · BLOCKING / IMPORTANT / SUGGESTION

**File:** `path/to/file.ts:line`
**Rule section:** A / B / C / ... / Y
**Violation:** Short name of the broken rule
**Why this severity:** One sentence — concrete consequence if left unfixed.
**Current code:**
\`\`\`typescript
// exact snippet
\`\`\`
**Fix:**
\`\`\`typescript
// corrected version
\`\`\`
```

### Decision table

| # | Severity | File | Violation |
|---|---|---|---|
| 1 | BLOCKING | `path:42` | Description |

### "How to apply fixes" section

> Reply with the issue numbers to fix (e.g., **"fix #1, #3, #5"**) and only those changes will be applied — nothing else will be touched.

---

## STEP 4 — Output to chat (concise)

After writing the file, output **only** the following to the chat:

---

**Report written to [`pr-review-report.md`](pr-review-report.md)**

### Summary
- **Total:** X blocking · Y important · Z suggestions
- **Hotspot:** File or section with the most issues
- **Verdict:** Ready to merge / Fix important issues first / Blocking issues must be resolved

### How to apply fixes
Open [`pr-review-report.md`](pr-review-report.md) to see all issues with code snippets and fixes. Reply with the numbers you want applied — e.g., **"fix #1, #3, #5"** — and only those changes will be made.

> `pr-review-report.md` is gitignored and will not be committed accidentally.
