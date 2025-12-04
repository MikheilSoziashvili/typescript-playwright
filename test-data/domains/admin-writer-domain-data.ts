import { ADMIN_WRITER_BLOG_POST_IMAGE_FILE_MAP } from "@constants/file-paths";
import { BlogImageUploadButton } from "@enums/admin/blog-image-upload-buttons";
import { ImageSize } from "@enums/img/image-sizes";
import { WriterAdminNewPage } from "@pages/admin/writer-admin-new/writer-admin-new-page";
import { BlogImageUploadScenario } from "test-data/interfaces/domain/admin-writer-domain-interfaces";

export class AdminWriterDomainData {
	public readonly IMAGE_SIZE_LABEL = {
		[ImageSize.BELOW_1MB]: "Below 1 MB",
		[ImageSize.ABOVE_1MB]: "Above 1 MB",
	} as const;

	public readonly BLOG_IMAGE_UPLOAD_BUTTON_LABEL = {
		[BlogImageUploadButton.UPLOAD_COVER]: "Upload Cover",
		[BlogImageUploadButton.UPLOAD_THUMBNAIL]: "Upload Thumbnail",
	} as const;

	public readonly blogImageUploadScenarios: BlogImageUploadScenario[] = [
		{
			uploadButton: BlogImageUploadButton.UPLOAD_COVER,
			imageSize: ImageSize.BELOW_1MB,
			uploadImageStep: (writerAdminPage: WriterAdminNewPage) =>
				writerAdminPage.uploadPostCoverImage(
					ADMIN_WRITER_BLOG_POST_IMAGE_FILE_MAP[ImageSize.BELOW_1MB],
				),
			assertUploadImageStepResult: async (
				writerAdminNewPage: WriterAdminNewPage,
			): Promise<void> => {
				await writerAdminNewPage
					.assertThat()
					.blogPostCoverImageUploaded();
			},
		},
		{
			uploadButton: BlogImageUploadButton.UPLOAD_COVER,
			imageSize: ImageSize.ABOVE_1MB,
			uploadImageStep: (writerAdminNewPage: WriterAdminNewPage) =>
				writerAdminNewPage.uploadPostCoverImage(
					ADMIN_WRITER_BLOG_POST_IMAGE_FILE_MAP[ImageSize.ABOVE_1MB],
				),
			assertUploadImageStepResult: async (
				writerAdminNewPage: WriterAdminNewPage,
			): Promise<void> => {
				await writerAdminNewPage
					.assertThat()
					.toastFileSizeLimitExceededDisplayed();
			},
		},
		{
			uploadButton: BlogImageUploadButton.UPLOAD_THUMBNAIL,
			imageSize: ImageSize.BELOW_1MB,
			uploadImageStep: (writerAdminNewPage: WriterAdminNewPage) =>
				writerAdminNewPage.uploadPostThumbnailImage(
					ADMIN_WRITER_BLOG_POST_IMAGE_FILE_MAP[ImageSize.BELOW_1MB],
				),
			assertUploadImageStepResult: async (
				writerAdminNewPage: WriterAdminNewPage,
			): Promise<void> => {
				await writerAdminNewPage
					.assertThat()
					.blogPostThumbnailImageUploaded();
			},
		},
		{
			uploadButton: BlogImageUploadButton.UPLOAD_THUMBNAIL,
			imageSize: ImageSize.ABOVE_1MB,
			uploadImageStep: (writerAdminNewPage: WriterAdminNewPage) =>
				writerAdminNewPage.uploadPostThumbnailImage(
					ADMIN_WRITER_BLOG_POST_IMAGE_FILE_MAP[ImageSize.ABOVE_1MB],
				),
			assertUploadImageStepResult: async (
				writerAdminNewPage: WriterAdminNewPage,
			): Promise<void> => {
				await writerAdminNewPage
					.assertThat()
					.toastFileSizeLimitExceededDisplayed();
			},
		},
	];
}
