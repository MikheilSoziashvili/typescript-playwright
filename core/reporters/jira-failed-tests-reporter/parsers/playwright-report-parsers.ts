import fs from "fs";
import { AnnotationType } from "@enums/playwright/annotationsTypes";
import { ansiEscapePattern, testTimeoutPattern } from "@support/regex-patterns";
import { IReportParser } from "../interfaces/report-parser";
import { ParsedTest } from "../models/parsed-test";
import {
	PlaywrightReport,
	Suite,
	Spec,
	Test,
	Step,
} from "../models/playwright-report";
import { TestStatus } from "@enums/test-status";

/**
 * Parser for Playwright JSON test report.
 * Extracts failed and flaky tests with detailed information for JIRA bug reporting.
 */
export class PlaywrightReportParser implements IReportParser {
	private readonly knownIssueTypes = new Set([
		AnnotationType.BUG,
		AnnotationType.PERFORMANCE,
		AnnotationType.INFRASTRUCTURE,
		AnnotationType.BROWSER_SPECIFIC,
	]);

	/**
	 * Parses a Playwright JSON report and extracts failed/flaky tests.
	 * @param reportPath - Path to the Playwright JSON report file
	 * @returns Array of parsed test failures ready for JIRA reporting
	 */
	parse(reportPath: string): ParsedTest[] {
		const raw = fs.readFileSync(reportPath, "utf-8");
		const data = JSON.parse(raw) as PlaywrightReport;

		const results: ParsedTest[] = [];
		this.walkSuites(data.suites, results);

		return results;
	}

	/**
	 * Recursively walks through test suites to find and process specs.
	 * @param suites - Array of test suites to process
	 * @param results - Accumulator array for parsed test results
	 */
	private walkSuites(suites: Suite[], results: ParsedTest[]): void {
		for (const suite of suites) {
			if (suite.suites?.length) {
				this.walkSuites(suite.suites, results);
			}

			this.processSpecs(suite.specs ?? [], results);
		}
	}

	/**
	 * Processes test specs and extracts test information.
	 * @param specs - Array of test specifications
	 * @param results - Accumulator array for parsed test results
	 */
	private processSpecs(specs: Spec[], results: ParsedTest[]): void {
		for (const spec of specs) {
			for (const test of spec.tests) {
				const parsedTest = this.processTest(spec, test);
				if (parsedTest) {
					results.push(parsedTest);
				}
			}
		}
	}

	/**
	 * Processes a single test and determines if it should be reported.
	 * Filters out passing tests and tests with known issue annotations.
	 * @param spec - Test specification containing metadata
	 * @param test - Individual test execution results
	 * @returns Parsed test data or null if test should be skipped
	 */
	private processTest(spec: Spec, test: Test): ParsedTest | null {
		const hasFailed = test.results.some(
			(r) => r.status === TestStatus.FAILED,
		);
		const isFlaky =
			test.results.length > 1 &&
			test.results.some((r) => r.status === TestStatus.PASSED);

		if (!hasFailed && !isFlaky) {
			return null;
		}

		const firstRelevantResult =
			test.results.find((r) => r.status === TestStatus.FAILED) ||
			test.results[0];

		const allAnnotations = [
			...(test.annotations ?? []),
			...(firstRelevantResult.annotations ?? []),
		];

		if (this.hasKnownIssue(allAnnotations)) {
			return null;
		}

		const author = this.extractAuthor(allAnnotations);
		const stack = this.formatStackTrace(
			firstRelevantResult.error?.stack || "",
		);

		return {
			title: spec.title,
			specId: spec.id ?? "",
			filePath: spec.file,
			line: spec.line,
			stack: stack,
			annotations: allAnnotations,
			author: author,
			expected: this.extractExpected(stack),
			actual: this.extractActual(stack),
			steps: this.formatSteps(firstRelevantResult.steps),
		};
	}

	/**
	 * Checks if test has a known issue annotation that should skip reporting.
	 * @param annotations - Array of test annotations
	 * @returns True if test has a known issue type annotation
	 */
	private hasKnownIssue(annotations: { type: string }[]): boolean {
		return annotations.some((a) =>
			this.knownIssueTypes.has(a.type as AnnotationType),
		);
	}

