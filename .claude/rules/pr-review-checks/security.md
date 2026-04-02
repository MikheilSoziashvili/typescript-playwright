# Security Checks (P)

> Active on every PR (any file).

---

### P. SECURITY

- [ ] No credentials, passwords, tokens, or API keys hardcoded anywhere
- [ ] All secrets read from `process.env` via `configuration.ts`
- [ ] No sensitive user data (passwords, PII, tokens) in `logger.*` or step names
- [ ] No SQL injection risk — all DB queries parameterised
- [ ] Auth tokens not exposed in test names, step messages, or error messages
- [ ] `.env` files not committed — only `.env.example` if applicable
