import { BaseAsserter } from "@pages/base/base-asserter";
import { StatsAdminPage } from "./stats-admin-page";

export class StatsAdminAsserter extends BaseAsserter<StatsAdminPage> {
	public constructor(page: StatsAdminPage) {
		super(page);
	}
}
