import { BaseAsserter } from "@base/base-asserter";
import { Timeout } from "@enums/timeout";
import { VipManagerAdminPage } from "./vip-manager-page";

export class VipManagerAdminPageAsserter extends BaseAsserter<VipManagerAdminPage> {
	public constructor(page: VipManagerAdminPage) {
		super(page);
	}

	async pageMainBlocksAreVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[
				this.gamdomPage.map.vipPlayersBlock,
				this.gamdomPage.map.sendUserNotificationBlock,
				this.gamdomPage.map.addVipPlayerStatusBlock,
				this.gamdomPage.map.changeTelegramNotificationSettingsBlock,
			],
			Timeout.MAX,
		);
	}

	public async checkBatchUpdateVipPlayersStatusElements(
		isVisible: boolean,
	): Promise<void> {
		const elements = [
			this.gamdomPage.map.batchUpdateVipPlayersStatusBlock,
			this.gamdomPage.map.inputBatchUpdateVipPlayersStatus,
			this.gamdomPage.map.uploadBatchUpdateVipPlayersStatusFileButton,
		];

		isVisible
			? await this.checkElementsAreVisible(elements)
			: await this.checkElementsAreNotVisible(elements);
	}
}