	/**
	 * Extracts the test author from annotations.
	 * @param annotations - Array of test annotations
	 * @returns Author email or undefined if not found
	 */
	private extractAuthor(
		annotations: { type: string; description?: string }[],
	): string | undefined {
		const authorAnnotation = annotations.find(
			(a) => a.type === AnnotationType.AUTHOR,
		);
		return authorAnnotation?.description?.trim();
	}

	/**
	 * Extracts the expected behavior from the stack trace.
	 * Handles special cases like timeout errors.
	 * @param stack - Formatted stack trace string
	 * @returns Expected behavior description
	 */
	private extractExpected(stack: string): string {
		if (stack.includes("Test timeout") || stack.includes("Timeout")) {
			return "Test should complete within timeout period";
		}

		return this.extractFromStack(
			stack,
			"Expected:",
			"Received:",
			"Expected behavior not defined (check the report for more information).",
		);
	}

	/**
	 * Extracts the actual behavior from the stack trace.
	 * Handles special cases like timeout errors.
	 * @param stack - Formatted stack trace string
	 * @returns Actual behavior description
	 */
	private extractActual(stack: string): string {
		if (
			stack.includes("Test timeout of") &&
			stack.includes("ms exceeded")
		) {
			const match = stack.match(testTimeoutPattern);
			const timeout = match ? match[1] : "unknown";
			return `Test exceeded timeout of ${timeout}ms`;
		}

		return this.extractFromStack(
			stack,
			"Received:",
			"\n",
			"Actual behavior not defined (check the report for more information).",
		);
	}

	/**
	 * Generic method to extract text between two markers in the stack trace.
	 * @param stack - Stack trace string
	 * @param startMarker - Text marker indicating start of desired content
	 * @param endMarker - Text marker indicating end of desired content
	 * @param fallback - Default value if markers are not found
	 * @returns Extracted text or fallback value
	 */
	private extractFromStack(
		stack: string,
		startMarker: string,
		endMarker: string,
		fallback: string,
	): string {
		if (!stack.includes(startMarker)) {
			return fallback;
		}

		return stack
			.split(startMarker)[1]
			.split(endMarker)[0]
			.trim()
			.replace(ansiEscapePattern, "");
	}

	/**
	 * Formats test steps into a hierarchical, readable format.
	 * Uses indentation and bullets to show step nesting.
	 * @param steps - Array of test steps from Playwright report
	 * @returns Formatted steps string with hierarchical structure
	 */
	private formatSteps(steps?: Step[]): string {
		if (!steps?.length) {
			return "Steps not available (check the report for more information).";
		}

		const NBSP = "\u00A0";
		const indent = (level: number) => NBSP.repeat(level * 4);
		const bulletByDepth = ["", "▶", "▪", "▹", "•"];

		let stepCounter = 1;

		const render = (stepList: Step[], depth = 0): string =>
			stepList
				.map((step) => {
					const isTopLevel = depth === 0;
					const prefix = isTopLevel
						? `${stepCounter++}. `
						: `${bulletByDepth[depth] || "•"} `;
					const indentation = indent(depth);
					const line = `${indentation}${prefix}${step.title}`;
					const children = step.steps?.length
						? `\n${render(step.steps, depth + 1)}`
						: "";
					return `${line}${children}`;
				})
				.join("\n");

		return render(steps);
	}

	/**
	 * Formats raw stack trace by removing ANSI escape codes and adding indentation.
	 * @param raw - Raw stack trace string from test failure
	 * @returns Cleaned and formatted stack trace
	 */
	private formatStackTrace(raw: string): string {
		const clean = raw.replace(ansiEscapePattern, "").trim();
		const [errorMessage, ...stackLines] = clean.split("\n");

		const formattedStack = [
			`${errorMessage.trim()}`,
			...stackLines.map((line) => `   ${line.trim()}`),
		].join("\n");

		return formattedStack;
	}
}
