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

	public async navigateCustomBannedPage(
		bannedPageEndpoint: string,
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [bannedPageEndpoint] },
		});
	}

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

	@step()
	public async waitRedContainerToBeVisible(): Promise<void> {
		await this.map.waitForVisibility({
			locator: this.map.redContainer,
		});
	}

	@step()
	public async openSocialMediaFooterLinkByPlaceholder(
		footerLink: string,
	): Promise<void> {
		await this.map.socialMediaFooterLinkByPlaceholder(footerLink).click();
	}
}
