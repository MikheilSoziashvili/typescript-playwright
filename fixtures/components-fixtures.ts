import { test as base } from "@playwright/test";

import { Toast } from "@pages/components/toast/toast";
import { Chat } from "@pages/components/chat/chat";
import { Notification } from "@components/notification/notification";
import { Footer } from "@pages/components/footer/footer";
import {
	BrowserSessionManager,
	sessionAwarePage,
} from "@core/browser-session-mngmt";

export type Components = {
	browserSessionManager: BrowserSessionManager;
	notifications: Notification;
	toast: Toast;
	chat: Chat;
	footer: Footer;
};

export const componentsFixtures = base.extend<Components>({
	browserSessionManager: async ({ browser, context, page }, use) => {
		const manager = new BrowserSessionManager(browser, context, page);
		await use(manager);
		await manager.cleanup();
	},
	notifications: sessionAwarePage(Notification),
	toast: sessionAwarePage(Toast),
	chat: sessionAwarePage(Chat),
	footer: sessionAwarePage(Footer),
});
