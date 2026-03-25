export enum HttpStatus {
	// 2xx Success
	OK = 200,
	CREATED = 201,
	NO_CONTENT = 204,

	// 3xx Redirection
	MOVED_PERMANENTLY = 301,

	// 4xx Client Errors
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	METHOD_NOT_ALLOWED = 405,

	// 5xx Server Errors
	INTERNAL_SERVER_ERROR = 500,
	BAD_GATEWAY = 502,
	SERVICE_UNAVAILABLE = 503,
}

export enum ExpectedStatusGroup {
	SUCCESS = "SUCCESS",
	ERROR = "ERROR",
}

export const SUCCESS_STATUS_CODES: number[] = [
	HttpStatus.OK,
	HttpStatus.CREATED,
	HttpStatus.NO_CONTENT,
];

export const ERROR_STATUS_CODES: number[] = [
	HttpStatus.BAD_REQUEST,
	HttpStatus.UNAUTHORIZED,
	HttpStatus.FORBIDDEN,
	HttpStatus.NOT_FOUND,
	HttpStatus.METHOD_NOT_ALLOWED,
	HttpStatus.INTERNAL_SERVER_ERROR,
	HttpStatus.BAD_GATEWAY,
	HttpStatus.SERVICE_UNAVAILABLE,
];

export type ExpectedStatus = HttpStatus | ExpectedStatusGroup;
