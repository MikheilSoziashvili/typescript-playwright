import { BasePageStep } from "@pages/base/base-page-step";
import { InfoAdminPage } from "./info-admin-page";

export class InfoAdminPageSteps extends BasePageStep<InfoAdminPage> {
	public constructor(gamdomPage: InfoAdminPage) {
		super(gamdomPage);
	}

	public async banUser(options?: { reason?: string }): Promise<void> {
		await this.gamdomPage.map.waitForVisibility({
			locator: this.gamdomPage.map.banUserContainer,
		});
		if (options?.reason) {
			await this.gamdomPage.map.banUserInput.fill(options.reason);
		}
		await this.gamdomPage.map.banUserButton.click();
		await this.gamdomPage.assertThat().isUserBanned();
		await this.gamdomPage.assertThat().isUnbanButtonDisplayed();
	}

	public async tipUser(tipAmount: number): Promise<void> {
		await this.gamdomPage.assertThat().isTipUserContainerDisplayed();
		await this.gamdomPage.map.tipAmountInput.clear();
		await this.gamdomPage.map.tipAmountInput.fill(tipAmount.toString());
		await this.gamdomPage.map.tipButton.click();
	}

	public async tipUserWith2FaFlow(
		tipAmount: number,
		qrCode2FAImagePath: string,
	): Promise<void> {
		await this.tipUser(tipAmount);
		await this.gamdomPage.twoFactorAuthModal
			.steps()
			.generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
	}
}
