import { BlogImageUploadButton } from "@enums/admin/blog-image-upload-buttons";
import { ImageSize } from "@enums/img/image-sizes";
import { WriterAdminNewPage } from "@pages/admin/writer-admin-new/writer-admin-new-page";

export interface BlogImageUploadScenario {
	uploadButton: BlogImageUploadButton;
	imageSize: ImageSize;
	uploadImageStep: (writerAdminNewPage: WriterAdminNewPage) => Promise<void>;
	assertUploadImageStepResult: (
		writerAdminNewPage: WriterAdminNewPage,
	) => Promise<void>;
}
