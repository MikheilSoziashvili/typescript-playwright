import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { PromotionsModal } from "./promotions-modal";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { expect } from "@playwright/test";
import { AttributesValues } from "@enums/playwright/htmlAttributesValues";

export class PromotionsModalAsserter extends BaseAsserter<PromotionsModal> {
	public constructor(page: PromotionsModal) {
		super(page);
	}

	@step("Promotions modal is displayed")
	public async modalIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.promotionsModalContainer,
		]);
	}

	@step("Promotions modal is not displayed")
	public async modalIsNotDisplayed(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.promotionsModalContainer,
		]);
	}

	@step("Verify promotion button text input error message presence")
	public async promotionButtonTextInputErrorMessagePresence(
		expectedPresence: boolean,
	): Promise<void> {
		const buttonClassAttribute =
			await this.gamdomPage.map.promotionsModalButtonTextInputContainer.getAttribute(
				Attributes.CLASS,
			);
		const isErrorMessagePresent = buttonClassAttribute?.includes(
			AttributesValues.ERROR,
		) ?? false;
		expect(isErrorMessagePresent).toBe(expectedPresence);
	}

	@step("Verify promotion delete confirmation modal is displayed")
	public async promotionDeleteConfirmationModalIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.confirmDeletePromotionModal,
		]);
	}

	@step("Verify promotion delete confirmation modal is not displayed")
	public async promotionDeleteConfirmationModalIsNotDisplayed(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.confirmDeletePromotionModal,
		]);
	}
}
