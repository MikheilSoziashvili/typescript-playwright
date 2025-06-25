import { BaseAsserter } from "@base/base-asserter";
import { step } from "decorators/step";
import { EsportsPage } from "./esports-page";
import { Timeout } from "@enums/timeout";

export class EsportsPageAsserter extends BaseAsserter<EsportsPage> {
	public constructor(page: EsportsPage) {
		super(page);
	}

	@step("Check page elements are visible")
	async pageElementsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.esportsPageTitle],
			Timeout.MAX,
		);
	}
}
