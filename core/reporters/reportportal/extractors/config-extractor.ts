import { TestInfo } from "@playwright/test";
import { logger } from "@logger/logger";
import {
	ConfigAccumulator,
	ConfigExtractionResult,
	ReportPortalConfig,
} from "../types/reportportal-types";
import { REPORTPORTAL_CONFIG_ANNOTATION_TYPE } from "../constants/reportportal-constants";

/**
 * Extracts ReportPortal config from test annotations
 */
export class ConfigExtractor {
	static extract(testInfo: TestInfo): ConfigExtractionResult {
		// Find ALL ReportPortal config annotations (from describe + test)
		const configAnnotations = testInfo.annotations.filter(
			(a) => a.type === REPORTPORTAL_CONFIG_ANNOTATION_TYPE,
		);

		if (configAnnotations.length === 0) {
			return {
				success: false,
				reason: "No ReportPortal configuration annotation found",
			};
		}

		return this.mergeConfigs(configAnnotations);
	}

	/**
	 * Merges multiple config annotations, with later ones taking precedence
	 * Tags are accumulated from all levels
	 */
	private static mergeConfigs(
		annotations: { type: string; description?: string }[],
	): ConfigExtractionResult {
		const configs: ReportPortalConfig[] = [];

		for (const annotation of annotations) {
			if (!annotation.description) {
				continue;
			}

			try {
				const config = JSON.parse(
					annotation.description,
				) as ReportPortalConfig;
				configs.push(config);
			} catch (error) {
				const reason = `Failed to parse ReportPortal config: ${
					error instanceof Error ? error.message : String(error)
				}`;
				logger.warn(reason);
			}
		}

		if (configs.length === 0) {
			return {
				success: false,
				reason: "No valid ReportPortal configuration found",
			};
		}

		const mergedConfig = this.merge(configs);

		return {
			success: true,
			config: mergedConfig,
		};
	}

	/**
	 * Merges multiple configs into one
	 * - Tags: accumulated from all configs (unique)
	 * - Other fields: last non-empty value wins
	 */
	private static merge(configs: ReportPortalConfig[]): ReportPortalConfig {
		const initialValue: ConfigAccumulator = {
			jiraIssueId: undefined,
			tags: [],
			author: undefined,
			arbitraryAnnotations: [],
			bugTickets: [],
		};

		const merged = configs.reduce<ConfigAccumulator>(
			(acc, config) => ({
				jiraIssueId: config.jiraIssueId ?? acc.jiraIssueId,
				author: config.author ?? acc.author,
				tags: [...acc.tags, ...config.tags],
				arbitraryAnnotations: [
					...acc.arbitraryAnnotations,
					...(config.arbitraryAnnotations ?? []),
				],
				bugTickets: [...acc.bugTickets, ...(config.bugTickets ?? [])],
			}),
			initialValue,
		);

		// Remove duplicate tags
		return {
			...merged,
			tags: Array.from(new Set(merged.tags)),
		};
	}
}
