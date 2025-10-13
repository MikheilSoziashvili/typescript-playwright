import { BasePageStep } from "@pages/base/base-page-step";
import { PromotionsModal } from "./promotions-modal";
import { step } from "decorators/step";
import { PromotionTestData } from "@dtos/test-data";

export class PromotionsModalSteps extends BasePageStep<PromotionsModal> {
	public constructor(page: PromotionsModal) {
		super(page);
	}

	@step(
		"Fill in promotion button text input and verify error message presence",
	)
	public async fillPromotionButtonTextInputAndVerifyErrorMessagePresence(
		buttonText: string,
		expectedPresence: boolean,
	): Promise<void> {
		await this.gamdomPage.fillPromotionButtonTextInput(buttonText);
		await this.gamdomPage.pressTabKeyboard();
		await this.gamdomPage
			.assertThat()
			.promotionButtonTextInputErrorMessagePresence(expectedPresence);
	}

	@step("Delete promotion successfully")
	public async deletePromotionSuccessfully(): Promise<void> {
		await this.gamdomPage
			.assertThat()
			.promotionDeleteConfirmationModalIsDisplayed();
		await this.gamdomPage.clickDeletePromotionButton();
		await this.gamdomPage
			.assertThat()
			.promotionDeleteConfirmationModalIsNotDisplayed();
	}

	@step("Fill promotion successfully")
	public async fillPromotionSuccessfully(
		promotionTestData: PromotionTestData,
	): Promise<void> {
		await this.gamdomPage.fillPromotionsModalFields(promotionTestData);
		await this.gamdomPage.clickSaveButton();
	}
}
