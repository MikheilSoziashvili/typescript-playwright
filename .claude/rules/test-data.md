---
paths:
  - "test-data/**/*.ts"
  - "datasets/**/*.csv"
  - "dtos/csv/**/*.ts"
  - "tests/**/*.spec.ts"
---

# Test Data Management Layer

Centralized layer in `test-data/`. Six data source types accessed via `testData()` singleton or fixtures.

## Quick Reference

| Method | Purpose | Fixture | When to use |
|--------|---------|---------|-------------|
| `fromCsvRaw()` | Raw CSV as DTOs, no transformation | `testData()` | Data-driven tests using direct CSV values |
| `fromCsvParsed()` | CSV through parser for normalized/typed records | `testData()` | Tests needing type-safe records derived from CSV |
| `fromPredefined()` | Static constants, stable across runs | `testDataPredefined` | Default values: wallet types, deposit amounts, baselines |
| `fromPredefinedRandom()` | One-time random per run, stable within run | `testDataPredefinedRandom` | Unique-per-run identifiers: promo codes, usernames |
| `fromRandom()` | New value on each call, hybrid static+random | `testDataRandom` | Parametrized tests needing fresh random values per iteration |
| `fromDomain()` | Business datasets by feature area | `testData()` | Scenario-based data for feature-specific test logic |
| `fromObject()` | Factory objects with build/default/preconfigured/random | `testDataObject` | Typed DTOs: bets, users, transactions |

## CSV Data Pipeline

For parametrized tests where each CSV line = one test iteration.

**Adding new CSV data:**
1. Add CSV file to `datasets/` (naming: `ENG-{ticket}-description.csv`)
2. Add filename to `enums/csv-file-name.ts`
3. Create DTO at `dtos/csv/{slug}.dto.ts`
4. Export from `dtos/csv/index.ts`
5. Map DTO in `test-data/mappings/csv-dto-map.ts`
6. (For parsed) Create parser in `test-data/parsers/{name}/`, map in `test-data/mappings/csv-transformer-map.ts`

**Usage:**
```typescript
// Raw
testData().fromCsvRaw({ file: CsvFilesName.LOGIN_NOT_POSSIBLE })
    .forEach((record) => { test(`[ENG-X] ${record.scenario}`, ...); });

// Parsed
const scenarios = testData().fromCsvParsed({ file: CsvFilesName.ORIGINALS_QUICK_SELECT_BUTTONS });
```

## Predefined Data

Static constants in `test-data/sources/predefined/index.ts`. Auto-available:
```typescript
// Add to predefined/index.ts
export const predefined = {
    wallets: { walletType: Wallet.USD },
    dice: { betAmount: 1, multiplier: 1.5 },
};

// Use
testData().fromPredefined().data.dice.betAmount;
// Or fixture: testDataPredefined.data.dice.betAmount
```

## Predefined Random Data

Generated once per test run in `test-data/sources/predefined-random/index.ts`:
```typescript
export const predefinedRandom = {
    notifications: { longTitle: generateRandomString({ length: 30 }) },
};
// Same value every call within a run
testData().fromPredefinedRandom().data.notifications.longTitle;
```

**Rule:** Never declare inline test data (random strings, static strings, arrays) inside a test body. All values that belong to a test's dataset — including static strings grouped with a random value — must live in `predefinedRandom` and be consumed via the `testDataPredefinedRandom` fixture:
```typescript
// ❌ Wrong — random string inline in test
const message = generateRandomString({ prefix: "chat_ml_" });

// ❌ Wrong — mixing predefined random with inline static strings
const messageLines = [
    testDataPredefinedRandom.data.chatMessages.multiLineFirstLine as string,
    "multiline",
    "test",
];

// ✅ Correct — entire dataset in predefined-random/index.ts (static strings included)
chatMessages: {
    multiLineMessages: [
        generateRandomString({ prefix: "chat_ml_" }),
        "multiline",
        "test",
    ],
}

// ✅ Correct — in test body (note: .data is any, cast the value)
const messageLines = testDataPredefinedRandom.data.chatMessages.multiLineMessages as string[];
```

## Random Data

New value on each call via `RandomDataSourceGenerator` in `test-data/sources/random/index.ts`:
```typescript
public get promoCodes(): PromoCodesGenerators {
    return {
        name: () => `${this.predefinedRandom.promoCodes.campaignName}${generateRandomString({ length: 3 })}`,
    };
}
// Different value each call
testData().fromRandom().data.promoCodes.name();
```

**Adding new random data:**
1. Add generator section in `test-data/sources/random/index.ts`
2. Add interface in `test-data/interfaces/random`

## Domain Data

Business-contextual datasets in `test-data/domains/`:
```typescript
// test-data/domains/free-spins-domain-data.ts
export class FreeSpinsDomainData {
    public readonly validScenarios = [...];
    public readonly batchScenarios = [...];
}

// Register in test-data/domains/index.ts
export const domainRegistry = { freeSpins: FreeSpinsDomainData };

// Use
testData().fromDomain().freeSpins.validScenarios;
```

## Object Factories

Typed objects with `build()`, `default()`, `preconfigured()`, `random()` in `test-data/objects/factories/`:

```typescript
export class BetTestDataObjectFactory extends BaseTestDataObjectFactory<
    BetTestData, BetTestDataObjectFactory, { username: string }
> {
    public static override default({ username }: { username: string }): BetTestData {
        return new BetTestData(username, 1, 1);
    }
    public static override build(args: { username: string }, overrides?: Partial<BetTestData>): BetTestData {
        const base = this.default(args);
        return new BetTestData(overrides?.username ?? base.username, overrides?.betAmount ?? base.betAmount, ...);
    }
    public static override preconfigured({ username }: { username: string }) {
        return {
            normalBetMinMultiplier: new BetTestData(username, 10, 1.1),
            normalBetMediumMultiplier: new BetTestData(username, 10, 1.5),
        };
    }
    public static override random({ username }: { username: string }): BetTestData {
        return new BetTestData(username, getRandomNumber(1), getRandomNumber(1));
    }
}

// Register in test-data/objects/index.ts
export const objectFactoryRegistry = { bet: BetTestDataObjectFactory };

// Usage via testDataObject fixture
testDataObject.bet.build({ username }, { betAmount: 100 });
testDataObject.bet.default({ username });
testDataObject.bet.preconfigured({ username }).normalBetMediumMultiplier;
```
