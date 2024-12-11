import { BaseAsserter } from "@pages/base/base-asserter";
import { RainAdminPage } from "./rain-admin-page";

export class RainAdminAsserter extends BaseAsserter<RainAdminPage> {
	public constructor(page: RainAdminPage) {
		super(page);
	}
}
