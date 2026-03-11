import { ApiRequestOptions } from "@api/base-api";

export const API_DEFAULT_RETRY: ApiRequestOptions = {
	retry: { maxRetries: 3, delayMs: 2000 },
};
