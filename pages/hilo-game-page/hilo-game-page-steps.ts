import { BasePageStep } from "@pages/base/base-page-step";
import { HiloBetTestData, HiloCardsColorData } from "@dtos/test-data";
import {
	HiloGameResultColor,
	HiloGameStatusMessage,
} from "@enums/hilo-result-messages";
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

	public async playUntilResultColorIs(
		resultColor: HiloGameResultColor,
		testData: HiloBetTestData,
	): Promise<number> {
		let isWin = false;
		let accountBalance =
			await this.gamdomPage.authenticatedHeader.getAccountBalance();

		while (!isWin) {
			await this.gamdomPage.fillInBetAmount(testData.betAmount);
			await this.gamdomPage.clickBetOption(testData.betOption);
			await this.gamdomPage
				.assertThat()
				.gameMessageIs(HiloGameStatusMessage.DRAWING);
			accountBalance =
				await this.gamdomPage.authenticatedHeader.getAccountBalance();

			const roundresult = await this.gamdomPage.getRoundResult();
			isWin = roundresult.includes(resultColor);

			if (!isWin) {
				logger.info("Hilo game lost! Trying again...");
			}
		}

		return accountBalance;
	}

	public async openHistoryModalSuccessfully(): Promise<void> {
		await this.gamdomPage.map.hiloHistoryButton.click();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([this.gamdomPage.map.hiloHistoryModal]);
	}

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

	public async closeHistoryModalSuccessfully(): Promise<void> {
		await this.gamdomPage.map.closeHistoryModalButton.click();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreNotVisible([
				this.gamdomPage.map.hiloHistoryModal,
				this.gamdomPage.map.historyCardsBlock,
			]);
	}

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
