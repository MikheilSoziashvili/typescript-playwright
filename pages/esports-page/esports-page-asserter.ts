import { BaseAsserter } from "@base/base-asserter";
import { EsportsPage } from "./esports-page";
import { Timeout } from "@enums/timeout";

export class EsportsPageAsserter extends BaseAsserter<EsportsPage> {
	public constructor(page: EsportsPage) {
		super(page);
	}

	async pageElementsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[this.gamdomPage.map.esportsPageTitle],
			Timeout.MAX,
		);
	}
}
