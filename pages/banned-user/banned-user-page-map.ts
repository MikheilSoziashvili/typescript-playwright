import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class BannedUserPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	private get restrictedContainer(): Locator {
		return this.page.getByTestId("restrictedContainer");
	}

	public get redContainer(): Locator {
		return this.restrictedContainer.getByTestId("containerRed");
	}

	public get restrictionTitle(): Locator {
		return this.redContainer.getByTestId("ban-message");
	}

	public get bannedReason(): Locator {
		return this.redContainer.getByTestId("ban-reason");
	}

	public get socialMediaFooterContainer(): Locator {
		return this.restrictedContainer.getByTestId("socials");
	}

	public socialMediaFooterLinkByPlaceholder(socialMedia: string): Locator {
		return this.socialMediaFooterContainer.getByTestId(
			`${socialMedia}-link`,
		);
	}

	public socialMediaFooterIconByPlaceholder(socialMedia: string): Locator {
		return this.socialMediaFooterContainer.getByTestId(
			`${socialMedia}-button`,
		);
	}
}
