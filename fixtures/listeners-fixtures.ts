import { BrowserSessionManager } from "@core/browser-session-mngmt";
import { ErrorConsoleAsserter } from "@core/listeners/console-listener/error-console-asserter";
import { ErrorConsoleListener } from "@core/listeners/console-listener/error-console-listener";
import { ClientApiInitListener } from "@core/listeners/network-listener/client-api-token-listener";
import { HourlyCryptoBalancesListener } from "@core/listeners/network-listener/hourly-crypto-balances-listener";
import { test as base } from "@playwright/test";

export type Listeners = {
	browserSessionManager: BrowserSessionManager;
	errorConsoleListener: ErrorConsoleListener;
	clientApiInitListener: ClientApiInitListener;
	hourlyCryptoBalancesListener: HourlyCryptoBalancesListener;
	errorConsoleAsserter: ErrorConsoleAsserter;
};

export const listenersFixtures = base.extend<Listeners>({
	browserSessionManager: async ({ browser, context, page }, use) => {
		const manager = new BrowserSessionManager(browser, context, page);
		await use(manager);
		await manager.cleanup();
	},
	errorConsoleListener: async ({ page }, use) => {
		const listener = new ErrorConsoleListener(page);
		await use(listener);
	},
	clientApiInitListener: async ({ page }, use) => {
		const listener = new ClientApiInitListener(page);
		await use(listener);
	},
	hourlyCryptoBalancesListener: async ({ browserSessionManager }, use) => {
		const page = browserSessionManager.active.page;
		const listener = new HourlyCryptoBalancesListener(page);
		await use(listener);
	},
	errorConsoleAsserter: async ({ errorConsoleListener }, use) => {
		const asserter = new ErrorConsoleAsserter(errorConsoleListener);
		await use(asserter);
	},
});
