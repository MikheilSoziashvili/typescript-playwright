import { BasePage } from "@pages/base/base-page";
import { Page } from "playwright";
import { EventsManagingAdminAsserter } from "./events-managing-admin-page-asserter";
import { EventsManagingAdminMap } from "./events-managing-admin-page-map";
import { EventsManagingAdminSteps } from "./events-managing-admin-page-steps";

export class EventsManagingAdminPage extends BasePage<EventsManagingAdminMap> {
	public constructor(page: Page) {
		super(page, new EventsManagingAdminMap(page));
	}

	public override assertThat(): EventsManagingAdminAsserter {
		return new EventsManagingAdminAsserter(this);
	}

	public steps(): EventsManagingAdminSteps {
		return new EventsManagingAdminSteps(this);
	}
}
