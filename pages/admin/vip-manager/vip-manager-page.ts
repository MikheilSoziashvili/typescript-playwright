import { BasePage } from "@base/base-page";
import { VIP_MANAGER_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { step } from "decorators/step";
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

	@step("Update/remove batch VIP players send file")
	public async updateRemoveBatchVipPlayersSendFile(
		filePath: string,
	): Promise<void> {
		await this.map.inputFileUpdateRemoveBatchVipPlayers.setInputFiles(
			filePath,
		);
	}

	@step("Upload update/remove batch VIP players file")
	public async uploadUpdateRemoveBatchVipPlayersFile(): Promise<void> {
		await this.map.uploadBatchUpdateVipPlayersStatusFileButton.click();
	}

	@step("Click add VIP status button")
	public async clickAddVipStatusButton(): Promise<void> {
		await this.map.addVipStatusButton.click();
	}

	@step("Click batch update button")
	public async clickBatchUpdateButton(): Promise<void> {
		await this.map.batchUpdateButton.click();
	}

	@step("Click change telegram settings button")
	public async clickChangeTelegramSettingsButton(): Promise<void> {
		await this.map.changeTelegramNotificationSettingsBlock.click();
	}
}
