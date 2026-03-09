---
paths:
  - "test-flows/**/*.ts"
  - "fixtures/test-flows-fixtures.ts"
---

# Test Flow Layer

Sits above Page Objects, below test specs. Encapsulates complete business scenarios by orchestrating pages, steps, assertions, APIs, and session management.

## When to use flows

USE for: complete user journeys, business scenarios (deposit, withdrawal, betting), multi-page interactions, repeated orchestration logic.

DO NOT use for: single UI actions, low-level helpers, simple page steps, pure assertions.

## Flow splitting — by responsibility, not size

- **Setup Flow** — user/session preparation
- **Action Flow** — main user interaction
- **Verification Flow** — result validation
- **Scenario Flow** — composes the above (ONLY this is exposed to tests)

```
test-flows/originals/plinko/
├── plinko-user-setup.flow.ts          ← setup
├── plinko-bet-execution.flow.ts       ← action
├── plinko-user-setup-test-flow.ts          ← setup
├── plinko-bet-execution-test-flow.ts       ← action
├── plinko-balance-verification-test-flow.ts ← verification
└── plinko-bet-scenario-test-flow.ts        ← scenario (test fixture)
└── plinko-bet-scenario.flow.ts        ← scenario (test fixture)
```

## BaseTestFlow

All flows must extend `BaseTestFlow`:

```typescript
import { BaseTestFlow } from "test-flows/base/base-test-flow";
import { testFlow } from "@decorators/test-flow";

export class ExampleSetupFlow extends BaseTestFlow {
    constructor(
        private readonly browserSessionManager: BrowserSessionManager,
    ) {
        super();
    }

    @testFlow()
    async prepareUser(): Promise<void> {
        const user = await this.browserSessionManager.loginAs(TestUserRole.REGULAR);
        await user.pages.homePage.navigate();
        this.log("User prepared successfully");
    }
}
```

## Scenario Flow (composes sub-flows)

```typescript
export class ExampleScenarioFlow extends BaseTestFlow {
    constructor(
        private readonly setupFlow: ExampleSetupFlow,
        private readonly actionFlow: ExampleActionFlow,
        private readonly verificationFlow: ExampleVerificationFlow,
    ) {
        super();
    }

    @testFlow("Execute example scenario")
    async executeScenario(params: ExampleParams): Promise<void> {
        await this.setupFlow.prepare(params);
        await this.actionFlow.perform(params);
        await this.verificationFlow.verify(params);
    }
}
```

## Fixture registration

```typescript
export const testFlowsFixtures = base.extend<
    TestFlowsFixtures & { browserSessionManager: BrowserSessionManager }
>({
    exampleScenarioFlow: async ({ browserSessionManager }, use) => {
        await use(
            new ExampleScenarioFlow(
                new ExampleSetupFlow(browserSessionManager),
                new ExampleActionFlow(),
                new ExampleVerificationFlow(),
            ),
        );
    },
});
```

## Usage in tests

```typescript
test(
    "[ENG-1234] Place bet and verify balance",
    testDetails().withAuthor(JiraUser.NAME).apply(),
    async ({ exampleScenarioFlow }) => {
        await exampleScenarioFlow.executeScenario({ wallet: "USD", amount: 100 });
    },
);
```

## Rules

- Flows use `BrowserSessionManager` — never raw `page` or `browser`
- Never inject `page` directly into flows
- Do not duplicate Page Object logic inside flows
- Do not over-split into tiny methods
- No circular dependencies between flows
- Only Scenario Flows are registered as test fixtures
- All public methods must have `@testFlow()` decorator
- Export new flows from `test-flows/index.ts`
