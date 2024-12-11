import { BaseAsserter } from "@pages/base/base-asserter";
import { OpenTradesAdminPage } from "./open-trades-admin-page";

export class OpenTradesAdminAsserter extends BaseAsserter<OpenTradesAdminPage> {
	public constructor(page: OpenTradesAdminPage) {
		super(page);
	}
}
