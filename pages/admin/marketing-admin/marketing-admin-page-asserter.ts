import { BaseAsserter } from "@pages/base/base-asserter";
import { MarketingAdminPage } from "./marketing-admin-page";

export class MarketingAdminAsserter extends BaseAsserter<MarketingAdminPage> {
	public constructor(page: MarketingAdminPage) {
		super(page);
	}
}
