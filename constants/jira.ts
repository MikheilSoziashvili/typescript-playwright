import { jiraUserMap } from "@core/reporters/jira-failed-tests-reporter/user-map";

export const reverseJiraUserMap: Record<string, string> = Object.fromEntries(
	Object.entries(jiraUserMap).map(([email, accountId]) => [accountId, email]),
);
export { jiraUserMap };
