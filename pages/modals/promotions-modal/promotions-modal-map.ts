import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class PromotionsModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get promotionsModalTitleInput(): Locator {
		return this.getInputField("title");
	}

	public get promotionsModalCustomUrlInput(): Locator {
		return this.getInputField("customUrl");
	}

	public get promotionsModalPriorityInput(): Locator {
		return this.getInputField("priority");
	}

	public get promotionsModalShortDescriptionInput(): Locator {
		return this.getInputField("subtitle");
	}

	public promotionsModalRichTextInputByLabelName(labelName: string): Locator {
		return this.page
			.locator("label", { hasText: labelName })
			.locator("..")
			.locator('div[role="textbox"] p');
	}

	public get promotionsModalDetailedDescriptionInput(): Locator {
		return this.promotionsModalRichTextInputByLabelName(
			"Detailed description",
		);
	}

	public get promotionsModalTermsAndConditionsInput(): Locator {
		return this.promotionsModalRichTextInputByLabelName(
			"Terms and conditions",
		);
	}

	public get promotionsModalHowToParticipateInput(): Locator {
		return this.promotionsModalRichTextInputByLabelName(
			"How to participate",
		);
	}

	public get promotionsModalPrizesDescriptionInput(): Locator {
		return this.promotionsModalRichTextInputByLabelName(
			"Prizes Description",
		);
	}

	public promotionsModalDropdownContainerByLabelName(
		labelName: string,
	): Locator {
		return this.page
			.locator(
				'xpath=//*[contains(@class, "PromotionForm")]/following-sibling::*[contains(@class, "StyledDropdown-sc-")]',
			)
			.filter({
				has: this.page.locator('[data-testid="Label"]', {
					hasText: labelName,
				}),
			});
	}

	public promotionsModalDropdownInputByLabelName(labelName: string): Locator {
		return this.promotionsModalDropdownContainerByLabelName(
			labelName,
		).locator(`//*[@data-testid="Input"]//*[@role="combobox"]`);
	}

	public get promotionsModalPromotionCategoryDropdown(): Locator {
		return this.promotionsModalDropdownInputByLabelName(
			"Promotion Category",
		);
	}

	public get promotionModalDropdownValuesContainer(): Locator {
		return this.page.locator(`ul[role='listbox'][class*='-list']`);
	}

	public promotionDropdownItemByPlaceholder(placeholder: string): Locator {
		return this.getDropdownOptionSelector(
			placeholder,
			this.promotionModalDropdownValuesContainer,
		);
	}

	public get promotionsModalPromotionSubCategoryDropdown(): Locator {
		return this.promotionsModalDropdownInputByLabelName(
			"Promotion Sub Category",
		);
	}

	private promotionsModalInputByLabelAndType(label: string, type: "date" | "time"): Locator {
		return this.page
			.locator(`label:has-text("${label}")`)
			.locator("..")
			.locator(`input[type="${type}"]`);
	}

	public get promotionsModalStartDateInput(): Locator {
		return this.promotionsModalInputByLabelAndType("Start Date", "date");
	}

	public get promotionsModalEndDateInput(): Locator {
		return this.promotionsModalInputByLabelAndType("End Date", "date");
	}

	public get promotionsModalStartTimeInput(): Locator {
		return this.promotionsModalInputByLabelAndType("Start Time", "time");
	}

	public get promotionsModalEndTimeInput(): Locator {
		return this.promotionsModalInputByLabelAndType("End Time", "time");
	}

	public get promotionsModalButtonTextInput(): Locator {
		return this.getInputField("buttonText");
	}

	public get promotionsModalButtonTextInputContainer(): Locator {
		return this.promotionsModalButtonTextInput.locator(
			"xpath=//parent::div",
		);
	}

	public get promotionsModalButtonLinkInput(): Locator {
		return this.getInputField("buttonLink");
	}

	public get promotionsModalIsForVipDropdown(): Locator {
		return this.promotionsModalDropdownInputByLabelName("Is For VIP");
	}

	public promotionsModalImageUploaderContainerByLabelName(
		labelName: string,
	): Locator {
		return this.page.locator(`[class*='UploadFileWrapper-sc-']`, {
			hasText: labelName,
		});
	}

	public promotionsModalCoverImageUploader(): Locator {
		return this.promotionsModalFileInputByLabelName("Cover Image");
	}

	public promotionsModalThumbnailImageUploader(): Locator {
		return this.promotionsModalFileInputByLabelName("Thumbnail Image");
	}

	public promotionsModalFileInputByLabelName(labelName: string): Locator {
		return this.promotionsModalImageUploaderContainerByLabelName(
			labelName,
		).locator(`input[type="file"]`);
	}

	public get promotionsModalSaveButton(): Locator {
		return this.page.locator(`button[type="submit"]`, {
			hasText: "Save",
		});
	}

	public get confirmDeletePromotionModal(): Locator {
		return this.page.locator(`[role="dialog"]`, {
			hasText: "Confirm Delete",
		});
	}

	public get confirmDeletePromotionButton(): Locator {
		return this.confirmDeletePromotionModal.locator(`button`, {
			hasText: "Delete",
		});
	}
}
