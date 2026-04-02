import { ApiEndpoints } from "@enums/api-endpoints";
import { BasePageStep } from "@pages/base/base-page-step";
import { expect } from "@playwright/test";
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

	@step("Navigate, generate gift card with 2FA flow and return first code")
	public async navigateAndGenerateGiftCardWith2FaFlowAndGetFirstCode(
		value: string,
		quantity: string,
		qrCode2FAImagePath: string,
	): Promise<string> {
		const responsePromise = this.gamdomPage.page.waitForResponse((response) =>
			response.url().includes(ApiEndpoints.GENERATE_GIFT_CARD),
		);
		this.gamdomPage.acceptDialog();
		await this.navigateAndGenerateGiftCardWith2FaFlow(
			value,
			quantity,
			qrCode2FAImagePath,
		);
		const body = (await (await responsePromise).json()) as {
			content: { key: string }[];
		};
		const key = body.content[0]?.key;
		expect(key, "No gift card key found in generateGiftCard response").toBeDefined();
		return key;
	}
}
