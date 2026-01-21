import { TestInfo } from "@playwright/test";
import { logger } from "@logger/logger";
import {
	ConfigExtractionResult,
	ReportPortalConfig,
} from "../types/reportportal-types";
import { REPORTPORTAL_CONFIG_ANNOTATION_TYPE } from "../constants/reportportal-constants";

/**
 * Extracts ReportPortal config from test annotations
 */
export class ConfigExtractor {
	static extract(testInfo: TestInfo): ConfigExtractionResult {
		/** Get the most specific annotation (test level overrides describe level).
		 * Focus on last occurrence, which is the most specific (innermost test).
		 */
		const annotation = [...testInfo.annotations]
			.reverse()
			.find((a) => a.type === REPORTPORTAL_CONFIG_ANNOTATION_TYPE);

		if (!annotation?.description) {
			return {
				success: false,
				reason: "No ReportPortal configuration annotation found",
			};
		}

		return this.parseConfig(annotation.description);
	}

	private static parseConfig(description: string): ConfigExtractionResult {
		try {
			const config = JSON.parse(description) as ReportPortalConfig;
			return {
				success: true,
				config: config,
			};
		} catch (error) {
			const reason = `Failed to parse ReportPortal config: ${
				error instanceof Error ? error.message : String(error)
			}`;
			logger.warn(reason);
			return {
				success: false,
				reason: reason,
			};
		}
	}
}
