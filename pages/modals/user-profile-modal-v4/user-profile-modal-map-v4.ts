import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class UserProfileModalMapV4 extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get userProfileModalContainerV4(): Locator {
		return this.page.getByTestId("user-details-modal-dialog-dialog");
	}

	public get userProfileContainerV4(): Locator {
		return this.userProfileModalContainerV4.getByTestId(
			"user-details-modal-dialog-wrapper",
		);
	}

	public get userProfilePrivateStatisticsContainerV4(): Locator {
		return this.userProfileModalContainerV4.getByTestId(
			"user-details-statistics-private-stats",
		);
	}

	public get userProfilePrivateStatisticsMessageV4(): Locator {
		return this.userProfilePrivateStatisticsContainerV4.getByTestId(
			"user-details-statistics-private-message",
		);
	}

	public get userAvatarV4(): Locator {
		return this.userProfileContainerV4.getByTestId(
			"with-name-account-widget-avatar",
		);
	}

	public get userProfileUsernameV4(): Locator {
		return this.userProfileContainerV4.getByTestId(
			"with-name-account-widget-username",
		);
	}
}
