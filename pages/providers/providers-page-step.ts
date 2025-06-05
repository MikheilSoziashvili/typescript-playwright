import { BasePageStep } from "@pages/base/base-page-step";
import { ProvidersPage } from "./providers-page";
import { VisibilityResult } from "@core/types/types";
import { GameProvider } from "@enums/game-providers";
import { step } from "decorators/step";
import { waitUntil } from "@core/utils/utils";
import { TimeoutSeconds } from "@enums/timeout-seconds";

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

		await waitUntil(
			async () => {
				await providersPage.refresh();
				try {
					await providersPage
						.assertThat()
						.verifyOptionState(providerName, expectedResult);
					return true;
				} catch {
					return false;
				}
			},
			{
				errorMessage: `Provider ${providerName} was not ${expectedResult} on the providers page in time`,
				intervalSeconds: 2,
				timeoutSeconds: TimeoutSeconds.ONE_EIGHTY,
			},
		);
	}
}
