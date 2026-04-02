# CI/CD & GitHub Actions Checks (W)

> Active when the diff contains `.github/workflows/**`.

---

### W. CI/CD & GITHUB ACTIONS

- [ ] Cron expressions use `1-5` (Mon-Fri) or explicit day ranges — not `*` for day-of-week unless justified with comment
- [ ] Cron schedule includes inline comment documenting timezone (UTC) and business reason
- [ ] No hardcoded secrets in YAML — use `${{ secrets.SECRET_NAME }}`
- [ ] New secrets declared in `workflow_call.secrets` for reusable workflows
- [ ] `workflow_call` trigger present on reusable workflows — `workflow_dispatch` alone insufficient
- [ ] `runs-on` uses project's self-hosted runner label — not `ubuntu-latest`
- [ ] `timeout-minutes` set on long-running jobs
- [ ] `continue-on-error: true` for non-fatal steps with follow-up surfacing
- [ ] Worker count (`--workers`) matches runner capacity
- [ ] S3 upload, Slack, JIRA/XRay steps have `if: always()` or `if: failure()` — otherwise skipped on failure
- [ ] Commit prefix: `[ENG-xxxxx]` for ticketed, `[NO-TICKET]` (hyphen) for untracked
