import { BasePage } from "@base/base-page";
import { VIP_MANAGER_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Page } from "@playwright/test";
import { VipManagerAdminPageAsserter } from "./vip-manager-page-asserter";
import { VipManagerAdminPageMap } from "./vip-manager-page-map";
import { VipManagerAdminPageSteps } from "./vip-manager-page-steps";

export class VipManagerAdminPage extends BasePage<VipManagerAdminPageMap> {
	public constructor(page: Page) {
		super(page, new VipManagerAdminPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [VIP_MANAGER_ADMIN_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): VipManagerAdminPageAsserter {
		return new VipManagerAdminPageAsserter(this);
	}

	public steps(): VipManagerAdminPageSteps {
		return new VipManagerAdminPageSteps(this);
	}

	public async updateRemoveBatchVipPlayersSendFile(
		filePath: string,
	): Promise<void> {
		await this.map.inputFileUpdateRemoveBatchVipPlayers.setInputFiles(
			filePath,
		);
	}

	public async uploadUpdateRemoveBatchVipPlayersFile(): Promise<void> {
		await this.map.uploadBatchUpdateVipPlayersStatusFileButton.click();
	}

	public async clickAddVipStatusButton(): Promise<void> {
		await this.map.addVipStatusButton.click();
	}

	public async clickBatchUpdateButton(): Promise<void> {
		await this.map.batchUpdateButton.click();
	}

	public async clickChangeTelegramSettingsButton(): Promise<void> {
		await this.map.changeTelegramNotificationSettingsBlock.click();
	}
}
