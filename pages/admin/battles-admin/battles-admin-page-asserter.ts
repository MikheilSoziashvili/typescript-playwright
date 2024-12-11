import { BaseAsserter } from "@pages/base/base-asserter";
import { BattlesAdminPage } from "./battles-admin-page";

export class BattlesAdminAsserter extends BaseAsserter<BattlesAdminPage> {
	public constructor(page: BattlesAdminPage) {
		super(page);
	}
}
