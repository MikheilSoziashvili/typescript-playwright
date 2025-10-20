import { ErrorConsoleAsserter } from "@core/listeners/console-listener/error-console-asserter";
import { ErrorConsoleListener } from "@core/listeners/console-listener/error-console-listener";
import { ClientApiInitListener } from "@core/listeners/network-listener/client-api-token-listener";
import { test as base } from "@playwright/test";

export type Listeners = {
	errorConsoleListener: ErrorConsoleListener;
	clientApiInitListener: ClientApiInitListener;
	errorConsoleAsserter: ErrorConsoleAsserter;
};

export const listenersFixtures = base.extend<Listeners>({
	errorConsoleListener: async ({ page }, use) => {
		const listener = new ErrorConsoleListener(page);
		await use(listener);
	},
	clientApiInitListener: async ({ page }, use) => {
		const listener = new ClientApiInitListener(page);
		await use(listener);
	},
	errorConsoleAsserter: async ({ errorConsoleListener }, use) => {
		const asserter = new ErrorConsoleAsserter(errorConsoleListener);
		await use(asserter);
	},
});
