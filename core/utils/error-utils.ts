import { ErrnoCode } from "@enums/errno/errno-codes";

/**
 * Determines whether the given value is a Node.js `ErrnoException`.
 *
 * This is useful when catching errors from `fs` or other system-level operations
 * that may return a structured error object containing a `code` property.
 *
 * @param error - The unknown value to check.
 * @returns `true` if the error is an instance of `Error` and has a string `code` property; otherwise, `false`.
 */
export function isNodeError(error: unknown): error is NodeJS.ErrnoException {
	return (
		error instanceof Error &&
		typeof (error as NodeJS.ErrnoException).code === "string"
	);
}

/**
 * Determines whether the given error is a "file not found" error (`ENOENT`).
 *
 * @param error - The unknown error value to inspect.
 * @returns `true` if the error is a Node.js system error and its code is `ENOENT`; otherwise, `false`.
 */
export function isFileNotFoundError(error: unknown): boolean {
	return isNodeError(error) && error.code === ErrnoCode.ENOENT;
}
