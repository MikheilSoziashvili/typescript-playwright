import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class EventsManagingAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get eventsManagingAdminPageContent(): Locator {
		return this.page.getByTestId("adminEventsManagingPageContainer");
	}

	public get logoContainer(): Locator {
		return this.eventsManagingAdminPageContent.getByTestId("logoContainer");
	}

	public get logoHeader(): Locator {
		return this.logoContainer.getByTestId("logoImageHeaderTitle");
	}
}
