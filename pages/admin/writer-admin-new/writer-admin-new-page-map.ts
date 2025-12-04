import { BaseMap } from "@base/base-map";
import { BlogImageUploadButton } from "@enums/admin/blog-image-upload-buttons";
import { Locator, Page } from "@playwright/test";

export class WriterAdminNewPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get createBlogButton(): Locator {
		return this.page.getByText("Create new blog");
	}

	public get uploadCoverImageButton(): Locator {
		return this.page.locator(
			`[class*="NewBlogAdmin-styled__ImageUploadContainer"] label:text("${BlogImageUploadButton.UPLOAD_COVER}")`,
		);
	}

	public get uploadThumbnailImageButton(): Locator {
		return this.page.locator(
			`[class*="NewBlogAdmin-styled__ImageUploadContainer"] label:text("${BlogImageUploadButton.UPLOAD_THUMBNAIL}")`,
		);
	}

	public get uploadCoverInput(): Locator {
		return this.fileInput(this.uploadCoverImageButton);
	}

	public get uploadThumbnailInput(): Locator {
		return this.fileInput(this.uploadThumbnailImageButton);
	}

	public previewImage(label: string, isPlaceholder: boolean): Locator {
		const base = this.page
			.locator(`h6:text("${label}")`)
			.locator(
				'xpath=following-sibling::*[contains(@class, "NewBlogAdmin-styled__PreviewAvatar")]',
			);

		return isPlaceholder
			? base.filter({ has: this.page.locator('img[src*="placeholder"]') })
			: base.filter({
					hasNot: this.page.locator('img[src*="placeholder"]'),
			  });
	}

	public coverImagePreview(isPlaceholder = false): Locator {
		return this.previewImage("Cover Image", isPlaceholder);
	}

	public thumbnailImagePreview(isPlaceholder = false): Locator {
		return this.previewImage("Thumbnail Image", isPlaceholder);
	}
}
