import { test as base } from "@playwright/test";

import { Toast } from "@pages/components/toast/toast";
import { Chat } from "@pages/components/chat/chat";
import { Notification } from "@components/notification/notification";
import { Footer } from "@pages/components/footer/footer";

export type Components = {
	notifications: Notification;
	toast: Toast;
	chat: Chat;
	footer: Footer;
};

export const componentsFixtures = base.extend<Components>({
	notifications: async ({ page }, use) => {
		await use(new Notification(page));
	},
	toast: async ({ page }, use) => {
		await use(new Toast(page));
	},
	chat: async ({ page }, use) => {
		await use(new Chat(page));
	},
	footer: async ({ page }, use) => {
		await use(new Footer(page));
	},
});
