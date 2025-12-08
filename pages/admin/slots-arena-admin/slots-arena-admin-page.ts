import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { SlotsArenaAdminAsserter as SlotsArenaAdminAsserter } from "./slots-arena-admin-page-asserter";
import { SlotsArenaAdminMap as SlotsArenaAdminMap } from "./slots-arena-admin-page-map";
import { SlotsArenaAdminSteps as SlotsArenaAdminSteps } from "./slots-arena-admin-page-steps";

export class SlotsArenaAdmin extends BasePage<SlotsArenaAdminMap> {
	public constructor(page: Page) {
		super(page, new SlotsArenaAdminMap(page));
	}

	public override assertThat(): SlotsArenaAdminAsserter {
		return new SlotsArenaAdminAsserter(this);
	}

	public steps(): SlotsArenaAdminSteps {
		return new SlotsArenaAdminSteps(this);
	}
}
