import { BaseAsserter } from "@pages/base/base-asserter";
import { JackpotAdminPage } from "./jackpot-admin-page";

export class JackpotAdminAsserter extends BaseAsserter<JackpotAdminPage> {
	public constructor(page: JackpotAdminPage) {
		super(page);
	}
}
