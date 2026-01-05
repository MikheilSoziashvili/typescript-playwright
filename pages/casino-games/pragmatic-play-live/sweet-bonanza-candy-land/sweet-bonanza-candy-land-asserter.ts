import { BaseVisualAsserter } from "@pages/base-visual/base-visual-asserter";
import { SweetBonanzaCandyLandMap } from "./sweet-bonanza-candy-land-map";
import { logger } from "@logger/logger";
import { VisualComparisonThreshold } from "@constants/visual-automation";
import { SweetBonanzaCandyLandPage } from "./sweet-bonanza-candy-land-page";
import { step } from "decorators/step";
import { Timeout } from "@enums/timeout";
import { waitUntil } from "@core/utils/utils";
import { TimeoutSeconds } from "@enums/timeout-seconds";

export class SweetBonanzaCandyLandAsserter extends BaseVisualAsserter {
	protected sweetBonanzaCandyLandPage: SweetBonanzaCandyLandPage;
	protected map: SweetBonanzaCandyLandMap;

	public constructor(sweetBonanzaCandyLandPage: SweetBonanzaCandyLandPage) {
		super(sweetBonanzaCandyLandPage);
		this.sweetBonanzaCandyLandPage = sweetBonanzaCandyLandPage;
		this.map = sweetBonanzaCandyLandPage.map;
	}

	@step("Verify bets block is visible")
	public async betsBlockVisible(): Promise<void> {
		logger.info("Verifying bets block is visible");
		await this.imageFound(this.map.betsBlock, {
			threshold: VisualComparisonThreshold.RELAXED,
			timeout: Timeout.MAX,
		});
	}

	@step("Verify waiting for next game block is visible")
	public async waitingForNextGameBlockVisible(): Promise<void> {
		logger.info("Verifying waiting for next game block is visible");
		await this.imageFound(this.map.waitingForNextGameBlock, {
			threshold: VisualComparisonThreshold.RELAXED,
			timeout: Timeout.LONG,
		});
	}

	@step("Verify win label is visible")
	public async winLabelVisible(): Promise<void> {
		logger.info("Verifying win label is visible");
		await this.imageFound(this.map.winLabel, {
			threshold: VisualComparisonThreshold.RELAXED,
		});
	}

	@step("Check if bets block exists")
	public async betsBlockExists(): Promise<boolean> {
		logger.info("Checking if bets block exists");
		const match = await this.sweetBonanzaCandyLandPage.findVisualElement(
			this.map.betsBlock,
			{
				threshold: VisualComparisonThreshold.RELAXED,
			},
		);
		return match?.found ?? false;
	}

	@step("Check if waiting for next game block exists")
	public async waitingForNextGameBlockExists(): Promise<boolean> {
		logger.info("Checking if waiting for next game block exists");
		const match = await this.sweetBonanzaCandyLandPage.findVisualElement(
			this.map.waitingForNextGameBlock,
			{
				threshold: VisualComparisonThreshold.RELAXED,
			},
		);
		return match?.found ?? false;
	}

	@step("Check if win label exists")
	public async winLabelExists(): Promise<boolean> {
		logger.info("Checking if win label exists");
		const match = await this.sweetBonanzaCandyLandPage.findVisualElement(
			this.map.winLabel,
			{
				threshold: VisualComparisonThreshold.VERY_RELAXED,
			},
		);
		return match?.found ?? false;
	}

	@step("Wait for bets block")
	public async waitForBetsBlock(): Promise<void> {
		logger.info("Waiting for bets block to appear");
		await waitUntil(
			async () => {
				const betsBlockExists = await this.betsBlockExists();
				if (betsBlockExists) {
					logger.info("Bets block is visible");
					return true;
				}
				return false;
			},
			{
				errorMessage: "Bets block is not visible",
				intervalSeconds: TimeoutSeconds.ONE,
				timeoutSeconds: TimeoutSeconds.ONE_TWENTY,
			},
		);
	}

	@step("Wait for round finish")
	public async waitForRoundFinish(): Promise<void> {
		logger.info("Waiting for round to finish");
		await waitUntil(
			async () => {
				const betsBlockExists = await this.betsBlockExists();
				if (betsBlockExists) {
					logger.info("Round finished. Bets block is visible");
					return true;
				}
				return false;
			},
			{
				errorMessage: "Round is not finished. Bets block is not visible",
				intervalSeconds: TimeoutSeconds.ONE,
				timeoutSeconds: TimeoutSeconds.ONE_TWENTY,
			},
		);
	}
}

