import { Locator, Page } from "@playwright/test";
import { BaseMap } from "@base/base-map";
import { SelfExclusionDays } from "@enums/self-exlusion-days";

export class SettingsPageMap extends BaseMap {
	public constructor(page: Page) {
		super(page);
	}

	public get settingsContainer(): Locator {
		return this.page.locator(
			`[class^="ProfileLayout-styled__ProfileMainContainer-sc-"]`,
		);
	}

	public get imageQRCode(): Locator {
		return this.page.locator(`[class="qrcode"]`);
	}

	public get enable2FAButton(): Locator {
		return this.settingsContainer.getByTestId("enable-2fa");
	}

	public get disable2FAButton(): Locator {
		return this.settingsContainer.getByTestId("disable-2fa");
	}

	public get activation2FAPopup(): Locator {
		return this.page.getByTestId("enable-2fa-v4-container");
	}

	public get fields2FACodeInputsActivationModal(): Locator {
		return this.activation2FAPopup.locator(
			'[data-testid^="enable-2fa-v4-pin-code-input-"]',
		);
	}

	public get confirm2FAActivationCodeButton(): Locator {
		return this.activation2FAPopup.getByTestId(
			"enable-2fa-v4-confirm-button",
		);
	}

	public get deactivation2FaPopup(): Locator {
		return this.page.getByTestId(
			"deactivate-confirmation-2fa-v4-container",
		);
	}

	public get confirm2FADeactivationCodeButton(): Locator {
		return this.deactivation2FaPopup.getByTestId(
			"deactivate-confirmation-2fa-v4-continue-button",
		);
	}

	public get cancel2FADeactivationCodeButton(): Locator {
		return this.deactivation2FaPopup.getByTestId(
			"deactivate-confirmation-2fa-v4-cancel-button",
		);
	}

	public get deactivation2FACodeEntryModal(): Locator {
		return this.page.getByTestId("deactivate-2fa-v4-container");
	}

	public get continue2FADeactivationCodeButton(): Locator {
		return this.deactivation2FACodeEntryModal.getByTestId(
			"deactivate-2fa-v4-continue-button",
		);
	}

	public get fields2FACodeInputsDeactivationModal(): Locator {
		return this.deactivation2FACodeEntryModal.locator(
			'[data-testid^="deactivate-2fa-v4-pin-code-input-"]',
		);
	}

	public get verification2FAPopup(): Locator {
		return this.page.getByTestId("verify-2fa-v4-container");
	}

	public get fields2FACodeInputsVerificationModal(): Locator {
		return this.verification2FAPopup.locator(
			'[data-testid^="verify-2fa-v4-pin-code-input-"]',
		);
	}

	public get confirm2FAVerificationCodeButton(): Locator {
		return this.verification2FAPopup.getByTestId(
			"verify-2fa-v4-confirm-button",
		);
	}

	public get selfExclusionTabs(): Locator {
		return this.settingsContainer
			.getByTestId("self-exclusion-inactive-panel-1day-button")
			.locator("..");
	}

	private selfExclusionDayKey(days: SelfExclusionDays): string {
		switch (days) {
			case SelfExclusionDays.ONE_DAY:
				return "1day";
			case SelfExclusionDays.FIVE_DAYS:
				return "5days";
			case SelfExclusionDays.EIGHT_DAYS:
				return "8days";
			default:
				return String(days).replace(" ", "");
		}
	}

	public selfExclusionTime(days: SelfExclusionDays): Locator {
		const dayKey = this.selfExclusionDayKey(days);

		return this.settingsContainer.getByTestId(
			`self-exclusion-inactive-panel-${dayKey}-button`,
		);
	}

	public get confirmModalHeading(): Locator {
		return this.page.getByTestId(
			"self-exclusion-modal-v4-continue-description",
		);
	}

	public get confirmModalContinueButton(): Locator {
		return this.page.getByTestId("self-exclusion-modal-v4-continue-button");
	}

	public get selfExclusionTimer(): Locator {
		return this.settingsContainer.getByTestId(
			"self-exclusion-active-panel-",
		);
	}
}
