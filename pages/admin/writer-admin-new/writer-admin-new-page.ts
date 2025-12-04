import { BasePage } from "@base/base-page";
import { NEW_WRITER_ADMIN_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { step } from "decorators/step";
import { Page } from "@playwright/test";
import { Toast } from "@pages/components/toast/toast";
import { WriterAdminNewPageAsserter } from "./writer-admin-new-page-asserter";
import { WriterAdminNewPageMap } from "./writer-admin-new-page-map";
import { WriterAdminNewPageSteps } from "./writer-admin-new-page-steps";

export class WriterAdminNewPage extends BasePage<WriterAdminNewPageMap> {
	public toast: Toast;

	public constructor(page: Page) {
		super(page, new WriterAdminNewPageMap(page));
		this.toast = new Toast(page);
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [NEW_WRITER_ADMIN_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): WriterAdminNewPageAsserter {
		return new WriterAdminNewPageAsserter(this);
	}

	public steps(): WriterAdminNewPageSteps {
		return new WriterAdminNewPageSteps(this);
	}

	@step("Click create new blog button")
	public async clickCreateNewBlogButton(): Promise<void> {
		await this.map.createBlogButton.click();
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
