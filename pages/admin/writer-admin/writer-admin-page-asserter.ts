import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { WriterAdminPage } from "./writer-admin-page";

export class WriterAdminPageAsserter extends BaseAsserter<WriterAdminPage> {
	public constructor(page: WriterAdminPage) {
		super(page);
	}

	@step("Check main blocks are displayed")
	public async isMainBlocksDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.paragraphInput,
			this.gamdomPage.map.blogInformationView,
		]);
	}
}
