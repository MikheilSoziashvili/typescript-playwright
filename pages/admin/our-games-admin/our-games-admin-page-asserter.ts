import { BaseAsserter } from "@pages/base/base-asserter";
import { OurGamesAdminPage } from "./our-games-admin-page";

export class OurGamesAdminAsserter extends BaseAsserter<OurGamesAdminPage> {
	public constructor(page: OurGamesAdminPage) {
		super(page);
	}
}
