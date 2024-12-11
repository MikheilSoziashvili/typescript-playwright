import { BaseAsserter } from "@pages/base/base-asserter";
import { CdnUploadAdminPage } from "./cdn-upload-admin-page";

export class CdnUploadAdminAsserter extends BaseAsserter<CdnUploadAdminPage> {
	public constructor(page: CdnUploadAdminPage) {
		super(page);
	}
}
