import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { OurGamesAdminAsserter } from "./our-games-admin-page-asserter";
import { OurGamesAdminMap } from "./our-games-admin-page-map";
import { OurGamesAdminSteps } from "./our-games-admin-page-steps";

export class OurGamesAdminPage extends BasePage<OurGamesAdminMap> {
	public constructor(page: Page) {
		super(page, new OurGamesAdminMap(page));
	}

	public override assertThat(): OurGamesAdminAsserter {
		return new OurGamesAdminAsserter(this);
	}

	public steps(): OurGamesAdminSteps {
		return new OurGamesAdminSteps(this);
	}
}
