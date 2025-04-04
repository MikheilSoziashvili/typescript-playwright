import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class UserProfileModalMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get userProfileModalContainer(): Locator {
		return this.page.getByTestId("profileModalContainer");
	}

	public get userProfileContainer(): Locator {
		return this.userProfileModalContainer.getByTestId(
			"profileModalUserProfile",
		);
	}

	public get userProfilePrivateStatisticsContainer(): Locator {
		return this.userProfileModalContainer.getByTestId(
			"profileModalPrivateStatisticsContainer",
		);
	}

	public get userAvatar(): Locator {
		return this.userProfileContainer.getByTestId("avatarContainer");
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
