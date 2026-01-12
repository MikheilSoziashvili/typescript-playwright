import { BasePage } from "@base/base-page";
import { PRIVACY_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Page } from "@playwright/test";
import { PrivacyPageMap } from "./privacy-page-map";
import { PrivacyPageAsserter } from "./privacy-page-asserter";
import { PrivacyPageSteps } from "./privacy-page-steps";
import { step } from "decorators/step";

export class PrivacyPage extends BasePage<PrivacyPageMap> {
	public constructor(page: Page) {
		super(page, new PrivacyPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [PRIVACY_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): PrivacyPageAsserter {
		return new PrivacyPageAsserter(this);
	}

	public steps(): PrivacyPageSteps {
		return new PrivacyPageSteps(this);
	}

	@step("Unignore a given user")
	public async unignoreUser(username: string): Promise<void> {
		await this.map.getUnignoreButton(username).click();
	}

	@step("Click unignore user icon - v4")
	public async clickUnignoreUserV4(username: string): Promise<void> {
		await this.map.getUnignoreButtonV4(username).click();
	}
}
