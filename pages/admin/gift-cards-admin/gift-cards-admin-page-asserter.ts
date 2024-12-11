import { BaseAsserter } from "@pages/base/base-asserter";
import { GiftCardsAdminPage } from "./gift-cards-admin-page";

export class GiftCardsAdminAsserter extends BaseAsserter<GiftCardsAdminPage> {
	public constructor(page: GiftCardsAdminPage) {
		super(page);
	}
}
