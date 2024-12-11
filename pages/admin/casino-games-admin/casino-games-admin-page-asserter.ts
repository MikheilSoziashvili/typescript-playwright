import { BaseAsserter } from "@pages/base/base-asserter";
import { CasinoGamesAdminPage } from "./casino-games-admin-page";

export class CasinoGamesAdminAsserter extends BaseAsserter<CasinoGamesAdminPage> {
	public constructor(page: CasinoGamesAdminPage) {
		super(page);
	}
}
