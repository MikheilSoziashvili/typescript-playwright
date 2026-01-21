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

	/**
	 * Marks test with known "defect"
	 * This helps ReportPortal's auto-analysis link similar failures
	 */
	markKnownDefect(bugTickets: readonly string[]): void {
		if (bugTickets.length === 0) {
			return;
		}

		try {
			const defectMessage = `Known Issue(s): ${bugTickets.join(", ")}`;
			ReportingApi.warn(defectMessage);

			const defectAttributes = bugTickets.map((ticket) => ({
				key: "defect",
				value: ticket,
			}));
			ReportingApi.addAttributes(defectAttributes);
		} catch (error) {
			logger.warn("Failed to mark known defect in ReportPortal:", error);
		}
	}

	/**
	 * Sets test status and description for known issues
	 */
	setKnownIssueStatus(bugTickets: readonly string[]): void {
		if (bugTickets.length === 0) {
			return;
		}

		try {
			const description = `This test has known issue(s): ${bugTickets.join(
				", ",
			)}. 
Test is skipped in nightly runs until the issue is resolved.`;

			ReportingApi.setDescription(description);
			ReportingApi.setStatusInfo();
		} catch (error) {
			logger.warn("Failed to set known issue status:", error);
		}
	}
}
