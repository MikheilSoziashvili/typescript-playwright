import { expect } from "@playwright/test";
import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { Timeout } from "@enums/timeout";
import { IntervalMs } from "@enums/interval-millisecond";
import { HiloBetTestData, HiloCardsColorData } from "@dtos/test-data";
import {
	HiloGameResultColor,
	HiloGameStatusMessage,
} from "@enums/hilo-result-messages";
import { HiloBetOption } from "@enums/hilo-bet-options";
import { logger } from "@logger/logger";
import { HiloGamePage } from "./hilo-game-page";
import { getItemsAttribute } from "@core/utils/utils";
import { Attributes } from "@enums/playwright/htmlAttributes";
import { digitsOnlyPattern } from "@support/regex-patterns";
import { calculateCardsPercentage } from "@formulas/hilo";

export class HiloGamePageSteps extends BasePageStep<HiloGamePage> {
	public constructor(gamdomPage: HiloGamePage) {
		super(gamdomPage);
	}

	private countCardsByColor(
		cardsColors: string[],
		lastRounds: number,
	): { red: number; black: number; joker: number } {
		return cardsColors.slice(0, lastRounds).reduce(
			(counts, color) => {
				switch (color) {
					case HiloGameResultColor.RED:
						counts.red++;
						break;
					case HiloGameResultColor.BLACK:
						counts.black++;
						break;
					case HiloGameResultColor.JOKER:
						counts.joker++;
						break;
				}
				return counts;
			},
			{ red: 0, black: 0, joker: 0 },
		);
	}

	@step("Navigate to Hilo and wait for betting window")
	public async navigateAndWaitForBettingWindow(): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage
			.assertThat()
			.gameMessageIs(HiloGameStatusMessage.SPINNING_IN);
	}

	@step("Place bet and wait for round result")
	public async placeBetAndWaitForResult(
		betAmount: number,
		betOption: HiloBetOption,
	): Promise<string> {
		await this.gamdomPage.placeBet(betAmount, betOption);
		return this.gamdomPage.getRoundResult();
	}

	@step("Play until result color is achieved")
	public async playUntilResultColorIs(
		resultColor: HiloGameResultColor,
		testData: HiloBetTestData,
	): Promise<number> {
		await this.navigateAndWaitForBettingWindow();

		let isWin = false;
		let accountBalance: number;

		do {
			accountBalance =
				await this.userBalanceHandler.walletBalanceInFiatRounded();

			const roundResult = await this.placeBetAndWaitForResult(
				testData.betAmount,
				testData.betOption,
			);
			logger.info(`Current round result: ${roundResult}`);

			isWin = roundResult.includes(resultColor);
			if (!isWin) {
				logger.info("Hilo game lost! Trying again...");
			}
		} while (!isWin);

		return accountBalance;
	}

	@step("Open history modal successfully")
	public async openHistoryModalSuccessfully(): Promise<void> {
		await this.gamdomPage.map.hiloHistoryButton.click();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([this.gamdomPage.map.hiloHistoryModal]);
	}

	@step("Get last hilo rounds cards color count")
	public async getLastHiloRoundsCardsColorCount(
		lastRounds: number,
	): Promise<HiloCardsColorData> {
		let cardsColors = await getItemsAttribute(
			this.gamdomPage.map.historyCardsBlock,
			Attributes.COLOR,
		);

		while (cardsColors.length < lastRounds) {
			await this.gamdomPage.map.showMoreHistoryCardsButton.click();
			cardsColors = await getItemsAttribute(
				this.gamdomPage.map.historyCardsBlock,
				Attributes.COLOR,
			);
		}

		const { red, black, joker } = this.countCardsByColor(
			cardsColors,
			lastRounds,
		);

		return new HiloCardsColorData(red, black, joker);
	}

	@step("Close history modal successfully")
	public async closeHistoryModalSuccessfully(): Promise<void> {
		await this.gamdomPage.map.closeHistoryModalButton.click();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreNotVisible([
				this.gamdomPage.map.hiloHistoryModal,
				this.gamdomPage.map.historyCardsBlock,
			]);
	}

	@step("Get stats area cards probability percentage value")
	public async getStatsAreaCardsProbabilityPercentageValue(): Promise<HiloCardsColorData> {
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([
				this.gamdomPage.map.cardsProbabilityContainer,
				this.gamdomPage.map.lastRoundsRedCardsHistoryPercentageValue,
				this.gamdomPage.map.lastRoundsBlackCardsHistoryPercentageValue,
			]);

		const redCardsText =
			await this.gamdomPage.map.lastRoundsRedCardsHistoryPercentageValue.innerText();
		const blackCardsText =
			await this.gamdomPage.map.lastRoundsBlackCardsHistoryPercentageValue.innerText();

		const redCardsMatch = redCardsText.match(digitsOnlyPattern);
		const blackCardsMatch = blackCardsText.match(digitsOnlyPattern);

		const redCards = redCardsMatch ? parseFloat(redCardsMatch[0]) : 0;
		const blackCards = blackCardsMatch ? parseFloat(blackCardsMatch[0]) : 0;

		return new HiloCardsColorData(redCards, blackCards, 0);
	}

	@step("Get history modal cards percentage value")
	public async getHistoryModalCardsPercentageValue(
		lastRounds: number,
	): Promise<HiloCardsColorData> {
		const hiloCardsColorDataHistoryModal =
			await this.getLastHiloRoundsCardsColorCount(lastRounds);

		const redPercentageHistoryModal = calculateCardsPercentage(
			hiloCardsColorDataHistoryModal.redCards,
			lastRounds,
		);
		const blackPercentageHistoryModal = calculateCardsPercentage(
			hiloCardsColorDataHistoryModal.blackCards,
			lastRounds,
		);
		const jokerPercentageHistoryModal = calculateCardsPercentage(
			hiloCardsColorDataHistoryModal.jokerCards,
			lastRounds,
		);

		return new HiloCardsColorData(
			redPercentageHistoryModal,
			blackPercentageHistoryModal,
			jokerPercentageHistoryModal,
		);
	}

	@step("Assert account balance is correct after a win")
	public async assertBalanceAfterWin(
		balanceBeforeWin: number,
		testData: HiloBetTestData,
	): Promise<void> {
		const expectedBalance =
			balanceBeforeWin -
			testData.betAmount +
			this.gamdomPage.calculateProfit(
				testData.betAmount,
				testData.betMultiplierByBetOption,
			);

		await expect
			.poll(
				async () =>
					this.userBalanceHandler.walletBalanceInFiatRounded(),
				{
					message: `Account balance should be ${expectedBalance}`,
					intervals: [IntervalMs.NORMAL],
					timeout: Timeout.LONG,
				},
			)
			.toBe(expectedBalance);
	}

	@step("Select last rounds dropdown values")
	public async selectLastRoundsDropdownValues(
		lastRounds: number,
	): Promise<void> {
		await this.gamdomPage.map.lastRoundsDropdown.click();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([
				this.gamdomPage.map.lastRoundsDropdownValuesContainer,
			]);
		await this.gamdomPage.map
			.lastRoundsDropdownItemByPlaceholder(lastRounds.toString())
			.click();
	}
}
