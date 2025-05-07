import { BaseMap } from "@base/base-map";
import { BlogPostCategories } from "@enums/post-categories";
import { Locator, Page } from "@playwright/test";

export class WriterAdminPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get writerView(): Locator {
		return this.page.getByTestId("writerPageContainer");
	}

	public get paragraphInput(): Locator {
		return this.writerView.locator(
			`[class*='ck-editor__main'] [role='textbox']`,
		);
	}

	public get blogInformationView(): Locator {
		return this.writerView.getByTestId("blogInformationContainer");
	}

	public get titleInformationHeader(): Locator {
		return this.blogInformationView.getByTestId("blogContainerTitle");
	}

	public get blogTitleInput(): Locator {
		return this.blogInformationView.getByTestId("blogTitle");
	}

	public get blogSubTitleInput(): Locator {
		return this.blogInformationView.getByTestId("blogSubtitle");
	}

	public get blogAuthorInput(): Locator {
		return this.blogInformationView.getByTestId("blogAuthor");
	}

	public get blogCustomUrlInput(): Locator {
		return this.blogInformationView.getByTestId("blogCustomUrl");
	}

	public get uploadCoverInput(): Locator {
		return this.blogInformationView.getByTestId("uploadCover");
	}

	public get uploadThumbnailInput(): Locator {
		return this.blogInformationView.getByTestId("uploadThumbnail");
	}

	public get postCategoriesDropdown(): Locator {
		return this.blogInformationView.getByTestId("dropdownBlogCategory");
	}

	public postCategoriesOption(option: BlogPostCategories): Locator {
		return this.page.getByTestId("blogCategoriesMenu-" + option);
	}

	public get blogContainerView(): Locator {
		return this.page.getByTestId("blogPostContainer");
	}

	public get savePostButton(): Locator {
		return this.blogContainerView.getByTestId("savePostButton");
	}

	public get confirmPostButton(): Locator {
		return this.blogContainerView.getByTestId("confirmPostButton");
	}
}
