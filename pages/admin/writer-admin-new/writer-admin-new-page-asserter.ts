import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { BlogImageUploadButton } from "@enums/admin/blog-image-upload-buttons";
import { ToastTitle } from "@enums/toast-titles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { WriterAdminNewPage } from "./writer-admin-new-page";

export class WriterAdminNewPageAsserter extends BaseAsserter<WriterAdminNewPage> {
	public constructor(page: WriterAdminNewPage) {
		super(page);
	}

	@step("Check blog post cover image uploaded successfully")
	public async blogPostCoverImageUploaded(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.coverImagePreview(false),
		]);
	}

	@step("Check blog post cover image not uploaded")
	public async blogPostCoverImageNotUploaded(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.coverImagePreview(true),
		]);
	}

	@step("Check blog post thumbnail image uploaded successfully")
	public async blogPostThumbnailImageUploaded(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.thumbnailImagePreview(false),
		]);
	}

	@step("Check blog post thumbnail image not uploaded")
	public async blogPostThumbnailImageNotUploaded(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.thumbnailImagePreview(true),
		]);
	}

	@step("Check blog post image uploaded successfully")
	public async blogPostImageUploaded(
		imageUploadButton: BlogImageUploadButton,
	): Promise<void> {
		imageUploadButton === BlogImageUploadButton.UPLOAD_COVER
			? await this.blogPostCoverImageUploaded()
			: await this.blogPostThumbnailImageUploaded();
	}

	@step("Check blog post image not uploaded")
	public async blogPostImageNotUploaded(
		imageUploadButton: BlogImageUploadButton,
	): Promise<void> {
		imageUploadButton === BlogImageUploadButton.UPLOAD_COVER
			? await this.blogPostCoverImageNotUploaded()
			: await this.blogPostThumbnailImageNotUploaded();
	}

	@step("Check toast message for file size exceeded is displayed")
	public async toastFileSizeLimitExceededDisplayed(): Promise<void> {
		await this.gamdomPage.toast
			.assertThat()
			.toastMessageIs(
				ToastTitle.FAILED,
				ToastSubTitle.ADMIN_WRITER_FILE_SIZE_EXCEEDED,
			);
	}
}
