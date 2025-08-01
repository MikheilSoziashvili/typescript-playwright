import { BasePageStep } from "@pages/base/base-page-step";
import { NotificationsPage } from "./notifications-page";

export class NotificationsPageSteps extends BasePageStep<NotificationsPage> {
	public constructor(gamdomPage: NotificationsPage) {
		super(gamdomPage);
	}
}
