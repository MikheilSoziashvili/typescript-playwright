import { waitForSeconds, waitUntil } from "@core/utils/utils";
import { BaseVisualSteps } from "@pages/base-visual/base-visual-steps";
import { step } from "decorators/step";
import { ZuluGoldMap } from "./zulu-gold-map";
import { ZuluGoldPage } from "./zulu-gold-page";
import { TimeoutSeconds } from "@enums/timeout-seconds";
import { logger } from "@logger/logger";

export class ZuluGoldSteps extends BaseVisualSteps {
	protected zuluGoldPage: ZuluGoldPage;
	protected map: ZuluGoldMap;

	public constructor(zuluGoldPage: ZuluGoldPage) {
		super(zuluGoldPage);
		this.zuluGoldPage = zuluGoldPage;
		this.map = zuluGoldPage.map;
	}

	@step("Spin until win round")
	public async spinUntilWinRound(maxSpins: number): Promise<number> {
		let spinCount = 0;

		await waitUntil(
			async () => {
				spinCount++;

				const winLabelExists = await this.zuluGoldPage
					.assertThat()
					.winLabelExists();

				if (winLabelExists) {
					logger.info(`Win-label found after ${spinCount} spins`);
					return true;
				}
				logger.info(`Win-label not found after ${spinCount} spins`);

				const spinButtonExists = await this.zuluGoldPage
					.assertThat()
					.spinButtonExists();

				if (spinButtonExists) {
					logger.info(`Spin-button found after ${spinCount} spins`);
					await this.zuluGoldPage.clickSpinButton();
				} else {
					const spinBonusButtonExists = await this.zuluGoldPage
						.assertThat()
						.spinBonusButtonExists();

					if (spinBonusButtonExists) {
						logger.info(
							`Spin-bonus-button found after ${spinCount} spins`,
						);
						await this.zuluGoldPage.clickSpinBonusButton();
					} else {
						logger.info(
							`Spin-bonus-button not found after ${spinCount} spins`,
						);
						const spinBonusSecondButtonExists =
							await this.zuluGoldPage
								.assertThat()
								.spinBonusSecondButtonExists();

						if (spinBonusSecondButtonExists) {
							logger.info(
								`Spin-bonus-second-button found after ${spinCount} spins`,
							);
							await this.zuluGoldPage.clickSpinBonusSecondButton();
						} else {
							return false;
						}
					}
				}
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
