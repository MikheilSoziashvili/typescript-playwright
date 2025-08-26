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

export function testDetails(): TestDetailsBuilder {
	return new TestDetailsBuilder();
}

class TestDetailsBuilder {
	private _testDetails: TestDetails = {};

	/**
	 * Builds tags for the test/test suite
	 *
	 * @param tags Note: tags must start with @ symbol
	 * @returns TestDetailsBuilder
	 */
	public withTags(...tags: AnyTag[]): TestDetailsBuilder {
		if (tags.length === 0) {
			throw new Error("Tags must not be empty");
		}

		const normalized = tags.map(this.normalizeTag.bind(this));

		const unique = Array.from(new Set(normalized));

		this._testDetails.tag = unique;
		return this;
	}

	/**
	 * Adds JIRA link annotations of type 'Bug' to the test/test suite
	 * @param bugTicketIDs The JIRA bug ticketID(s) link annotations to be added to the test/test suite
	 * @returns TestDetailsBuilder
	 */
	public withJiraBugTickets(...bugTicketIDs: string[]): TestDetailsBuilder {
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

	public apply() {
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

	/**
	 * Adds arbitrary annotations to the test/test suite.
	 *
	 * Wraps {@link withAnnotations} to accept any {@link AnnotationType} with a free-form
	 * description and appends them to the underlying Playwright {@link TestDetails} metadata.
	 *
	 * @param annotations - One or more annotations to add. Must not be empty.
	 * @returns {TestDetailsBuilder} This builder instance for chaining.
	 * @throws {Error} If no annotations are provided.
	 *
	 * @example
	 * testDetails()
	 *   .withArbitraryAnnotations(
	 *     { type: AnnotationType.Info, description: "Nightly run" },
	 *     { type: AnnotationType.Issue, description: "JR-123 regression" }
	 *   )
	 *   .apply();
	 */
	public withArbitraryAnnotations(
		...annotations: { type: AnnotationType; description: string }[]
	): TestDetailsBuilder {
		return this.withAnnotations(
			...annotations.map((annotation) => ({
				type: annotation.type,
				description: annotation.description,
			})),
		);
	}

	/**
	 * Adds an author annotation to the test/test suite.
	 *
	 * Wraps {@link withAnnotations} to mark the responsible test author in the
	 * underlying Playwright {@link TestDetails} metadata.
	 *
	 * @param authorName - The test author, specified as a {@link JiraUser} enum value.
	 * @returns {TestDetailsBuilder} This builder instance for chaining.
	 *
	 * @example
	 * testDetails()
	 *   .withAuthor(JiraUser.SVETOSLAV_LAZAROV)
	 *   .apply();
	 */
	public withAuthor(authorName: JiraUser): TestDetailsBuilder {
		return this.withAnnotations({
			type: AnnotationType.AUTHOR,
			description: `${authorName}@teamgamdom.com`,
		});
	}

	private annotationToArray<T>(value: T | T[] | undefined): T[] {
		return Array.isArray(value) ? value : value ? [value] : [];
	}
}
