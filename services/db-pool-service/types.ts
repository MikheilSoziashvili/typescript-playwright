import { QueryResult, QueryResultRow } from "pg";
import { QueryRequest } from "./interfaces";

export type SqlValue = string | number | boolean | null | Date;
export type DbQueryRequest = Record<keyof QueryRequest, string | SqlValue[]>;
export type DbQueryResult<T extends QueryResultRow = QueryResultRow> =
	QueryResult<T>;
