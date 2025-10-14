import { test as base } from "@playwright/test";
import { ClientApiInitListener } from "@core/api/network-listeners/client-api-token-listener";

export type ApiNetworkListeners = {
	clientApiInitListener: ClientApiInitListener;
};

export const apiNetworkListenersFixtures = base.extend<ApiNetworkListeners>({
	clientApiInitListener: async ({ page }, use) => {
		const listener = new ClientApiInitListener(page);
		await use(listener);
	},
});
