import { BaseAsserter } from "@pages/base/base-asserter";
import { BotsAdminPage } from "./bots-admin-page";

export class BotsAdminAsserter extends BaseAsserter<BotsAdminPage> {
	public constructor(page: BotsAdminPage) {
		super(page);
	}
}
