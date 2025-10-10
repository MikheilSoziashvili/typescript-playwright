import { DEFAULT_ASSIGNEE_ACCOUNT_ID } from "../config/jira-failed-report-config";
import { IUserResolver } from "../interfaces/user-resolver";
import { jiraUserMap, reverseJiraUserMap } from "@constants/jira";

/**
 * Resolves test authors to JIRA account IDs and provides display names.
 */
export class JiraUserResolver implements IUserResolver {
	constructor(
		private readonly userMap: Record<string, string> = jiraUserMap,
		private readonly reverseUserMap: Record<
			string,
			string
		> = reverseJiraUserMap,
	) {}

	/**
	 * Resolves an email address to a JIRA account ID.
	 * @param email - User email address
	 * @returns JIRA account ID or null if not found
	 */
	resolveAccountId(email: string): string | null {
		return this.userMap[email] || null;
	}

	/**
	 * Gets the default JIRA account ID for tests without authors.
	 * @returns Default assignee JIRA account ID (Svetoslav Lazarov)
	 */
	getDefaultAccountId(): string {
		return DEFAULT_ASSIGNEE_ACCOUNT_ID;
	}

	/**
	 * Resolves a JIRA account ID to a display name.
	 * @param accountId - JIRA account ID
	 * @returns Display name or account ID if not found
	 */
	getDisplayName(accountId: string): string {
		return this.reverseUserMap[accountId] || accountId;
	}
}
