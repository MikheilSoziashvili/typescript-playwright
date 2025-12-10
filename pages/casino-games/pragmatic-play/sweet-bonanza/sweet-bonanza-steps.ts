import { waitForSeconds, waitUntil } from "@core/utils/utils";
import { BaseVisualSteps } from "@pages/base-visual/base-visual-steps";
import { step } from "decorators/step";
import { SweetBonanzaMap } from "./sweet-bonanza-map";
import { SweetBonanzaPage } from "./sweet-bonanza-page";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { logger } from "@logger/logger";

export class SweetBonanzaSteps extends BaseVisualSteps {
	protected sweetBonanzaPage: SweetBonanzaPage;
	protected map: SweetBonanzaMap;

	public constructor(sweetBonanzaPage: SweetBonanzaPage) {
		super(sweetBonanzaPage);
		this.sweetBonanzaPage = sweetBonanzaPage;
		this.map = sweetBonanzaPage.map;
	}

	@step("Spin until win round")
	public async spinUntilWinRound(maxSpins: number): Promise<number> {
		let spinCount = 0;

		await waitUntil(
			async () => {
				spinCount++;

				if (spinCount > 0) {
					const winLabelExists = await this.sweetBonanzaPage
						.assertThat()
						.winLabelExists();

					if (winLabelExists) {
						logger.info(`Win-label found after ${spinCount} spins`);
						return true;
					}
					logger.info(`Win-label not found after ${spinCount} spins`);
				}

				await this.sweetBonanzaPage.assertThat().waitForSpinButton();
				await this.sweetBonanzaPage.clickSpinButton();
				await waitForSeconds(2);

				return false;
			},
			{
				errorMessage: `Win-label not found after ${maxSpins} spins`,
				intervalSeconds: TimeoutSeconds.HALF,
				timeoutSeconds:
					maxSpins * (TimeoutSeconds.TEN + TimeoutSeconds.FIVE),
			},
		);

		return spinCount;
	}
}
