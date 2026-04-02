# Test Flows Checks (M)

> Active when the diff contains `test-flows/**`.

---

### M. TEST FLOWS

> Verify all rules from `.claude/rules/test-flows.md` (base class, splitting, fixture registration, decorators). Additional review-specific checks:

- [ ] Flows used only for multi-page business journeys and complex orchestration — not single-page actions
- [ ] Flows extend `BaseTestFlow` — use `this.log()` for logging, not `console.log()`
- [ ] Flows receive `BrowserSessionManager` in constructor — never raw `Page`, `Browser`, or `BrowserContext`
- [ ] No browser context creation inside flows — use `this.browserSessionManager.loginAs()`
- [ ] No duplication of Page Object logic — call `page.method()`, `page.steps().method()`, `page.assertThat().method()`
- [ ] Split follows responsibility: Setup -> Action -> Verification -> Scenario (composes others)
- [ ] Only **Scenario Flows** registered as fixtures and injected into tests
- [ ] `@testFlow()` on every public flow method
- [ ] Flow results returned as strongly typed DTOs — not raw API responses or `any`
- [ ] Flows do not contain `expect()` directly — assertions delegated to asserter files
- [ ] No over-splitting: split by responsibility, not by line count
