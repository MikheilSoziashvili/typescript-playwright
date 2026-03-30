import { test as base } from "@playwright/test";

import { Notification } from "@components/notification/notification";
import {
	BrowserSessionManager,
	sessionAwarePage,
} from "@core/browser-session-mngmt";
import { Chat } from "@pages/components/chat/chat";
import { Footer } from "@pages/components/footer/footer";
import { Toast } from "@pages/components/toast/toast";
import { WagerRequirementPopup } from "@pages/components/wager-requirement-popup/wager-requirement-popup";

export type Components = {
	browserSessionManager: BrowserSessionManager;
	notifications: Notification;
	toast: Toast;
	chat: Chat;
	footer: Footer;
	wagerRequirementPopup: WagerRequirementPopup;
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
	wagerRequirementPopup: sessionAwarePage(WagerRequirementPopup),
});
