import { BaseVisualAsserter } from "@pages/base-visual/base-visual-asserter";
import { ZuluGoldMap } from "./zulu-gold-map";
import { logger } from "@logger/logger";
import { VisualComparisonThreshold } from "@constants/visual-automation";
import { ZuluGoldPage } from "./zulu-gold-page";
import { step } from "decorators/step";
import { Timeout } from "@enums/timeout";
import { expect } from "@playwright/test";

export class ZuluGoldAsserter extends BaseVisualAsserter {
	protected zuluGoldPage: ZuluGoldPage;
	protected map: ZuluGoldMap;

	public constructor(zuluGoldPage: ZuluGoldPage) {
		super(zuluGoldPage);
		this.zuluGoldPage = zuluGoldPage;
		this.map = zuluGoldPage.map;
	}

	@step("Verify next button is visible")
	public async nextButtonVisible(): Promise<void> {
		logger.info("Verifying next button is visible");
		await this.imageFound(this.map.nextButton, {
			threshold: VisualComparisonThreshold.RELAXED,
			timeout: Timeout.LONG,
		});
	}

	@step("Verify spin button is visible")
	public async spinButtonVisible(): Promise<void> {
		logger.info("Verifying spin button is visible");
		await this.imageFound(this.map.spinButton, {
			threshold: VisualComparisonThreshold.RELAXED,
		});
	}

	@step("Verify win label is visible")
	public async winLabelVisible(): Promise<void> {
		logger.info("Verifying win label is visible");
		await this.imageFound(this.map.winLabel, {
			threshold: VisualComparisonThreshold.VERY_RELAXED,
		});
	}

	@step("Wait for win label")
	public async waitForWinLabel(): Promise<void> {
		logger.info("Waiting for win label");
		await this.zuluGoldPage.waitForVisualElement(this.map.winLabel, {
			threshold: VisualComparisonThreshold.RELAXED,
		});
	}

	@step("Check if spin button exists")
	public async spinButtonExists(): Promise<boolean> {
		logger.info("Checking if spin button exists");
		const match = await this.zuluGoldPage.findVisualElement(
			this.map.spinButton,
			{
				threshold: VisualComparisonThreshold.RELAXED,
			},
		);
		return match?.found ?? false;
	}

	@step("Check if spin bonus button exists")
	public async spinBonusButtonExists(): Promise<boolean> {
		logger.info("Checking if spin bonus button exists");
		const spinButtonMatch = await this.zuluGoldPage.findVisualElement(
			this.map.spinBonusSecondButton,
			{
				threshold: VisualComparisonThreshold.VERY_RELAXED,
			},
		);
		if (spinButtonMatch?.found) {
			return true;
		}

		const spinBonusButtonMatch = await this.zuluGoldPage.findVisualElement(
			this.map.spinBonusButton,
			{
				threshold: VisualComparisonThreshold.VERY_RELAXED,
			},
		);
		return spinBonusButtonMatch?.found ?? false;
	}

	@step("Check if win label exists")
	public async winLabelExists(): Promise<boolean> {
		logger.info("Checking if win label exists");
		const match = await this.zuluGoldPage.findVisualElement(
			this.map.winLabel,
			{
				threshold: VisualComparisonThreshold.VERY_RELAXED,
			},
		);
		return match?.found ?? false;
	}

	@step("Wait for round finish")
	public async waitForRoundFinish(): Promise<void> {
		logger.info(
			"Verifying either spin button or spin bonus button is visible",
		);
		const spinButtonExists = await this.spinButtonExists();
		const spinBonusButtonExists = await this.spinBonusButtonExists();

		expect(
			spinButtonExists || spinBonusButtonExists,
			"Round is not finished. Neither spin button nor spin bonus button is visible",
		).toBe(true);

		if (spinButtonExists) {
			logger.info("Round finished. Spin button is visible");
		} else {
			logger.info("Round finished. Spin bonus button is visible");
		}
	}
}
