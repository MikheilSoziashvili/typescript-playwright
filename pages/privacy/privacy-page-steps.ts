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

	@step("Toggle user privacy setting: {setting} -> {mode} - v4")
	public async toggleUserPrivacyV4(
		setting: UserPrivacyOption,
		mode: ToggleOptions,
	): Promise<void> {
		const toggles = {
			[UserPrivacyOption.STATISTICS]:
				this.gamdomPage.map.hideStatisticsToggleV4,
			[UserPrivacyOption.DETAILS]:
				this.gamdomPage.map.hideDetailsToggleV4,
		} as const;

		const clickTargets = {
			[UserPrivacyOption.STATISTICS]:
				this.gamdomPage.map.hideStatisticsToggleClickTargetV4,
			[UserPrivacyOption.DETAILS]:
				this.gamdomPage.map.hideDetailsToggleClickTargetV4,
		} as const;

		const toggle = toggles[setting];
		const clickTarget = clickTargets[setting];

		const shouldBeChecked = mode === ToggleOptions.ON;
		const isChecked = await toggle.isChecked();

		if (isChecked === shouldBeChecked) return;

		await clickTarget.click();
	}

	@step("Enable Hidden Details privacy and verify toast message - v4")
	public async enableHiddenDetailsV4(): Promise<void> {
		await this.toggleUserPrivacyV4(
			UserPrivacyOption.DETAILS,
			ToggleOptions.ON,
		);

		await this.gamdomPage.toastV4
			.assertThat()
			.toastMessageIsV4(
				ToastTitle.SUCCESS_V4,
				ToastSubTitle.HIDEN_DETAILS_ENABLED,
			);
	}
}
