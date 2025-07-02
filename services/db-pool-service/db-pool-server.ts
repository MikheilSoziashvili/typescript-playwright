import express, { Request, Response } from "express";
import { Pool } from "pg";
import { HealthResponse, QueryRequest } from "./interfaces";
import { logger } from "@logger/logger";

import { poolConfig, dbPoolServiceConfig } from "../../configuration";
import { DB_POOL_SERVICE_API_ENDPOINTS } from "./endpoints";
import { buildBaseUrl } from "./utils";
import { LogPoolStatusTag } from "./enums/log-pool-status-tags";
import { HealthStatus } from "./enums/health-statuses";

const DB_POOL_SERVICE_PORT = Number(dbPoolServiceConfig.port);

const app = express();
app.use(express.json());

const pool = new Pool(poolConfig);

/**
 * Handles incoming SQL query requests.
 * Executes the provided SQL with optional parameters using a PostgreSQL connection pool.
 *
 * @route POST /query
 * @param req - Request containing the SQL text and values in the body.
 * @param res - Response with query result or error message.
 */
app.post(
	DB_POOL_SERVICE_API_ENDPOINTS.query,
	async (
		req: Request<object, object, QueryRequest>,
		res: Response,
	): Promise<void> => {
		const { text, values } = req.body;

		try {
			const result = await pool.query(text, values);
			logPoolStatus(LogPoolStatusTag.QUERY);
			res.json({ rows: result.rows });
		} catch (err) {
			const error = err as Error;
			logger.error("[DB Pool Service] Query error:", error.message);
			res.status(500).json({ error: error.message });
		}
	},
);

/**
 * Performs a health check on the DB Pool Service.
 * Executes a simple SQL query to confirm database connectivity.
 *
 * @route GET /health
 * @param _req - Unused request object.
 * @param res - Response with the health status.
 */
app.get(
	DB_POOL_SERVICE_API_ENDPOINTS.health,
	async (_req: Request, res: Response<HealthResponse>): Promise<void> => {
		try {
			await pool.query("SELECT 1");
			res.status(200).json({
				status: HealthStatus.OK,
				dbConnection: true,
			});
		} catch (err) {
			logger.error("[DB Pool Service] Health check failed:", err);
			res.status(500).json({
				status: HealthStatus.ERROR,
				dbConnection: false,
			});
		}
	},
);

/**
 * Starts the DB Pool Service if the file is run directly.
 * Logs service startup info including host, port, and protocol.
 */
if (require.main === module) {
	app.listen(DB_POOL_SERVICE_PORT, () => {
		logger.info(
			`[DB Pool Service] Running at ${buildBaseUrl(dbPoolServiceConfig)}`,
		);
	});
}

/**
 * Logs the current status of the PostgreSQL connection pool on interval.
 */
setInterval(() => logPoolStatus(LogPoolStatusTag.INTERVAL), 10000);

/**
 * Logs pool metrics including total, idle, and waiting clients.
 *
 * @param tag - Optional tag to label the log entry. Defaults to "STATUS".
 */
function logPoolStatus(tag: LogPoolStatusTag = LogPoolStatusTag.STATUS) {
	logger.info(
		`[DB Pool Service][${tag}] total: ${pool.totalCount}, idle: ${pool.idleCount}, waiting: ${pool.waitingCount}`,
	);
}

//TODO: Log slow queries or query durations
//TODO: Protect service with bearer token
