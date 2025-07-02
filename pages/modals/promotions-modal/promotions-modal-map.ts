import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class PromotionsModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get promotionsModalContainer(): Locator {
		return this.page.getByTestId(`modalContainer`);
	}

	public get promotionsModalHeader(): Locator {
		return this.promotionsModalContainer.getByTestId(`modalHeader`);
	}

	public get promotionsModalBody(): Locator {
		return this.promotionsModalContainer.getByTestId(`modalBody`);
	}

	public get promotionsModalTitleInput(): Locator {
		return this.getInputField("title", this.promotionsModalBody);
	}

	public get promotionsModalCustomUrlInput(): Locator {
		return this.getInputField("customUrl", this.promotionsModalBody);
	}

	public get promotionsModalPriorityInput(): Locator {
		return this.getInputField("priority", this.promotionsModalBody);
	}

	public get promotionsModalShortDescriptionInput(): Locator {
		return this.getInputField("subtitle", this.promotionsModalBody);
	}

	public promotionsModalRichTextInputByLabelName(labelName: string): Locator {
		return this.page
			.locator('label', { hasText: labelName })
			.locator('..')
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
		return this.promotionsModalBody
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

	public get promotionsModalButtonTextInput(): Locator {
		return this.getInputField("buttonText", this.promotionsModalBody);
	}

	public get promotionsModalButtonLinkInput(): Locator {
		return this.getInputField("buttonLink", this.promotionsModalBody);
	}

	public get promotionsModalIsForVipDropdown(): Locator {
		return this.promotionsModalDropdownInputByLabelName("Is For VIP");
	}

	public promotionsModalImageUploaderContainerByLabelName(
		labelName: string,
	): Locator {
		return this.promotionsModalBody.locator(
			`[class*='UploadFileWrapper-sc-']`,
			{
				hasText: labelName,
			},
		);
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
		return this.promotionsModalBody.locator(`button[type="submit"]`, {
			hasText: "Save",
		});
	}
}
