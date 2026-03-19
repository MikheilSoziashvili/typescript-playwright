import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { SupportPage } from "./support-page";

export class SupportPageAsserter extends BaseAsserter<SupportPage> {
	public constructor(page: SupportPage) {
		super(page);
	}

	@step("Verify support page is visible")
	public async supportPageIsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.supportHeading,
		]);
	}
}
