import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { GiftCardsAdminPage } from "./gift-cards-admin-page";

export class GiftCardsAdminSteps extends BasePageStep<GiftCardsAdminPage> {
	public constructor(page: GiftCardsAdminPage) {
		super(page);
	}

	@step("Select value from gift card generator dropdown")
	public async selectValueFromGiftCardGeneratorDropdownValues(
		dropdownValue: string,
	): Promise<void> {
		await this.gamdomPage.map.giftCardGeneratorValueDropdown.click();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([this.gamdomPage.map.dropdownContainer]);
		await this.gamdomPage.map
			.giftCardValueDropdownValue(dropdownValue)
			.click();
	}

	@step("Select quantity from gift card generator dropdown")
	public async selectQuantityFromGiftCardGeneratorDropdownValues(
		quantity: string,
	): Promise<void> {
		await this.gamdomPage.map.giftCardGeneratorQuantityDropdown.click();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([this.gamdomPage.map.dropdownContainer]);
		await this.gamdomPage.map
			.giftCardQuantityDropdownValue(quantity)
			.click();
	}

	@step("Generate gift card from generator")
	public async generateGiftCardFromGenerator(
		value: string,
		quantity: string,
	): Promise<void> {
		await this.selectValueFromGiftCardGeneratorDropdownValues(value);
		await this.selectQuantityFromGiftCardGeneratorDropdownValues(quantity);
		await this.gamdomPage.map.generateAndDownloadButton.click();
	}

	@step("Navigate and generate gift card with 2FA flow")
	public async navigateAndGenerateGiftCardWith2FaFlow(
		value: string,
		quantity: string,
		qrCode2FAImagePath: string,
	): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.assertThat().pageElementsAreVisible();
		await this.generateGiftCardFromGenerator(value, quantity);
		await this.gamdomPage.twoFactorAuthModal
			.steps()
			.generateAndEnter2FaCodeSuccessfully(qrCode2FAImagePath);
	}
}
