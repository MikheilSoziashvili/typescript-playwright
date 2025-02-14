import { BaseAsserter } from "@pages/base/base-asserter";
import { GiftCardsAdminPage } from "./gift-cards-admin-page";
import { step } from "decorators/step";
import { Timeout } from "@enums/timeout";

export class GiftCardsAdminAsserter extends BaseAsserter<GiftCardsAdminPage> {
	public constructor(page: GiftCardsAdminPage) {
		super(page);
	}

	@step("Check page elements are visible")
	async pageElementsAreVisible(): Promise<void> {
		await this.checkElementsAreVisible(
			[
				this.gamdomPage.map.giftCardGeneratorContainer,
				this.gamdomPage.map.giftCardSettingsContainer,
			],
			Timeout.MAX,
		);
	}
}
