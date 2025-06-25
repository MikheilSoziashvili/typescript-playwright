import { Page } from "@playwright/test";
import { BasePage } from "@base/base-page";
import { BannedUserPageMap } from "./banned-user-page-map";
import { BannedUserPageAsserter } from "./banned-user-page-asserter";
import { BasePageNavigationParametersType } from "@core/types/types";
import { step } from "decorators/step";

export class BannedUserPage extends BasePage<BannedUserPageMap> {
	public constructor(page: Page) {
		super(page, new BannedUserPageMap(page));
	}

	@step("Navigate to custom banned page")
	public async navigateCustomBannedPage(
		bannedPageEndpoint: string,
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [bannedPageEndpoint] },
		});
	}

	@step("Navigate to banned page")
	public async navigateToPage(
		bannedPageEndpoint: string,
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [bannedPageEndpoint] },
		});
	}

	public override assertThat(): BannedUserPageAsserter {
		return new BannedUserPageAsserter(this);
	}

	@step("Wait for red container to be visible")
	public async waitRedContainerToBeVisible(): Promise<void> {
		await this.map.waitForVisibility({
			locator: this.map.redContainer,
		});
	}

	@step("Open social media footer link")
	public async openSocialMediaFooterLinkByPlaceholder(
		footerLink: string,
	): Promise<void> {
		await this.map.socialMediaFooterLinkByPlaceholder(footerLink).click();
	}
}
