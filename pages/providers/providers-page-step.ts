import { BasePageStep } from "@pages/base/base-page-step";
import { ProvidersPage } from "./providers-page";
import { VisibilityResult } from "@core/types/types";
import { GameProvider } from "@enums/game-providers";
import { step } from "decorators/step";

export class ProvidersPageSteps extends BasePageStep<ProvidersPage> {
	public constructor(gamdomPage: ProvidersPage) {
		super(gamdomPage);
	}

	@step(
		`Navigating to providers page and checking provider visibility based on configuration`,
	)
	public async verifyProviderOptionState(
		providersPage: ProvidersPage,
		expectedResult: VisibilityResult,
		providerName: GameProvider,
	): Promise<void> {
		await providersPage.navigate();
		await providersPage
			.assertThat()
			.verifyOptionState(providerName, expectedResult);
	}
}
