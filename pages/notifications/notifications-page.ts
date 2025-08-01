import { Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { NOTIFICATIONS_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { NotificationsPageMap } from "./notifications-page-map";
import { NotificationsPageSteps } from "./notifications-page-steps";
import { NotificationsPageAsserter } from "./notifications-page-asserter";
import { Notification } from "@pages/components/notification/notification";

export class NotificationsPage extends BasePage<NotificationsPageMap> {
	private readonly notification: Notification;

	public constructor(page: Page) {
		super(page, new NotificationsPageMap(page));
		this.notification = new Notification(page);
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [NOTIFICATIONS_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): NotificationsPageAsserter {
		return new NotificationsPageAsserter(this);
	}

	public steps(): NotificationsPageSteps {
		return new NotificationsPageSteps(this);
	}

	public getNotification(): Notification {
		return this.notification;
	}
}
