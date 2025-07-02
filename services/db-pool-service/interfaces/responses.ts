import { HealthStatus } from "../enums/health-statuses";
import { DbQueryResult } from "../types";

export interface HealthResponse {
	status: HealthStatus;
	dbConnection: boolean;
}

export interface QueryResponse {
	rows: DbQueryResult;
}
