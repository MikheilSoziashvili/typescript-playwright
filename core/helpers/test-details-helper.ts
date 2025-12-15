import { REPORTPORTAL_CONFIG_ANNOTATION_TYPE } from "@core/reporters/reportportal";
import { JiraIssueExtractor } from "@core/reporters/reportportal/extractors/jira-issue-extractor";
import { AnyTag } from "@core/types/types";
import { jiraIssueId } from "@core/utils/utils";
import { JiraComponent } from "@enums/jira/jira-components";
import { JiraIssueType } from "@enums/jira/jira-issue-types";
import { JiraUser } from "@enums/jira/jira-users";
import { AnnotationType } from "@enums/playwright/annotationsTypes";
import { TestDetails } from "@playwright/test";
import {
	nonAlphanumSpacePattern,
	whiteSpacePattern,
} from "@support/regex-patterns";

const JIRA_COMPONENT_VALUES = new Set<string>(Object.values(JiraComponent));

export function testDetails(testName?: string): TestDetailsBuilder {
	return new TestDetailsBuilder(testName);
}

class TestDetailsBuilder {
	private _testDetails: TestDetails = {};
	private _testName?: string;
	private _tags: string[] = [];
	private _jiraIssueId?: string;
	private _author?: JiraUser;
	private _arbitraryAnnotations: {
		type: AnnotationType;
		description: string;
	}[] = [];
	private _bugTickets: string[] = [];

	constructor(testName?: string) {
		this._testName = testName;
		if (testName) {
			const extractedId = JiraIssueExtractor.extract(testName);
			if (extractedId) {
				this._jiraIssueId = extractedId;
			}
		}
	}

	/**
	 * Builds tags for the test/test suite
	 *
	 * @param tags Note: tags must be JiraComponent or strings starting with @
	 * @returns TestDetailsBuilder
	 */
	public withTags(...tags: AnyTag[]): TestDetailsBuilder {
		if (tags.length === 0) {
			throw new Error("Tags must not be empty");
		}

		const normalized = tags.map(this.normalizeTag.bind(this));
		const unique = Array.from(new Set(normalized));

		this._tags = unique;
		this._testDetails.tag = unique;
		return this;
	}

	/**
	 * Adds JIRA link annotations of type 'Bug' to the test/test suite
	 * @param bugTicketIDs The JIRA bug ticketID(s) link annotations to be added to the test/test suite
	 * @returns TestDetailsBuilder
	 */
	public withJiraBugTickets(...bugTicketIDs: string[]): TestDetailsBuilder {
		this._bugTickets = bugTicketIDs;

		return this.withJiraIssueAnnotations(
			...bugTicketIDs.map((bugTicketID) => ({
				type: JiraIssueType.BUG,
				id: bugTicketID,
			})),
		);
	}

	/**
	 * Adds JIRA link annotations to the test/test suite
	 * @param jiraIssues The JIRA issue link annotations to be added to the relevant test/test suite
	 * @returns TestDetailsBuilder
	 */
	public withJiraIssueAnnotations(
		...jiraIssues: { type: JiraIssueType; id: string }[]
	): TestDetailsBuilder {
		return this.withAnnotations(
			...jiraIssues.map((jiraIssue) => ({
				type: jiraIssue.type,
				description: jiraIssueId(jiraIssue.id),
			})),
		);
	}

	/**
	 * Adds annotations to the test/test suite
	 * @param annotations The annotations to be added to the test/test suite
	 * @returns TestDetailsBuilder
	 */
	private withAnnotations(
		...annotations: { type: JiraIssueType | string; description: string }[]
	): TestDetailsBuilder {
		if (!annotations.length) {
			throw new Error("No annotations provided");
		}

		this._testDetails.annotation = [
			...this.annotationToArray(this._testDetails.annotation),
			...annotations,
		];

		return this;
	}

	/**
	 * Adds an author annotation to the test/test suite.
	 *
	 * Wraps {@link withAnnotations} to mark the responsible test author in the
	 * underlying Playwright {@link TestDetails} metadata.
	 *
	 * Also stores the author internally for ReportPortal attribute generation.
	 *
	 * @param authorName - The test author, specified as a {@link JiraUser} enum value.
	 * @returns {TestDetailsBuilder} This builder instance for chaining.
	 *
	 * @example
	 * testDetails("[ENG-123] Test Name")
	 *   .withAuthor(JiraUser.SVETOSLAV_LAZAROV)
	 *   .apply();
	 */
	public withAuthor(authorName: JiraUser): TestDetailsBuilder {
		this._author = authorName;
		return this.withAnnotations({
			type: AnnotationType.AUTHOR,
			description: `${authorName}@teamgamdom.com`,
		});
	}

