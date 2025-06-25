import { BaseAsserter } from "@base/base-asserter";
import { Timeout } from "@enums/timeout";
import { VipManagerAdminPage } from "./vip-manager-page";
import { step } from "decorators/step";
import { expect } from "@playwright/test";

export class VipManagerAdminPageAsserter extends BaseAsserter<VipManagerAdminPage> {
	public constructor(page: VipManagerAdminPage) {
		super(page);
	}

	@step(`Check 'Vip Manager' main blocks are visible`)
	async pageMainBlocksAreVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[
				this.gamdomPage.map.vipManagerPageContent,
				this.gamdomPage.map.vipManagerPageTitle,
				this.gamdomPage.map.vipPlayersBlock,
				this.gamdomPage.map.vipManagerActionButtonsContainer,
			],
			Timeout.MAX,
		);
	}

	@step("Verify 'Batch Update VIP Players Status' elements visibility")
	public async verifyBatchUpdateVipPlayersStatusElements(
		withAccess: boolean,
	): Promise<void> {
		const commonElements = [
			this.gamdomPage.map.batchUpdateVipPlayersStatusBlock,
		];

		const accessElements = withAccess
			? [
					this.gamdomPage.map.inputBatchUpdateVipPlayersStatus,
					this.gamdomPage.map
						.uploadBatchUpdateVipPlayersStatusFileButton,
			  ]
			: [
					this.gamdomPage.map
						.batchUpdateVipPlayersStatusAccessDeniedBlock,
			  ];

		const elementsToCheck = [...commonElements, ...accessElements];
		await this.checkElementsAreVisible(elementsToCheck);
	}

	@step("Check send notification section presence")
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

	@step("Verify upload files button is disabled")
	public async verifyUploadFilesButtonIsDisabled(): Promise<void> {
		await expect(
			this.gamdomPage.map.uploadBatchUpdateVipPlayersStatusFileButton,
		).toBeDisabled();
	}
}
