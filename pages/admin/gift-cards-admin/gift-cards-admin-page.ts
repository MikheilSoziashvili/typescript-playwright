import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { GiftCardsAdminAsserter } from "./gift-cards-admin-page-asserter";
import { GiftCardsAdminMap } from "./gift-cards-admin-page-map";
import { GiftCardsAdminSteps } from "./gift-cards-admin-page-steps";

export class GiftCardsAdminPage extends BasePage<GiftCardsAdminMap> {
	public constructor(page: Page) {
		super(page, new GiftCardsAdminMap(page));
	}

	public override assertThat(): GiftCardsAdminAsserter {
		return new GiftCardsAdminAsserter(this);
	}

	public steps(): GiftCardsAdminSteps {
		return new GiftCardsAdminSteps(this);
	}
}
