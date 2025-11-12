import { DbPoolServiceApi } from "@api/db-pool-service-api";
import { logger } from "@logger/logger";
import { QueryResultRow } from "pg";
import { SqlValue } from "services/db-pool-service/types";

export class BaseDB {
	protected dbPoolServiceApi: DbPoolServiceApi;

	constructor() {
		this.dbPoolServiceApi = new DbPoolServiceApi();
	}

	public async withClient<T>(fn: () => Promise<T>): Promise<T> {
		try {
			return await fn();
		} catch (error) {
			logger.error(
				"Error during database pool service operation:",
				error,
			);
			throw error;
		}
	}

	protected async executeQuery<T extends QueryResultRow = QueryResultRow>(
		sql: string,
		params: unknown[] = [],
		logContext: string,
		hasLogMessage = true,
	): Promise<T[]> {
		try {
			if (hasLogMessage) {
				logger.info(
					`${logContext} - SQL: ${sql} | Params: ${JSON.stringify(
						params,
					)}`,
				);
			}
			const result = await this.dbPoolServiceApi.postQuery<T>(
				sql,
				params as SqlValue[],
			);
			return result.rows;
		} catch (error) {
			logger.error(`Error during ${logContext}: ${sql}`, error);
			throw new Error(
				`Database pool service error during ${logContext}: ${
					error instanceof Error ? error.message : String(error)
				}`,
			);
		}
	}

	async keepAlive(): Promise<void> {
		try {
			await this.executeQuery("SELECT 1", [], "Keep-alive check");
			logger.info("Database connection is alive");
		} catch (error) {
			logger.error("Error keeping the connection alive:", error);
		}
	}

	async query(
		table: string,
		columns: string[] | "*",
		condition?: string,
		params: unknown[] = [],
		hasLogMessage = true,
	): Promise<QueryResultRow[]> {
		const columnList = columns === "*" ? "*" : columns.join(", ");
		const whereClause = condition ? `WHERE ${condition}` : "";
		const sql = `SELECT ${columnList} FROM ${table} ${whereClause}`;

		return this.executeQuery(
			sql,
			params,
			"Database Query execution",
			hasLogMessage,
		);
	}

	async insert(
		table: string,
		data: Record<string, unknown>,
		hasLogMessage = true,
	): Promise<QueryResultRow> {
		const columns = Object.keys(data).join(", ");
		const values = Object.values(data);
		const placeholders = values
			.map((_, index) => `$${index + 1}`)
			.join(", ");

		const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
		const result = await this.executeQuery<QueryResultRow>(
			sql,
			values,
			"Database 'Insert' operation",
			hasLogMessage,
		);
		return result[0];
	}

	async update(
		table: string,
		data: Record<string, unknown>,
		condition: string,
		hasLogMessage = true,
	): Promise<QueryResultRow> {
		const columns = Object.keys(data);
		const values = Object.values(data);
		const setClause = columns
			.map((column, index) => `${column} = $${index + 1}`)
			.join(", ");
		const sql = `UPDATE ${table} SET ${setClause} WHERE ${condition} RETURNING *`;

		const result = await this.executeQuery<QueryResultRow>(
			sql,
			values,
			"Database 'Update' operation",
			hasLogMessage,
		);
		return result[0];
	}

	async delete(
		table: string,
		condition: string,
		hasLogMessage = true,
	): Promise<void> {
		const sql = `DELETE FROM ${table} WHERE ${condition}`;
		await this.executeQuery(
			sql,
			[],
			"Database 'Delete' operation",
			hasLogMessage,
		);
	}
}
