import { BaseMap } from "@base/base-map";
import { BlogPostCategories } from "@enums/post-categories";
import { Locator, Page } from "@playwright/test";

export class WriterAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get writerView(): Locator {
		return this.page.locator("div.writer-panel");
	}

	public get blogInformationView(): Locator {
		return this.writerView.locator(
			`[class*='BlogInformation-styled__InputContainer']`,
		);
	}

	public get paragraphInput(): Locator {
		return this.writerView.locator(
			`[class*='ck-editor__main'] [role='textbox']`,
		);
	}

	public inputFieldByPlaceholder(placeholderText: string): Locator {
		return this.blogInformationView.locator(
			`//span[@class="placeholder_txt" and text()="${placeholderText}"]//ancestor::div[@class="field_group"]//input`,
		);
	}
	public get blogTitleInput(): Locator {
		return this.inputFieldByPlaceholder("Title");
	}

	public get blogSubTitleInput(): Locator {
		return this.inputFieldByPlaceholder("Subtitle");
	}

	public get blogAuthorInput(): Locator {
		return this.inputFieldByPlaceholder("Author");
	}

	public get blogCustomUrlInput(): Locator {
		return this.inputFieldByPlaceholder("Custom URL");
	}

	public get uploadCoverInput(): Locator {
		return this.blogInformationView.locator(`[id="upload-cover"]`);
	}

	public get uploadThumbnailInput(): Locator {
		return this.blogInformationView.locator(`[id="upload-thumbnail"]`);
	}

	public get postCategoriesDropdown(): Locator {
		return this.blogInformationView.locator(
			`[class*=DropdownContainer] [role="combobox"][aria-haspopup="listbox"]`,
		);
	}

	public get postCategoriesList(): Locator {
		return this.page.locator("ul[role=listbox]");
	}

	public postCategoriesOption(option: BlogPostCategories): Locator {
		return this.getDropdownOptionSelector(option, this.postCategoriesList);
	}

	public get blogContainerView(): Locator {
		return this.page.locator(`[class*='BlogContainer']`);
	}

	public get savePostButton(): Locator {
		return this.blogContainerView.locator(`[class*='SaveWrap'] button`);
	}

	public get confirmPostButton(): Locator {
		return this.blogContainerView.locator(
			`//div[contains(@class,'AdminBlogPanel')]//button[text()='Confirm']`,
		);
	}

	public get titleInformationHeader(): Locator {
		return this.page.locator('h4.title:text-is("Title information")');
	}
}
