import { BaseAsserter } from "@base/base-asserter";
import { SettingsPage } from "./settings-page";
import { step } from "decorators/step";
import { SelfExclusionDays } from "@enums/self-exlusion-days";
import { expect } from "@playwright/test";
import { selfExclusionTimerPattern } from "@support/regex-patterns";

export class SettingsPageAsserter extends BaseAsserter<SettingsPage> {
	public constructor(page: SettingsPage) {
		super(page);
	}

	@step("Verify self exclusion tabs are visible")
	public async selfExclusionTabsVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.selfExclusionTabs,
		]);
	}

	@step("Verify self exclusion tab is not visible")
	public async selfExclusionTabNotVisible(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.selfExclusionTabs,
		]);
	}

	@step("Verify self exclusion modal heading is visible")
	public async selfExclusionModalHeadingVisible(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.confirmModalHeading,
		]);
	}

	@step("Verify email_consent value in DB")
	public async emailConsentInDbIs(
		actual: boolean,
		expected: boolean,
	): Promise<void> {
		await this.assertAllTruthy([
			{
				condition: actual === expected,
				message: `email_consent in DB should be ${expected}`,
			},
		]);
	}

	@step("Verify Receive News and Offers toggle checked state")
	public async receiveNewsAndOffersToggleIsChecked(
		checked: boolean,
	): Promise<void> {
		await this.assertCheckedState([
			{
				locator: this.gamdomPage.map.receiveNewsAndOffersToggle,
				checked: checked,
				label: "Receive News and Offers toggle",
			},
		]);
	}

	@step("Verify self exclusion timer is displayed")
	public async selfExclusionTimerDisplayed(
		days: SelfExclusionDays,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.selfExclusionTimer,
		]);

		await expect(this.gamdomPage.map.selfExclusionTimer).toContainText(
			selfExclusionTimerPattern(days),
		);
	}
}
