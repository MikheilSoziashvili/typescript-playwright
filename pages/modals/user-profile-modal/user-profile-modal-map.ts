import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class UserProfileModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get userProfileModalContainer(): Locator {
		return this.page.getByTestId("user-details-modal-dialog-dialog");
	}

	public get userProfileContainer(): Locator {
		return this.userProfileModalContainer.getByTestId(
			"user-details-modal-dialog-wrapper",
		);
	}

	public get userProfilePrivateStatisticsContainer(): Locator {
		return this.userProfileModalContainer.getByTestId(
			"user-details-statistics-private-stats",
		);
	}

	public get userProfilePrivateStatisticsMessage(): Locator {
		return this.userProfilePrivateStatisticsContainer.getByTestId(
			"user-details-statistics-private-message",
		);
	}

	public get userAvatar(): Locator {
		return this.userProfileContainer.getByTestId(
			"with-name-account-widget-avatar",
		);
	}

	public get userProfileUsername(): Locator {
		return this.userProfileContainer.getByTestId(
			"with-name-account-widget-username",
		);
	}

	public get userProfileTitle(): Locator {
		return this.userProfileContainer.getByTestId("usernameTitle");
	}

	public get tipUserButton(): Locator {
		return this.userProfileModalContainer.getByTestId(
			"profileModalTipUserButton",
		);
	}

	public get ignoreButton(): Locator {
		return this.userProfileModalContainer.getByTestId(
			"profileModalIgnoreButton",
		);
	}
}
