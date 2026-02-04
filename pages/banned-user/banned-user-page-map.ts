import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";

export class BannedUserPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	private get restrictedContainer(): Locator {
		return this.page.locator(
			'div[class^="ErrorPageLayout-styled__Container"]',
		);
	}

	public get redContainer(): Locator {
		return this.restrictedContainer.locator(
			'div[class^="ErrorPageLayout-styled__BannerContainer"]',
		);
	}

	public get restrictionTitle(): Locator {
		return this.redContainer.getByText("Your account has been Banned!");
	}

	public get bannedReason(): Locator {
		return this.redContainer.getByTestId("ban-reason");
	}

	public get socialMediaFooterContainer(): Locator {
		return this.restrictedContainer.locator(
			'div[class^="ErrorPageLayout-styled__SocialsContainer"]',
		);
	}

	public socialMediaFooterLinkByPlaceholder(socialMedia: string): Locator {
		return this.socialMediaFooterContainer.locator(
			`a[href*="${socialMedia.toLowerCase()}"]`,
		);
	}

	public socialMediaFooterIconByPlaceholder(socialMedia: string): Locator {
		return this.socialMediaFooterLinkByPlaceholder(socialMedia).locator(
			"svg",
		);
	}
}
