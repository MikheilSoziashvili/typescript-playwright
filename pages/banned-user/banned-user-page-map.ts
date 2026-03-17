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

	public get contentContainer(): Locator {
		return this.page.locator(
			'div[class^="ErrorPageLayout-styled__ContentContainer-sc-"]',
		);
	}

	public get restrictionTitle(): Locator {
		return this.contentContainer.getByText("Your account has been Banned!");
	}

	public get bannedReason(): Locator {
		return this.contentContainer.locator(".error_pages_reason");
	}

	public get socialMediaFooterContainer(): Locator {
		return this.restrictedContainer.locator(
			'div[class^="SocialButtonsV4-styled__SocialButtons-sc-"]',
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
