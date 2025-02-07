import { BaseAsserter } from "@pages/base/base-asserter";
import { PromoCampaignsAdminPage } from "./promo-campaigns-admin-page";

export class PromoCampaignsAdminAsserter extends BaseAsserter<PromoCampaignsAdminPage> {
	public constructor(page: PromoCampaignsAdminPage) {
		super(page);
	}
}
