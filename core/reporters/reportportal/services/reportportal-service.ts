import { ReportingApi } from "@reportportal/agent-js-playwright";
import { logger } from "@logger/logger";
import { ReportPortalAttribute } from "../types/reportportal-types";

/**
 * Service for interacting with ReportPortal API
 */
export class ReportPortalService {
	/**
	 * Adds attributes to the current test
	 */
	addAttributes(attributes: readonly ReportPortalAttribute[]): void {
		if (attributes.length === 0) {
			return;
		}

		try {
			ReportingApi.addAttributes([...attributes]);
		} catch (error) {
			logger.warn("Failed to add attributes to ReportPortal:", error);
		}
	}

	/**
	 * Sets the test case ID (JIRA Issue ID)
	 */
	setTestCaseId(testCaseId: string): void {
		try {
			ReportingApi.setTestCaseId(testCaseId);
		} catch (error) {
			logger.warn("Failed to set test case ID in ReportPortal:", error);
		}
	}
}
