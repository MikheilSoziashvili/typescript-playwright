import { PromotionTestData } from "@dtos/test-data";
import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { PromotionsModalAsserter } from "./promotions-modal-asserter";
import { PromotionsModalMap } from "./promotions-modal-map";
import { PromotionsModalSteps } from "./promotions-modal-steps";

// TODO: Technically, this is no longer a modal, but a form. Consider renaming/moving steps, map and asserter.
export class PromotionsModal extends BasePage<PromotionsModalMap> {
	constructor(page: Page) {
		super(page, new PromotionsModalMap(page));
	}

	public steps(): PromotionsModalSteps {
		return new PromotionsModalSteps(this);
	}

	public assertThat(): PromotionsModalAsserter {
		return new PromotionsModalAsserter(this);
	}

	@step("Fill promotions modal fields")
	public async fillPromotionsModalFields(
		promotionTestData: PromotionTestData,
	): Promise<void> {
		await this.map.promotionsModalTitleInput.clear();
		await this.map.promotionsModalTitleInput.fill(promotionTestData.title);
		await this.map.promotionsModalCustomUrlInput.fill(
			promotionTestData.customUrl,
		);
		await this.map.promotionsModalPriorityInput.fill(
			promotionTestData.priority.toString(),
		);
		await this.map.promotionsModalShortDescriptionInput.fill(
			promotionTestData.shortDescription,
		);
		await this.map.promotionsModalDetailedDescriptionInput.fill(
			promotionTestData.detailedDescription,
		);
		await this.map.promotionsModalTermsAndConditionsInput.fill(
			promotionTestData.termsAndConditions,
		);
		await this.map.promotionsModalHowToParticipateInput.fill(
			promotionTestData.howToParticipate,
		);
		await this.map.promotionsModalPrizesDescriptionInput.fill(
			promotionTestData.prizesDescription,
		);
		await this.fillPromotionButtonTextInput(promotionTestData.buttonText);

		await this.map.promotionsModalButtonLinkInput.fill(
			promotionTestData.buttonLink,
		);
		await this.selectPromotionCategory(promotionTestData.promotionCategory);
		await this.selectPromotionSubCategory(
			promotionTestData.promotionSubCategory,
		);
		await this.selectStartAndEndDateAndTime(
			promotionTestData.promotionStartDate,
			promotionTestData.promotionEndDate,
			promotionTestData.promotionStartTime,
			promotionTestData.promotionEndTime,
		);
		await this.selectIsForVip(promotionTestData.isForVip);
		await this.uploadCoverImage(promotionTestData.coverImage);
		await this.uploadThumbnailImage(promotionTestData.thumbnailImage);
	}

	@step("Select promotion category")
	public async selectPromotionCategory(category: string): Promise<void> {
		await this.map.promotionsModalPromotionCategoryDropdown.click();
		await this.map.getDropdownOption(category).click();
	}

	@step("Select promotion sub category")
	public async selectPromotionSubCategory(
		subCategory: string,
	): Promise<void> {
		await this.map.promotionsModalPromotionSubCategoryDropdown.click();
		await this.map.getDropdownOption(subCategory).click();
	}

	@step("Select start and end date and time")
	public async selectStartAndEndDateAndTime(
		startDate?: string,
		endDate?: string,
		startTime?: string,
		endTime?: string,
	): Promise<void> {
		const fields: [
			string | undefined,
			{ fill: (value: string) => Promise<void> },
		][] = [
			[startDate, this.map.promotionsModalStartDateInput],
			[startTime, this.map.promotionsModalStartTimeInput],
			[endDate, this.map.promotionsModalEndDateInput],
			[endTime, this.map.promotionsModalEndTimeInput],
		];
		for (const [value, locator] of fields) {
			if (value !== undefined) {
				await locator.fill(value);
			}
		}
	}

	@step("Select is for VIP")
	public async selectIsForVip(isForVip: string): Promise<void> {
		await this.map.promotionsModalIsForVipDropdown.click();
		await this.map.promotionDropdownItemByPlaceholder(isForVip).click();
	}

	@step("Upload cover image")
	public async uploadCoverImage(imagePath: string): Promise<void> {
		await this.map
			.promotionsModalCoverImageUploader()
			.setInputFiles(imagePath);
	}

	@step("Upload thumbnail image")
	public async uploadThumbnailImage(imagePath: string): Promise<void> {
		await this.map
			.promotionsModalThumbnailImageUploader()
			.setInputFiles(imagePath);
	}

	@step("Click save button")
	public async clickSaveButton(): Promise<void> {
		await this.map.promotionsModalSaveButton.click();
	}

	@step("Fill in button text input")
	public async fillPromotionButtonTextInput(
		buttonText: string,
	): Promise<void> {
		await this.map.promotionsModalButtonTextInput.fill(buttonText);
	}

	@step("Click delete promotion button")
	public async clickDeletePromotionButton(): Promise<void> {
		await this.map.confirmDeletePromotionButton.click();
	}
}
