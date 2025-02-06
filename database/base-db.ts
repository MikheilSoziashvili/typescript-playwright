import { logger } from "@logger/logger";
import { Pool, QueryResultRow } from "pg";

export class BaseDB {
	protected pool: Pool;

	constructor() {
		this.pool = new Pool();
	}

	private async executeQuery<T extends QueryResultRow = QueryResultRow>(
		sql: string,
		params: unknown[] = [],
		logContext: string,
	): Promise<T[]> {
		const client = await this.pool.connect();
		try {
			logger.info(
				`${logContext} - SQL: ${sql} | Params: ${JSON.stringify(
					params,
				)}`,
			);
			const result = await client.query<T>(sql, params);
			return result.rows;
		} catch (error) {
			logger.error(`Error during ${logContext}: ${sql}`, error);
			throw new Error(`Database error during ${logContext}`);
		} finally {
			client.release();
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
	): Promise<QueryResultRow[]> {
		const columnList = columns === "*" ? "*" : columns.join(", ");
		const whereClause = condition ? `WHERE ${condition}` : "";
		const sql = `SELECT ${columnList} FROM ${table} ${whereClause}`;

		return this.executeQuery(sql, params, "Database Query execution");
	}

	async insert(
		table: string,
		data: Record<string, unknown>,
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
		);
		return result[0];
	}

	async update(
		table: string,
		data: Record<string, unknown>,
		condition: string,
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
		);
		return result[0];
	}

	async delete(table: string, condition: string): Promise<void> {
		const sql = `DELETE FROM ${table} WHERE ${condition}`;
		await this.executeQuery(sql, [], "Database 'Delete' operation");
	}

	async closePool(): Promise<void> {
		await this.pool.end();
		logger.info("Database connection pool closed");
	}
}
