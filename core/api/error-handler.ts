import { APIResponse, errors as PlaywrightErrors } from "@playwright/test";
import { logger } from "@logger/logger";
import { KnownError } from "@core/types";

export function handleError(error: KnownError): void {
	if (error instanceof PlaywrightErrors.TimeoutError) {
		logger.error("Request timed out:", error);
	} else if (error.response) {
		const response: APIResponse = error.response;
		logger.error(`HTTP Error ${response.status()}: ${response.statusText()}`);
	} else {
		logger.error("Unexpected error:", error);
	}
}
