import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { PromoCodeModal } from "./promo-code-modal";
import { CasinoGameName } from "@enums/casino-game";
import { Delay } from "@enums/delay";

export class PromoCodeModalSteps extends BasePageStep<PromoCodeModal> {
	public constructor(page: PromoCodeModal) {
		super(page);
	}

	@step("Create default free spins promo code successfully")
	public async createDefaultFreeSpinsPromoCodeSuccessfully(
		campaignName: string,
		campaignCode: string,
		gameName = CasinoGameName.MYSTIC_CHIEF,
		freeSpinsAmount = 10,
	): Promise<void> {
		await this.gamdomPage.assertThat().isDisplayed();
		await this.gamdomPage.map.promoCodeTypeDropdown.click();
		await this.gamdomPage.map.promoCodeFreeSpinsType.click();
		await this.gamdomPage.fillPromoCodeFields(campaignName, campaignCode);
		await this.gamdomPage.selectGameToGiveFreeSpinsPromoCode(gameName);
		await this.gamdomPage.map.freeSpinsAmountInput.fill(
			freeSpinsAmount.toString(),
		);
		await this.gamdomPage.map.createPromoCodeButton.click({
			delay: Delay.EXTRA_SHORT,
		});
		await this.gamdomPage
			.assertThat()
			.verifyPromoCodeCreationToast(campaignName);
		await this.gamdomPage.assertThat().isNotDisplayed();
	}

	@step("Create default cash promo code successfully")
	public async createDefaultCashPromoCodeSuccessfully(
		campaignName: string,
		campaignCode: string,
	): Promise<void> {
		await this.gamdomPage.assertThat().isDisplayed();
		await this.gamdomPage.map.promoCodeTypeDropdown.click();
		await this.gamdomPage.map.promoCodeCashType.click();
		await this.gamdomPage.fillPromoCodeFields(campaignName, campaignCode);
		await this.gamdomPage.map.createPromoCodeButton.click({
			delay: Delay.EXTRA_SHORT,
		});
		await this.gamdomPage
			.assertThat()
			.verifyPromoCodeCreationToast(campaignName);
		await this.gamdomPage.assertThat().isNotDisplayed();
	}
}
