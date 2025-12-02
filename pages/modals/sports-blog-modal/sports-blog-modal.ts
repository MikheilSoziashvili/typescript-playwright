import { SportsBlogArticleTestData } from "@dtos/test-data";
import { BasePage } from "@pages/base/base-page";
import { Page } from "@playwright/test";
import { step } from "decorators/step";
import { SportsBlogModalAsserter } from "./sports-blog-modal-asserter";
import { SportsBlogModalMap } from "./sports-blog-modal-map";
import { SportsBlogModalSteps } from "./sports-blog-modal-steps";

export class SportsBlogModal extends BasePage<SportsBlogModalMap> {
	constructor(page: Page) {
		super(page, new SportsBlogModalMap(page));
	}

	public steps(): SportsBlogModalSteps {
		return new SportsBlogModalSteps(this);
	}

	public assertThat(): SportsBlogModalAsserter {
		return new SportsBlogModalAsserter(this);
	}

	@step("Fill blog article modal fields")
	public async fillArticleModalFields(
		articleTestData: SportsBlogArticleTestData,
	): Promise<void> {
		await this.map.articleModalTitleInput.clear();
		await this.map.articleModalTitleInput.fill(articleTestData.title);
		await this.map.articleModalCustomUrlInput.fill(
			articleTestData.customUrl,
		);
		await this.map.articleModalSubtitleInput.fill(articleTestData.subtitle);

		await this.map.articleModalDetailedDescriptionInput.fill(
			articleTestData.detailedDescription,
		);

		await this.map.articleModalAuthorInput.fill(articleTestData.author);

		await this.selectStartDateAndTime(
			articleTestData.articleStartDate,
			articleTestData.articleStartTime,
		);
		await this.uploadCoverImage(articleTestData.coverImage);
		await this.uploadThumbnailImage(articleTestData.thumbnailImage);
	}

	@step("Select start and end date and time")
	public async selectStartDateAndTime(
		startDate?: string,
		startTime?: string,
	): Promise<void> {
		const fields: [
			string | undefined,
			{ fill: (value: string) => Promise<void> },
		][] = [
			[startDate, this.map.articleModalStartDateInput],
			[startTime, this.map.articleModalStartTimeInput],
		];
		for (const [value, locator] of fields) {
			if (value !== undefined) {
				await locator.fill(value);
			}
		}
	}

	@step("Upload cover image")
	public async uploadCoverImage(imagePath: string): Promise<void> {
		await this.map
			.articleModalCoverImageUploader()
			.setInputFiles(imagePath);
	}

	@step("Upload thumbnail image")
	public async uploadThumbnailImage(imagePath: string): Promise<void> {
		await this.map
			.articleModalThumbnailImageUploader()
			.setInputFiles(imagePath);
	}

	@step("Click save button")
	public async clickSaveButton(): Promise<void> {
		await this.map.articleModalSaveButton.click();
	}

	@step("Fill blog article successfully")
	public async fillSportsBlogArticleSuccessfully(
		articleTestData: SportsBlogArticleTestData,
	): Promise<void> {
		await this.fillArticleModalFields(articleTestData);
		await this.clickSaveButton();
	}
}
