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
| `fromCsvRaw()` | Raw CSV as DTOs | `testData()` | Direct CSV values, no transformation |
| `fromCsvParsed()` | CSV through parser | `testData()` | Need type-safe/normalized records |
| `fromPredefined()` | Static constants | `testDataPredefined` | Stable values (wallets, amounts) |
| `fromPredefinedRandom()` | One-time random per run | `testDataPredefinedRandom` | Unique-per-run identifiers |
| `fromRandom()` | New value each call | `testDataRandom` | Parametrized tests needing unique values per iteration |
| `fromDomain()` | Business datasets | `testData()` | Feature-specific scenario collections |
| `fromObject()` | Factory objects | `testDataObject` | Typed DTOs with build/default/preconfigured/random |

## CSV Data Pipeline

For parametrized tests where each CSV line = one test iteration.

**Adding new CSV data:**
1. Add CSV file to `datasets/` (naming: `ENG-{ticket}-description.csv`)
2. Add filename to `enums/csv-file-name.ts`
5. (For parsed) Create parser in `test-data/parsers/{name}/`, map in `test-data/mappings/csv-transformer-map.ts`
6. Export from `dtos/csv/index.ts`
4. Map DTO in `test-data/mappings/csv-dto-map.ts`
5. (For parsed) Create parser in `test-data/parsers/{name}/`, map in `test-data/mappings/csv-transformer-map.ts`

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
