import { BaseVisualAsserter } from "@pages/base-visual/base-visual-asserter";
import { SweetBonanzaMap } from "./sweet-bonanza-map";
import { logger } from "@logger/logger";
import { VisualComparisonThreshold } from "@constants/visual-automation";
import { SweetBonanzaPage } from "./sweet-bonanza-page";
import { step } from "decorators/step";
import { Timeout } from "@enums/timeout";
import { waitUntil } from "@core/utils/utils";
import { TimeoutSeconds } from "@enums/timeout-seconds";

export class SweetBonanzaAsserter extends BaseVisualAsserter {
	protected sweetBonanzaPage: SweetBonanzaPage;
	protected map: SweetBonanzaMap;

	public constructor(sweetBonanzaPage: SweetBonanzaPage) {
		super(sweetBonanzaPage);
		this.sweetBonanzaPage = sweetBonanzaPage;
		this.map = sweetBonanzaPage.map;
	}

	@step("Verify next button is visible")
	public async nextButtonVisible(): Promise<void> {
		logger.info("Verifying next button is visible");
		await this.imageFound(this.map.nextButton, {
			threshold: VisualComparisonThreshold.ULTRA_RELAXED,
			timeout: Timeout.LONG,
		});
	}

	@step("Verify spin button is visible")
	public async spinButtonVisible(): Promise<void> {
		logger.info("Verifying spin button is visible");
		await this.imageFound(this.map.spinButton, {
			threshold: VisualComparisonThreshold.SUPER_RELAXED,
			timeout: Timeout.LONG,
		});
	}

	@step("Verify win label is visible")
	public async winLabelVisible(): Promise<void> {
		logger.info("Verifying win label is visible");
		await this.imageFound(this.map.winLabel, {
			threshold: VisualComparisonThreshold.ULTRA_RELAXED,
		});
	}

	@step("Wait for win label")
	public async waitForWinLabel(): Promise<void> {
		logger.info("Waiting for win label");
		await this.sweetBonanzaPage.waitForVisualElement(this.map.winLabel, {
			threshold: VisualComparisonThreshold.ULTRA_RELAXED,
		});
	}

	@step("Wait for spin button")
	public async waitForSpinButton(): Promise<void> {
		logger.info("Waiting for spin button");
		await this.sweetBonanzaPage.waitForVisualElement(this.map.spinButton, {
			threshold: VisualComparisonThreshold.SUPER_RELAXED,
		});
	}

	@step("Check if spin button exists")
	public async spinButtonExists(): Promise<boolean> {
		logger.info("Checking if spin button exists");
		const match = await this.sweetBonanzaPage.findVisualElement(
			this.map.spinButton,
			{
				threshold: VisualComparisonThreshold.SUPER_RELAXED,
			},
		);
		return match?.found ?? false;
	}

	@step("Check if win label exists")
	public async winLabelExists(): Promise<boolean> {
		logger.info("Checking if win label exists");
		const match = await this.sweetBonanzaPage.findVisualElement(
			this.map.winLabel,
			{
				threshold: VisualComparisonThreshold.VERY_RELAXED,
			},
		);
		return match?.found ?? false;
	}

	@step("Wait for round finish")
	public async waitForRoundFinish(): Promise<void> {
		logger.info("Verifying spin button is visible");

		await waitUntil(
			async () => {
				const spinButtonExists = await this.spinButtonExists();

				if (spinButtonExists) {
					logger.info("Round finished. Spin button is visible");
					return true;
				}

				return false;
			},
			{
				errorMessage:
					"Round is not finished. Spin button is not visible",
				intervalSeconds: TimeoutSeconds.ONE,
				timeoutSeconds: TimeoutSeconds.SIXTY,
			},
		);
	}
}
