import { BaseAsserter } from "@pages/base/base-asserter";
import { CmsSportsPage } from "./sports-cms-page";
import { step } from "decorators/step";

export class CmsSportsPageAsserter extends BaseAsserter<CmsSportsPage> {
	public constructor(page: CmsSportsPage) {
		super(page);
	}

	@step("Verify sports page displays no results message")
	public async noResultsIsDisplayed(): Promise<void> {
		await this.checkElementsAreVisible([this.gamdomPage.map.noResultsMessage]);
	}
}
