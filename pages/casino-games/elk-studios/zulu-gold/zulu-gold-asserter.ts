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
		const spinBonusButtonMatch = await this.zuluGoldPage.findVisualElement(
			this.map.spinBonusButton,
			{
				threshold: VisualComparisonThreshold.ULTRA_RELAXED,
			},
		);
		return spinBonusButtonMatch?.found ?? false;
	}

	@step("Check if spin bonus second button exists")
	public async spinBonusSecondButtonExists(): Promise<boolean> {
		logger.info("Checking if spin bonus second button exists");
		const spinBonusSecondButtonMatch =
			await this.zuluGoldPage.findVisualElement(
				this.map.spinBonusSecondButton,
				{
					threshold: VisualComparisonThreshold.ULTRA_RELAXED,
				},
			);
		return spinBonusSecondButtonMatch?.found ?? false;
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
	public async waitForRoundFinish(): Promise<boolean> {
		logger.info(
			"Verifying either spin button or spin bonus button is visible",
		);
		let roundFinished = false;

		if (await this.spinButtonExists()) {
			logger.info("Spin button exists");
			roundFinished = true;
		}

		if (await this.spinBonusButtonExists()) {
			logger.info("Spin bonus button exists");
			roundFinished = true;
		}

		if (await this.spinBonusSecondButtonExists()) {
			logger.info("Spin bonus second button exists");
			roundFinished = true;
		}

		expect(
			roundFinished,
			"Round is not finished. Neither spin button nor spin bonus button is visible",
		).toBe(true);

		return false;
	}
}
