import { BaseAsserter } from "@base/base-asserter";
import { WriterAdminPage } from "./writer-admin-page";

export class WriterAdminPageAsserter extends BaseAsserter<WriterAdminPage> {
	public constructor(page: WriterAdminPage) {
		super(page);
	}

	public async isMainBlocksDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.paragraphInput,
			this.gamdomPage.map.blogInformationView,
		]);
	}
}
