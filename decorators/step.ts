import test from "@playwright/test";
import {
	lowerToUpperWithSpace,
	capitalizeFirstLetter,
} from "@support/regex-patterns";

/**
 * Step decorator to wrap methods with Playwright's test.step functionality.
 * If a message is provided, it uses that; otherwise, it generates a message from the method name.
 *
 * Example usage:
 * @step()
 * public async diceSliderValueIsCorrect(diceValue: string) // This will produce "Dice slider value is correct" in report
 *
 * @step("Dice value is absolutely correct")
 * public async diceSliderValueIsCorrect(diceValue: string) // This will produce "Dice value is absolutely correct" in report
 *
 * @param message Optional custom step message.
 */
function step(message?: string) {
	return function <This, Args extends unknown[], T>(
		originalMethod: (this: This, ...args: Args) => Promise<T>,
		context: ClassMethodDecoratorContext<This>,
	) {
		const stepMessage =
			message && message.trim()
				? message
				: generateStepMessageFromMethodName(String(context.name));

		return function (this: This, ...args: Args): Promise<T> {
			return test.step(stepMessage, () =>
				originalMethod.apply(this, args),
			);
		};
	};
}

/**
 * Generates a step message from the method name by inserting spaces before capital letters,
 * converting to lowercase, and capitalizing the first letter.
 * @param methodName The original method name.
 * @returns The generated step message.
 */
function generateStepMessageFromMethodName(methodName: string): string {
	return methodName
		.replace(lowerToUpperWithSpace, "$1 $2")
		.toLowerCase()
		.replace(capitalizeFirstLetter, (str) => str.toUpperCase());
}

export { step };
