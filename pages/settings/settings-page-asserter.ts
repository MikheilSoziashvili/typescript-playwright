import { BaseAsserter } from "@base/base-asserter";
import { SettingsPage } from "./settings-page";
import { step } from "decorators/step";
import { SelfExclusionDays } from "@enums/self-exlusion-days";
import { SELF_EXCLUSION_TIMER_MAP } from "@constants/timers";
import { selfExclusionTimerV4Pattern } from "@support/regex-patterns";
import { expect } from "@playwright/test";

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

	@step("Verify self exclusion timer is displayed")
	public async selfExclusionTimerDisplayed(
		days: SelfExclusionDays,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.selfExclusionTimer,
		]);

		await this.checkElementsContainText([
			{
				locator: this.gamdomPage.map.selfExclusionTimer,
				expectedText: SELF_EXCLUSION_TIMER_MAP[days],
			},
		]);
	}

	@step("Verify self exclusion tabs are visible - v4")
	public async selfExclusionTabsVisibleV4(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.selfExclusionTabsV4,
		]);
	}

	@step("Verify self exclusion tab is not visible - v4")
	public async selfExclusionTabNotVisibleV4(): Promise<void> {
		await this.checkElementsAreNotVisible([
			this.gamdomPage.map.selfExclusionTabsV4,
		]);
	}

	@step("Verify self exclusion modal heading is visible - v4")
	public async selfExclusionModalHeadingVisibleV4(): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.confirmModalHeadingV4,
		]);
	}

	@step("Verify self exclusion timer is displayed - v4")
	public async selfExclusionTimerDisplayedV4(
		days: SelfExclusionDays,
	): Promise<void> {
		await this.checkElementsAreVisible([
			this.gamdomPage.map.selfExclusionTimerV4,
		]);

		await expect(this.gamdomPage.map.selfExclusionTimerV4).toContainText(
			selfExclusionTimerV4Pattern(days),
		);
	}
}
