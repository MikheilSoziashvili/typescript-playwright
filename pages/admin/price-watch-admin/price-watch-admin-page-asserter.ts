import { BaseAsserter } from "@pages/base/base-asserter";
import { PriceWatchAdminPage } from "./price-watch-admin-page";

export class PriceWatchAdminAsserter extends BaseAsserter<PriceWatchAdminPage> {
	public constructor(page: PriceWatchAdminPage) {
		super(page);
	}
}
