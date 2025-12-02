import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class SportsBlogModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get articleModalTitleInput(): Locator {
		return this.getInputField("title");
	}

	public get articleModalCustomUrlInput(): Locator {
		return this.getInputField("customUrl");
	}

	public get articleModalSubtitleInput(): Locator {
		return this.getInputField("subtitle");
	}

	public articleModalRichTextInputByLabelName(labelName: string): Locator {
		return this.page
			.locator("label", { hasText: labelName })
			.locator("..")
			.locator('div[role="textbox"] p');
	}

	public get articleModalDetailedDescriptionInput(): Locator {
		return this.articleModalRichTextInputByLabelName(
			"Detailed description",
		);
	}

	public get articleModalAuthorInput(): Locator {
		return this.getInputField("author");
	}

	private articleModalInputByLabelAndType(
		label: string,
		type: "date" | "time",
	): Locator {
		return this.page
			.locator(`label:has-text("${label}")`)
			.locator("..")
			.locator(`input[type="${type}"]`);
	}

	public get articleModalStartDateInput(): Locator {
		return this.articleModalInputByLabelAndType("Start Date", "date");
	}

	public get articleModalStartTimeInput(): Locator {
		return this.articleModalInputByLabelAndType("Start Time", "time");
	}

	public articleModalImageUploaderContainerByLabelName(
		labelName: string,
	): Locator {
		return this.page.locator(`[class*='UploadFileWrapper-sc-']`, {
			hasText: labelName,
		});
	}

	public articleModalCoverImageUploader(): Locator {
		return this.articleModalFileInputByLabelName("Cover Image");
	}

	public articleModalThumbnailImageUploader(): Locator {
		return this.articleModalFileInputByLabelName("Thumbnail Image");
	}

	public articleModalFileInputByLabelName(labelName: string): Locator {
		return this.articleModalImageUploaderContainerByLabelName(
			labelName,
		).locator(`input[type="file"]`);
	}

	public get articleModalSaveButton(): Locator {
		return this.page.locator(`button[type="submit"]`, {
			hasText: "Save",
		});
	}
}
