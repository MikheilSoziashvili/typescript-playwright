import { BaseAsserter } from "@base/base-asserter";
import { Timeout } from "@enums/timeout";
import { VipManagerAdminPage } from "./vip-manager-page";
import { step } from "decorators/step";

export class VipManagerAdminPageAsserter extends BaseAsserter<VipManagerAdminPage> {
	public constructor(page: VipManagerAdminPage) {
		super(page);
	}

	@step(`Check 'Vip Manager' main blocks are visible`)
	async pageMainBlocksAreVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[
				this.gamdomPage.map.vipPlayersBlock,
				this.gamdomPage.map.addVipPlayerStatusBlock,
				this.gamdomPage.map.changeTelegramNotificationSettingsBlock,
			],
			Timeout.MAX,
		);
	}

	@step()
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

	@step()
	public async checkSendNotificationSectionPresence(
		isVisible: boolean,
	): Promise<void> {
		isVisible
			? await this.checkElementsAreVisible([
					this.gamdomPage.map.sendUserNotificationBlock,
			  ])
			: await this.checkElementsAreNotVisible([
					this.gamdomPage.map.sendUserNotificationBlock,
			  ]);
	}
}
