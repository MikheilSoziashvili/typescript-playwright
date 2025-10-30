import { BasePage } from "@base/base-page";
import { VERIFICATION_PAGE_ENDPOINT } from "@constants/page-endpoints";
import { BasePageNavigationParametersType } from "@core/types/types";
import { Page } from "@playwright/test";
import { VerificationPageAsserter } from "./verification-page-asserter";
import { VerificationPageMap } from "./verification-page-map";
import { VerificationPageSteps } from "./verification-page-steps";
import { getItemsAttribute, getRandomIndex } from "@core/utils/utils";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { step } from "decorators/step";
import { logger } from "@logger/logger";

export class VerificationPage extends BasePage<VerificationPageMap> {
	public constructor(page: Page) {
		super(page, new VerificationPageMap(page));
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			endpoint: { paths: [VERIFICATION_PAGE_ENDPOINT] },
		});
	}

	public override assertThat(): VerificationPageAsserter {
		return new VerificationPageAsserter(this);
	}

	public steps(): VerificationPageSteps {
		return new VerificationPageSteps(this);
	}

	@step("Select Verify Business tab")
	public async selectVerifyBusinessTab(): Promise<void> {
		await this.map.verifyBusinessTab.click();
	}

	@step("Open country dropdown")
	public async openCountryDropdown(): Promise<void> {
		await this.map.countryDropdown.click();
	}

	@step("Get country dropdown values")
	public async getCountryDropdownValues(): Promise<string[]> {
		const countryDropdownValues = await getItemsAttribute(
			this.map.countryDropdownValueItems,
			Attributes.DATA_VALUE,
		);
		return countryDropdownValues;
	}

	@step("Select random country from dropdown")
	public async selectRandomCountry(): Promise<void> {
		const options = this.page.locator('li[role="option"]');
		const count = await options.count();

		if (count === 0) {
			throw new Error("No countries available in dropdown");
		}

		const randomIndex = getRandomIndex(count);
		const selected = await options.nth(randomIndex).innerText();

		await options.nth(randomIndex).click();
		logger.info(`Selected country: ${selected}`);
	}
}
