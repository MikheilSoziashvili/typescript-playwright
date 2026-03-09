---
paths:
  - "api/**/*.ts"
  - "database/**/*.ts"
  - "services/**/*.ts"
---

# API Client & Database Patterns

## BaseApi

Foundation class in `api/base-api.ts` using Playwright's `APIRequestContext`:

```typescript
export class ExampleApi extends BaseApi {
    constructor(base_url: string = Configuration.environment_url) {
        super(base_url);
        this.setHeaders({ "X-Custom-Header": "value" });
    }

    public async getItem(id: string): Promise<ItemResponse> {
        const params = this.buildParameters(ApiEndpoints.GET_ITEM, { id });
        const response = await this.get(params);
        return (await response.json()) as ItemResponse;
    }

    public async createItem(payload: CreateItemRequest): Promise<APIResponse> {
        const params = this.buildParameters(ApiEndpoints.CREATE_ITEM, payload);
        return await this.post(params);
    }
}
```

Key methods:
- `setHeaders(headers)` — chainable header management
- `buildParameters(endpoint, data?, headers?)` — construct request params
- `addContextStorageState(storageState)` — add auth cookies/localStorage
- `get()`, `post()`, `put()`, `delete()`, `patch()` — HTTP verbs
- `dispose()` — cleanup request context

## GamdomApi

Main app API extends BaseApi. Combines API calls with DB operations:
```typescript
await this.gamdomDb.withClient(async () => {
    await this.gamdomDb.makeUserSuperAdmin(newUserId);
    await this.gamdomDb.updateUserEmailVerification(newUserId, true);
});
```

## Database Layer

`database/gamdom-db.ts` extends `BaseDB`. Queries run through `DbPoolServiceApi` (Express server managing pg Pool).

**BaseDB CRUD methods:**
- `query(table, columns, condition?, params?)` — SELECT
- `insert(table, data)` — INSERT returning all columns
- `update(table, data, condition)` — UPDATE
- `delete(table, condition)` — DELETE
- `executeQuery<T>(sql, params, logContext)` — raw SQL
- `withClient(fn)` — wrap operations in error-handling context

**Pool service architecture:**
- Express server spawned in `global-setup.ts` via `DbServiceManager.start()`
- Endpoints: `POST /query`, `GET /health`
- Tests communicate via `DbPoolServiceApi.postQuery<T>(sql, params)`

## Creating a new API client

1. Create file in `api/` extending `BaseApi`
2. Constructor: `super(baseUrl)` then `this.setHeaders({...})`
3. Methods: `this.buildParameters(endpoint, payload)` then `this.post(params)`
4. Type responses: `(await response.json()) as YourResponseType`
5. Register as fixture in `fixtures/api-fixtures.ts`
