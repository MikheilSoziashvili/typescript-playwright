import { APIResponse, errors as PlaywrightErrors } from "@playwright/test";
import { logger } from "@logger/logger";
import { KnownError } from "@core/types/error-types";

// Function to format the error message
function formatErrorMessage(response: APIResponse): string {
	return `HTTP Error ${response.status()}: ${response.statusText()}`;
}

// Function to handle different types of errors
export function handleError(error: KnownError): void {
	if (error instanceof PlaywrightErrors.TimeoutError) {
		logger.error("Request timed out:", error);
	} else if (error.response) {
		const response = error.response;
		logger.error(formatErrorMessage(response));
	} else {
		logger.error("Unexpected error:", error);
	}
}
