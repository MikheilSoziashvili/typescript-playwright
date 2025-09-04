import { BaseApi } from "./base-api";
import { dbPoolServiceConfig } from "../configuration";
import { DbPoolServiceConfiguration } from "@core/types/types";
import { HealthResponse } from "services/db-pool-service/interfaces";
import { DB_POOL_SERVICE_API_ENDPOINTS } from "services/db-pool-service/endpoints";
import {
	DbQueryRequest,
	DbQueryResult,
	SqlValue,
} from "services/db-pool-service/types";
import { QueryResultRow } from "pg";
import { buildBaseUrl } from "services/db-pool-service/utils";
import { BaseApiOptions } from "@core/api/interfaces/base-api-options";

export class DbPoolServiceApi extends BaseApi {
	private dbPoolServiceConfiguration: DbPoolServiceConfiguration;

	constructor({
		dbPoolServiceConfiguration = dbPoolServiceConfig,
		options,
	}: {
		dbPoolServiceConfiguration?: DbPoolServiceConfiguration;
		options?: BaseApiOptions;
	} = {}) {
		super(buildBaseUrl(dbPoolServiceConfiguration), options);
		this.dbPoolServiceConfiguration = dbPoolServiceConfiguration;
	}

	/**
	 * Gets a health check response.
	 *
	 * @returns {Promise<HealthResponse>} A promise resolving to the health status of the DB Pool Service.
	 */
	public async getHealth(): Promise<HealthResponse> {
		const response = await this.get({
			endpoint: DB_POOL_SERVICE_API_ENDPOINTS.health,
		});

		return (await response.json()) as HealthResponse;
	}

	/**
	 * Sends a SQL query to the DB Pool Service and returns the result.
	 *
	 * @typeParam T - The expected shape of each row in the result set. Defaults to `QueryResultRow`.
	 * @param sql - The SQL query string to execute.
	 * @param params - Optional array of SQL parameters to be passed with the query.
	 * @returns {Promise<DbQueryResult<T>>} A promise resolving to the result of the database query.
	 */
	public async postQuery<T extends QueryResultRow = QueryResultRow>(
		sql: string,
		params: SqlValue[] = [],
	): Promise<DbQueryResult<T>> {
		const payload: DbQueryRequest = { text: sql, values: params };
		const parameters = this.buildParameters(
			DB_POOL_SERVICE_API_ENDPOINTS.query,
			payload,
		);

		const response = await this.post(parameters);

		return (await response.json()) as DbQueryResult<T>;
	}
}
