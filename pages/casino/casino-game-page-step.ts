import { BasePageStep } from "@pages/base/base-page-step";
import { CasinoPage } from "./casino-game-page";
import { GameProvider } from "@enums/game-providers";
import { VisibilityResult } from "@core/types/types";
import { step } from "decorators/step";

export class CasinoPageSteps extends BasePageStep<CasinoPage> {
	public constructor(gamdomPage: CasinoPage) {
		super(gamdomPage);
	}

	@step()
	public async verifyProviderDisplayedInDropdown(
		provider: GameProvider,
		expectedResult: VisibilityResult,
	): Promise<void> {
		await this.gamdomPage.clickProvidersDropdown();
		await this.gamdomPage
			.assertThat()
			.verifyOptionState(provider, expectedResult);
	}

	@step()
	public async verifyProviderDisplayedInSettingsModalDropdown(
		provider: GameProvider,
		expectedResult: VisibilityResult,
	): Promise<void> {
		await this.gamdomPage.clickSettingsButton();
		await this.gamdomPage.clickProvidersDropdownInSettingsModal();
		await this.gamdomPage
			.assertThat()
			.verifyOptionState(provider, expectedResult);
	}
}
