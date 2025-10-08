import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { BulkActionsAdminAsserter } from "./bulk-actions-admin-page-asserter";
import { BulkActionsAdminMap } from "./bulk-actions-admin-page-map";
import { BulkActionsAdminSteps } from "./bulk-actions-admin-page-steps";
import { ADMIN_BULK_ACTIONS_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { step } from "decorators/step";

export class BulkActionsAdminPage extends BasePage<BulkActionsAdminMap> {
	public constructor(page: Page) {
		super(page, new BulkActionsAdminMap(page));
	}

	public override assertThat(): BulkActionsAdminAsserter {
		return new BulkActionsAdminAsserter(this);
	}

	public steps(): BulkActionsAdminSteps {
		return new BulkActionsAdminSteps(this);
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [ADMIN_BULK_ACTIONS_PAGE_ENDPOINT] },
		});
	}

	@step("Go to Notifications tab")
	public async goToNotificationsTab(): Promise<void> {
		await this.map.notificationsTab.click();
	}

	@step("Navigate and go to Notifications tab")
	public async navigateAndGoToNotificationsTab(): Promise<void> {
		await this.navigate();
		await this.goToNotificationsTab();
	}

	@step("Fill user IDs that will receive the notification")
	public async fillUserIds(userIds: string[]): Promise<void> {
		const userIdsText = userIds.join("\n");
		await this.map.userIdsTextarea.fill(userIdsText);
	}

	@step("Fill notification title")
	public async fillNotificationTitle(title: string): Promise<void> {
		await this.map.notificationTitleInput.fill(title);
	}

	@step("Fill notification description")
	public async fillNotificationDescription(
		description: string,
	): Promise<void> {
		await this.map.notificationDescriptionInput.fill(description);
	}

	@step("Click Process Notifications button")
	public async clickProcessNotificationsButton(): Promise<void> {
		await this.map.processNotificationsButton.click();
	}

	@step("Go to Tip tab")
	public async goToTipTab(): Promise<void> {
		await this.map.tipTab.click();
	}

	@step("Navigate and go to Tip tab")
	public async navigateAndGoToTipTab(): Promise<void> {
		await this.navigate();
		await this.goToTipTab();
	}

	@step("Bulk tip file upload")
	public async bulkTipFileUpload(filePath: string): Promise<void> {
		await this.map.inputBulkTipFile.setInputFiles(filePath);
	}

	@step("Select tip reason")
	public async selectTipReason(optionLabel: string): Promise<void> {
		await this.map.tipReasonDropdown.click();
		await this.map.tipReasonOption(optionLabel).click();
	}

	@step("Click Process Tips button")
	public async clickProcessTipsButton(): Promise<void> {
		this.acceptDialog();
		await this.map.processTipsButton.click();
	}
}
