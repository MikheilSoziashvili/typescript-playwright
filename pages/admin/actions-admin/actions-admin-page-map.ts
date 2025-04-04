import { BaseMap } from "@pages/base/base-map";
import { Locator, Page } from "playwright";

export class ActionsAdminMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get adminActionsPageContent(): Locator {
		return this.page.getByTestId("adminActionsPageContainer");
	}

	public get broadcastContainer(): Locator {
		return this.adminActionsPageContent.getByTestId(
			"broadcastMessageToUsersContainer",
		);
	}

	public get broadcastMessageTitle(): Locator {
		return this.broadcastContainer.getByTestId("containerTitle");
	}
}
