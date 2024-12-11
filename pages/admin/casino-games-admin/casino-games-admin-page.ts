import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { CasinoGamesAdminAsserter } from "./casino-games-admin-page-asserter";
import { CasinoGamesAdminMap } from "./casino-games-admin-page-map";
import { CasinoGamesAdminSteps } from "./casino-games-admin-page-steps";

export class CasinoGamesAdminPage extends BasePage<CasinoGamesAdminMap> {
	public constructor(page: Page) {
		super(page, new CasinoGamesAdminMap(page));
	}

	public override assertThat(): CasinoGamesAdminAsserter {
		return new CasinoGamesAdminAsserter(this);
	}

	public steps(): CasinoGamesAdminSteps {
		return new CasinoGamesAdminSteps(this);
	}
}
