import { BaseAsserter } from "@base/base-asserter";
import { NotificationsPage } from "./notifications-page";
import { step } from "decorators/step";

export class NotificationsPageAsserter extends BaseAsserter<NotificationsPage> {
	public constructor(page: NotificationsPage) {
		super(page);
	}

	@step("Assert notification is visible")
	public async notificationIsVisible(title: string): Promise<void> {
		await this.gamdomPage.expandNotification(title);
		const titleLocator = this.gamdomPage.map.getNotificationTitle(title);
		const descriptionLocator =
			this.gamdomPage.map.getNotificationDescription(title);

		await this.checkElementsAreVisible([titleLocator, descriptionLocator]);
	}

	@step("Assert notification has correct title and description")
	public async notificationHasCorrectContent(
		title: string,
		description: string,
	): Promise<void> {
		await this.gamdomPage.expandNotification(title);
		const titleLocator = this.gamdomPage.map.getNotificationTitle(title);
		const descriptionLocator =
			this.gamdomPage.map.getNotificationDescription(title);

		await this.checkElementsHaveText([
			{ locator: titleLocator, expectedText: title },
			{ locator: descriptionLocator, expectedText: description },
		]);
	}

	@step("Assert notification is visible and has correct content")
	public async notificationVisibleAndHasTitleAndDescription(
		title: string,
		description: string,
	): Promise<void> {
		await this.notificationIsVisible(title);
		await this.notificationHasCorrectContent(title, description);
	}
}
