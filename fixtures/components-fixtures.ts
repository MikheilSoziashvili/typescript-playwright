import { test as base } from "@playwright/test";

import { Toast } from "@pages/components/toast/toast";
import { ToastV4 } from "@pages/components/toastV4/toast-v4";
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
	toastV4: ToastV4;
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
	toastV4: sessionAwarePage(ToastV4),
	chat: sessionAwarePage(Chat),
	footer: sessionAwarePage(Footer),
});
