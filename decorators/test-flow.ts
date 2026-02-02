import test from "@playwright/test";
import {
	lowerToUpperWithSpace,
	capitalizeFirstLetter,
} from "@support/regex-patterns";

/**
 * testFlow decorator to wrap Test Flow methods with Playwright's `test.step`.
 *
 * This decorator is intended for high-level Test Flow methods that represent
 * complete user journeys or business scenarios (e.g. deposit, withdrawal, onboarding).
 *
 * If a custom message is provided, it will be used as the flow step name.
 * Otherwise, a human-readable message will be generated automatically from
 * the method name.
 *
 * The step name will be prefixed with `FLOW:` to clearly distinguish test flows
 * from page-level steps in Playwright reports.
 *
 * ### Example usage:
 *
 * ```ts
 * @testFlow()
 * public async withdrawAsRegularUser() {
 *   // Produces: "FLOW: Withdraw as regular user"
 * }
 *
 * @testFlow("ETH withdrawal as VIP user")
 * public async withdrawAsVipUser() {
 *   // Produces: "FLOW: ETH withdrawal as VIP user"
 * }
 * ```
 *
 * @param message Optional custom flow step message.
 */
function testFlow(message?: string) {
	return function <This, Args extends unknown[], T>(
		originalMethod: (this: This, ...args: Args) => Promise<T>,
		context: ClassMethodDecoratorContext<This>,
	) {
		const flowMessage =
			message && message.trim()
				? message
				: generateFlowMessage(String(context.name));

		return async function (this: This, ...args: Args): Promise<T> {
			return test.step(`FLOW: ${flowMessage}`, () =>
				originalMethod.apply(this, args));
		};
	};
}

/**
 * Generates a human-readable flow message from a method name by:
 * - inserting spaces before capital letters
 * - converting the string to lowercase
 * - capitalizing the first letter
 *
 * @param methodName The original method name.
 * @returns A formatted flow message suitable for Playwright reports.
 */
function generateFlowMessage(methodName: string): string {
	return methodName
		.replace(lowerToUpperWithSpace, "$1 $2")
		.toLowerCase()
		.replace(capitalizeFirstLetter, (str) => str.toUpperCase());
}

export { testFlow };
