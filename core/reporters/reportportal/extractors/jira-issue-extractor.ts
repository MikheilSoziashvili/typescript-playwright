import { JIRA_ISSUE_PATTERN } from "../constants/reportportal-constants";

/**
 * Extracts JIRA issue ID from test title
 *
 * @example
 * JiraIssueExtractor.extract("[ENG-5847] Test Name") // returns "ENG-5847"
 * JiraIssueExtractor.extract("Test Name") // returns undefined
 */
export class JiraIssueExtractor {
	static extract(testTitle: string): string | undefined {
		const match = testTitle.match(JIRA_ISSUE_PATTERN);
		return match?.[1];
	}
}
