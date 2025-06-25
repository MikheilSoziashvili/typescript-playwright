import { BasePage } from "@base/base-page";
import { WRITER_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { step } from "decorators/step";
import { BlogPostCategories } from "@enums/post-categories";
import { Page } from "@playwright/test";
import { WriterAdminPageAsserter } from "./writer-admin-page-asserter";
import { WriterAdminPageMap } from "./writer-admin-page-map";
import { WriterAdminPageSteps } from "./writer-admin-page-steps";

export class WriterAdminPage extends BasePage<WriterAdminPageMap> {
	public constructor(page: Page) {
		super(page, new WriterAdminPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [WRITER_ADMIN_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): WriterAdminPageAsserter {
		return new WriterAdminPageAsserter(this);
	}

	public steps(): WriterAdminPageSteps {
		return new WriterAdminPageSteps(this);
	}

	@step("Select post category")
	public async selectPostCategory(
		category: BlogPostCategories,
	): Promise<void> {
		await this.map.postCategoriesOption(category).click();
	}

	@step("Fill post paragraph")
	public async fillPostParagraph(paragraph: string): Promise<void> {
		await this.map.paragraphInput.fill(paragraph);
	}

	@step("Fill post title")
	public async fillPostTitle(title: string): Promise<void> {
		await this.map.blogTitleInput.fill(title);
	}

	@step("Fill post subtitle")
	public async fillPostSubTitle(subTitle: string): Promise<void> {
		await this.map.blogSubTitleInput.fill(subTitle);
	}

	@step("Fill post author")
	public async fillPostAuthor(authorName: string): Promise<void> {
		await this.map.blogAuthorInput.fill(authorName);
	}

	@step("Fill custom URL")
	public async fillCustomUrl(customUlr: string): Promise<void> {
		await this.map.blogCustomUrlInput.fill(customUlr);
	}

	@step("Save post")
	public async savePost(): Promise<void> {
		await this.map.savePostButton.click();
	}

	@step("Confirm post")
	public async confirmPost(): Promise<void> {
		await this.map.confirmPostButton.click();
	}

	@step("Upload post cover image")
	public async uploadPostCoverImage(imagePath: string): Promise<void> {
		await this.map.uploadCoverInput.setInputFiles(imagePath);
	}

	@step("Upload post thumbnail image")
	public async uploadPostThumbnailImage(imagePath: string): Promise<void> {
		await this.map.uploadThumbnailInput.setInputFiles(imagePath);
	}
}
