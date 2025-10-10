import { JiraUser } from "@enums/jira/jira-users";
import { jiraUserMap } from "@constants/jira";

/**
 * Configuration settings for the JIRA Failed Tests Reporter
 * Centralized configuration for reporter behavior and defaults
 */

/**
 * Default JIRA account ID used when test has no author annotation.
 * Assigned to: Svetoslav Lazarov
 */
export const DEFAULT_ASSIGNEE_ACCOUNT_ID =
	jiraUserMap[`${JiraUser.SVETOSLAV_LAZAROV}@teamgamdom.com`];

/**
 * JIRA project key for creating bug issues
 */
export const JIRA_PROJECT_KEY = "ENG";

/**
 * Parent epic key (E2E fixes)
 */
export const JIRA_PARENT_EPIC_KEY = "ENG-2080";

/**
 * Story points value for automation-detected bugs
 */
export const JIRA_STORY_POINTS = 0.5;

/**
 * JIRA environment custom field value (Staging)
 */
export const JIRA_ENVIRONMENT_FIELD_VALUE =
	"f41853b0-1555-458b-853f-99dec3fac2fb";

/**
 * Labels applied to all automation-detected bug issues
 */
export const JIRA_AUTOMATION_LABELS = [
	"qa-automation",
	"nightly-report",
	"automation-detected",
] as const;

/**
 * Maximum character length for JIRA steps field before truncation
 * JIRA's actual limit is 32767, but we use 32000 for safety margin
 */
export const JIRA_STEPS_MAX_LENGTH = 32000;

/**
 * Prefix added to all automation-created bug summaries
 */
export const JIRA_AUTOMATION_SUMMARY_PREFIX = "[Automation Reporter]";
