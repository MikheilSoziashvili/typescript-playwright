import { BasePageStep } from "@pages/base/base-page-step";
import { BulkActionsAdminPage } from "./bulk-actions-admin-page";
import { step } from "decorators/step";

export class BulkActionsAdminSteps extends BasePageStep<BulkActionsAdminPage> {
	public constructor(page: BulkActionsAdminPage) {
		super(page);
	}

	@step("Send notification to multiple users")
	public async sendNotificationToMultipleUsers(
		userIds: string[],
		title: string,
		description: string,
	): Promise<void> {
		await this.gamdomPage.fillUserIds(userIds);
		await this.gamdomPage.assertThat().sendNotificationButtonIsDisabled();
		await this.gamdomPage.fillNotificationTitle(title);
		await this.gamdomPage.assertThat().sendNotificationButtonIsDisabled();
		await this.gamdomPage.fillNotificationDescription(description);
		await this.gamdomPage.assertThat().sendNotificationButtonIsEnabled();
		this.gamdomPage.acceptDialog();
		await this.gamdomPage.clickProcessNotificationsButton();
	}
}
