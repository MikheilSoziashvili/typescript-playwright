import { BaseAsserter } from "@pages/base/base-asserter";
import { ActionsAdminPage } from "./actions-admin-page";

export class ActionsAdminAsserter extends BaseAsserter<ActionsAdminPage> {
	public constructor(page: ActionsAdminPage) {
		super(page);
	}
}
