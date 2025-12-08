import { BasePage } from "@pages/base/base-page";
import { Locator, Page } from "@playwright/test";
import { VeriffPortalAsserter } from "./veriff-portal-page-asserter";
import { VeriffPortalMap } from "./veriff-portal-page-map";
import { VeriffPortalSteps } from "./veriff-portal-page-steps";
import { step } from "decorators/step";
import { BasePageNavigationParametersType } from "@core/types/types";
import { veriffConfig } from "configuration";

export class VeriffPortalPage extends BasePage<VeriffPortalMap> {
	public constructor(page: Page) {
		super(page, new VeriffPortalMap(page));
	}

	public static previousCode?: string;

	public override assertThat(): VeriffPortalAsserter {
		return new VeriffPortalAsserter(this);
	}

	public steps(): VeriffPortalSteps {
		return new VeriffPortalSteps(this);
	}

	public override async navigate(
		parameters?: BasePageNavigationParametersType,
	): Promise<void> {
		await super.navigate({
			...parameters,
			link: veriffConfig.portalUrl,
		});
	}

	@step("open verification details for user")
	public async openVerificationDetails(userId: string): Promise<void> {
		await this.map.openVerificationLink(userId).click();
	}

	@step("Select dropdown option")
	public async selectDropdownOption(
		dropdown: Locator,
		optionText: string,
	): Promise<void> {
		await dropdown.press("ArrowDown");
		const options = await this.map.dropdownOptions.all();

		for (let i = 0; i < options.length; i++) {
			const text = await options[i].textContent();
			if (text?.trim() === optionText) {
				await options[i].press("Enter");
				break;
			}
			if (i < options.length - 1) {
				await dropdown.press("ArrowDown");
			}
		}
	}
}
