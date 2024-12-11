import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { CdnUploadAdminAsserter } from "./cdn-upload-admin-page-asserter";
import { CdnUploadAdminMap } from "./cdn-upload-admin-page-map";
import { CdnUploadAdminSteps } from "./cdn-upload-admin-page-steps";

export class CdnUploadAdminPage extends BasePage<CdnUploadAdminMap> {
	public constructor(page: Page) {
		super(page, new CdnUploadAdminMap(page));
	}

	public override assertThat(): CdnUploadAdminAsserter {
		return new CdnUploadAdminAsserter(this);
	}

	public steps(): CdnUploadAdminSteps {
		return new CdnUploadAdminSteps(this);
	}
}
