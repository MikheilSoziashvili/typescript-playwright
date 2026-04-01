import { jiraIssueGlobalPattern } from "@support/regex-patterns";
import { JIRA_ISSUE_PATTERN } from "../constants/reportportal-constants";

/**
 * Extracts JIRA issue ID(s) from test title
 *
 * @example
 * JiraIssueExtractor.extract("[ENG-5847] Test Name") // returns "ENG-5847"
 * JiraIssueExtractor.extract("Test Name") // returns undefined
 * JiraIssueExtractor.extractAll("[ENG-5086] [ENG-2345] Test Name") // returns ["ENG-5086", "ENG-2345"]
 */
export class JiraIssueExtractor {
	static extract(testTitle: string): string | undefined {
		const match = testTitle.match(JIRA_ISSUE_PATTERN);
		return match?.[1];
	}

	static extractAll(testTitle: string): string[] {
		return [...testTitle.matchAll(jiraIssueGlobalPattern)].map((m) => m[1]);
	}
}