	/**
	 * Adds arbitrary annotations to the test/test suite.
	 *
	 * Wraps {@link withAnnotations} to accept any {@link AnnotationType} with a free-form
	 * description and appends them to the underlying Playwright {@link TestDetails} metadata.
	 *
	 * Also stores annotations internally for ReportPortal attribute generation.
	 *
	 * @param annotations - One or more annotations to add. Must not be empty.
	 * @returns {TestDetailsBuilder} This builder instance for chaining.
	 * @throws {Error} If no annotations are provided.
	 *
	 * @example
	 * testDetails("[ENG-123] Test Name")
	 *   .withArbitraryAnnotations(
	 *     { type: AnnotationType.Bug, description: "Missing validation" },
	 *     { type: AnnotationType.Issue, description: "JR-123 regression" }
	 *   )
	 *   .apply();
	 */
	public withArbitraryAnnotations(
		...annotations: { type: AnnotationType; description: string }[]
	): TestDetailsBuilder {
		this._arbitraryAnnotations = annotations;
		return this.withAnnotations(
			...annotations.map((annotation) => ({
				type: annotation.type,
				description: annotation.description,
			})),
		);
	}

	/**
	 * Applies test details and stores ReportPortal config in test annotations.
	 * The config will be read by the auto-use fixture when the test runs.
	 *
	 * It is thread-safe and works with parallel execution since each
	 * test's config is stored in its own TestInfo.annotations.
	 */
	public apply() {
		const config = {
			jiraIssueId: this._jiraIssueId,
			tags: this._tags,
			author: this._author,
			arbitraryAnnotations: this._arbitraryAnnotations,
			bugTickets: this._bugTickets,
		};

		this._testDetails.annotation = [
			...this.annotationToArray(this._testDetails.annotation),
			{
				type: REPORTPORTAL_CONFIG_ANNOTATION_TYPE,
				description: JSON.stringify(config),
			},
		];

		return this._testDetails;
	}

	/**
	 * Checks whether the given value is a valid {@link JiraComponent}.
	 *
	 * @param val - The value to check.
	 * @returns True if the value is a string and matches one of the JiraComponent enum values, false otherwise.
	 */
	private isJiraComponent(val: unknown): val is JiraComponent {
		return typeof val === "string" && JIRA_COMPONENT_VALUES.has(val);
	}

	/**
	 * Normalizes a tag input (string or JiraComponent) into a valid test tag string.
	 *
	 * - If the input is a JiraComponent, it is converted to a `@lowerCamelCase` string via {@link toTestTag}.
	 * - If the input is already a string starting with `@`, it is returned as-is.
	 * - Otherwise, an error is thrown.
	 *
	 * @param input - The tag to normalize. Can be {@link AnyTag}.
	 * @returns A normalized tag string beginning with `@`.
	 *
	 * @throws If the string does not start with `@` or the type is unsupported.
	 */
	private normalizeTag(input: AnyTag): string {
		if (this.isJiraComponent(input)) {
			return this.toTestTag(input);
		}

		if (typeof input === "string") {
			if (input.startsWith("@")) {
				return input;
			}

			throw new Error(`Tag must start with '@': "${input}"`);
		}

		throw new Error(`Unsupported tag type: ${String(input)}`);
	}

	/**
	 * Converts a {@link JiraComponent} value into a Playwright-compatible test tag.
	 *
	 * - Special characters are replaced with spaces.
	 * - The value is split into words.
	 * - Words are converted to lowercase.
	 * - Words are joined with `-`.
	 * - The final result is prefixed with `@`.
	 *
	 * @param component - The JiraComponent enum value to convert.
	 * @returns A normalized test tag string starting with `@`.
	 *
	 * @throws If no valid words can be extracted from the JiraComponent value.
	 */
	private toTestTag(component: JiraComponent): string {
		const raw = component.toString();
		const cleaned = raw.replace(nonAlphanumSpacePattern, " ");
		const words = cleaned.trim().split(whiteSpacePattern).filter(Boolean);

		if (words.length === 0) {
			throw new Error(
				"No valid words extracted from JiraComponent value",
			);
		}

		const hyphenated = words.map((w) => w.toLowerCase()).join("-");

		return `@${hyphenated}`;
	}

	private annotationToArray<T>(value: T | T[] | undefined): T[] {
		return Array.isArray(value) ? value : value ? [value] : [];
	}
}
