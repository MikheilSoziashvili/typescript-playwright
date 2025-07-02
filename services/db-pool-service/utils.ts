import { DbPoolServiceConfiguration } from "@core/types/types";

/**
 * Builds a base URL string from the given database pool service configuration.
 *
 * @param config - The database pool service configuration object.
 * @returns The base URL string (e.g., "http://localhost:3030").
 */
export function buildBaseUrl(config: DbPoolServiceConfiguration): string {
	return `${config.protocol}://${config.url}:${config.port}`;
}
