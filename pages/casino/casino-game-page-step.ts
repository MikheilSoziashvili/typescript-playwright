import { BasePageStep } from "@pages/base/base-page-step";
import { CasinoPage } from "./casino-game-page";
import { GameProvider } from "@enums/game-providers";
import { VisibilityResult } from "@core/types/types";
import { step } from "decorators/step";
import { waitUntil } from "@core/utils/utils";
import { TimeoutSeconds } from "@enums/timeout-seconds";

export class CasinoPageSteps extends BasePageStep<CasinoPage> {
	public constructor(gamdomPage: CasinoPage) {
		super(gamdomPage);
	}

	@step()
	public async verifyProviderDisplayedInDropdown(
		provider: GameProvider,
		expectedResult: VisibilityResult,
	): Promise<void> {
		await waitUntil(
			async () => {
				await this.gamdomPage.refresh();
				await this.gamdomPage.clickProvidersDropdown();
				try {
					await this.gamdomPage
						.assertThat()
						.verifyOptionState(provider, expectedResult);
					return true;
				} catch {
					return false;
				}
			},
			{
				errorMessage: `Provider ${provider} was not ${expectedResult} in the dropdown in time`,
				intervalSeconds: 2,
				timeoutSeconds: TimeoutSeconds.ONE_EIGHTY,
			},
		);
	}

	@step()
	public async verifyProviderDisplayedInSettingsModalDropdown(
		provider: GameProvider,
		expectedResult: VisibilityResult,
	): Promise<void> {
		await waitUntil(
			async () => {
				await this.gamdomPage.refresh();
				await this.gamdomPage.clickSettingsButton();
				await this.gamdomPage.clickProvidersDropdownInSettingsModal();
				try {
					await this.gamdomPage
						.assertThat()
						.verifyOptionState(provider, expectedResult);
					return true;
				} catch {
					return false;
				}
			},
			{
				errorMessage: `Provider ${provider} was not ${expectedResult} in the settings modal dropdown in time`,
				intervalSeconds: 2,
				timeoutSeconds: TimeoutSeconds.ONE_EIGHTY,
			},
		);
	}
}
