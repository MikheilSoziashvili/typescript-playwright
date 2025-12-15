import { AnnotationType } from "@enums/playwright/annotationsTypes";
import { JiraUser } from "@enums/jira/jira-users";

/**
 * Configuration for ReportPortal test metadata
 */
export interface ReportPortalConfig {
	readonly jiraIssueId?: string;
	readonly tags: readonly string[];
	readonly author?: JiraUser;
	readonly arbitraryAnnotations?: readonly {
		type: AnnotationType;
		description: string;
	}[];
	readonly bugTickets?: readonly string[];
}

/**
 * ReportPortal attribute with optional key
 */
export interface ReportPortalAttribute {
	readonly key?: string;
	readonly value: string;
}

/**
 * Result type for config extraction operations
 */
export type ConfigExtractionResult =
	| { readonly success: true; readonly config: ReportPortalConfig }
	| { readonly success: false; readonly reason: string };
