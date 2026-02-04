import { BasePageStep } from "@pages/base/base-page-step";
import { PrivacyPage } from "./privacy-page";
import { UserPrivacyOption } from "@enums/user-privacy-options";
import { ToggleOptions } from "@enums/visibility-options";
import { ToastTitle } from "@enums/toast-titles";
import { ToastSubTitle } from "@enums/toast-subtitles";
import { step } from "decorators/step";

export class PrivacyPageSteps extends BasePageStep<PrivacyPage> {
	public constructor(gamdomPage: PrivacyPage) {
		super(gamdomPage);
	}

	@step("Toggle user privacy setting: {setting} -> {mode}")
	public async toggleUserPrivacy(
		setting: UserPrivacyOption,
		mode: ToggleOptions,
	): Promise<void> {
		const toggles = {
			[UserPrivacyOption.STATISTICS]:
				this.gamdomPage.map.hideStatisticsToggle,
			[UserPrivacyOption.DETAILS]: this.gamdomPage.map.hideDetailsToggle,
		} as const;

		const clickTargets = {
			[UserPrivacyOption.STATISTICS]:
				this.gamdomPage.map.hideStatisticsToggleClickTarget,
			[UserPrivacyOption.DETAILS]:
				this.gamdomPage.map.hideDetailsToggleClickTarget,
		} as const;

		const toggle = toggles[setting];
		const clickTarget = clickTargets[setting];

		const shouldBeChecked = mode === ToggleOptions.ON;
		const isChecked = await toggle.isChecked();

		if (isChecked === shouldBeChecked) return;

		await clickTarget.click();
	}

	@step("Enable Hidden Details privacy and verify toast message")
	public async enableHiddenDetails(): Promise<void> {
		await this.toggleUserPrivacy(
			UserPrivacyOption.DETAILS,
			ToggleOptions.ON,
		);

		await this.gamdomPage.toast
			.assertThat()
			.toastMessageIs(
				ToastTitle.SUCCESS,
				ToastSubTitle.HIDEN_DETAILS_ENABLED,
			);
	}

	@step("Enable Hidden Statistics privacy and verify toast message")
	public async enableHiddenStatistics(): Promise<void> {
		await this.toggleUserPrivacy(
			UserPrivacyOption.STATISTICS,
			ToggleOptions.ON,
		);

		await this.gamdomPage.toast
			.assertThat()
			.toastMessageIs(
				ToastTitle.SUCCESS,
				ToastSubTitle.HIDEN_STATISTICS_ENABLED,
			);
	}
}
