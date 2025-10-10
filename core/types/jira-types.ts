/**
 * Response structure from JIRA API when creating an issue.
 */
export interface JiraCreateIssueResponse {
	key?: string;
	id?: string;
	self?: string;
}

/**
 * Response structure from JIRA API search/JQL queries.
 */
export interface JiraSearchResponse {
	issues: JiraIssue[];
	total?: number;
	maxResults?: number;
	startAt?: number;
}

/**
 * Individual JIRA issue structure in search results.
 */
export interface JiraIssue {
	key: string;
	id?: string;
	self?: string;
	fields: {
		summary: string;
		[key: string]: unknown;
	};
}
