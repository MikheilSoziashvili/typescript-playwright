import { expect } from "@playwright/test";
import { ErrorConsoleListener } from "./error-console-listener";

/**
 * Asserter for verifying console error states.
 * Temporarily separated from listener logic until final integration design.
 */
export class ErrorConsoleAsserter {
	private readonly listener: ErrorConsoleListener;

	constructor(listener: ErrorConsoleListener) {
		this.listener = listener;
	}

	public expectNoErrorContaining(substring: string): void {
		const errors = this.listener.getErrorTexts();
		const matchingErrors = errors.filter((t) => t.includes(substring));

		expect(
			matchingErrors,
			`Expected no console errors containing "${substring}", but found:\n${matchingErrors.join(
				"\n",
			)}`,
		).toHaveLength(0);
	}

	public assertNoMissingBallErrorPresent(): void {
		const errorExpectedToNotBeVisible = "Missed ball";
		this.expectNoErrorContaining(errorExpectedToNotBeVisible);
	}
}
