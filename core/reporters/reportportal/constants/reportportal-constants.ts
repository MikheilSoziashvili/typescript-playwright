import { jiraIssuePattern, tagPrefixPattern } from "@support/regex-patterns";

/**
 * Regular expression pattern for extracting JIRA issue IDs
 */
export const JIRA_ISSUE_PATTERN = jiraIssuePattern;

/**
 * Annotation type used to store ReportPortal config in test metadata
 */
export const REPORTPORTAL_CONFIG_ANNOTATION_TYPE = "__reportportal_config__";

/**
 * Pattern for matching tag prefix
 */
export const TAG_PREFIX_PATTERN = tagPrefixPattern;
