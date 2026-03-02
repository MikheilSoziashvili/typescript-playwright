import { expect } from "@playwright/test";
import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { RouletteGamePage } from "./roulette-game-page";
import { GreenHuntTypeOption } from "@enums/roulette-autobet-section";
import { RouletteBetTestData } from "@dtos/test-data";
import { RouletteBetColor, RouletteNumberColor } from "@enums/original-games";
import { calculateGreenHuntAmountByPercentage } from "@formulas/roulette";
import { Timeout } from "@enums/timeout";
import { logger } from "@logger/logger";
import { VisibilityState } from "@enums/playwright/visibility-states";

export class RouletteGamePageSteps extends BasePageStep<RouletteGamePage> {
	public constructor(gamdomPage: RouletteGamePage) {
		super(gamdomPage);
	}

	@step("Place bet and wait for round result")
	public async placeBetAndWaitForResult(
		testData: RouletteBetTestData,
	): Promise<string> {
		await this.prepareBet(testData);
		return this.assertBetRegistrationAndWaitForResult(testData);
	}

	@step("Prepare bet and assert pre-bet state")
	private async prepareBet(testData: RouletteBetTestData): Promise<void> {
		await this.gamdomPage.waitBettingWindowAvailable();
		await this.gamdomPage.insertBet(testData.betAmount);
		await this.gamdomPage.assertThat().betButtonsEnabled();
		await this.gamdomPage
			.assertThat()
			.potentialBenefitValueIs(testData.betAmount, testData.betColor);
		await this.gamdomPage.betOnColor(testData.betColor);
	}

	@step("Assert bet registration and wait for result")
	private async assertBetRegistrationAndWaitForResult(
		testData: RouletteBetTestData,
	): Promise<string> {
		await this.gamdomPage
			.assertThat()
			.potentialBenefitValueIs(
				testData.betAmount,
				testData.betColor,
				false,
			);
		await this.gamdomPage.assertThat().playersBetsDisplayed([
			{
				betColor: testData.betColor,
				username: testData.username,
				betAmount: testData.betAmount,
			},
		]);
		await this.gamdomPage
			.assertThat()
			.totalBetsMatchesNumberOfBetRows(testData.betColor);
		const resultNumber = await this.gamdomPage.getRoundResultNumber();
		await this.gamdomPage.map.gameResultStateLocator.waitFor({
			state: VisibilityState.HIDDEN,
			timeout: Timeout.LONG,
		});
		return resultNumber;
	}

	@step("Play until result color is achieved")
	public async playUntilResultColorIs(
		targetColor: RouletteNumberColor,
		testData: RouletteBetTestData,
	): Promise<{ accountBalance: number; rouletteResultNumber: string }> {
		await this.gamdomPage.navigate();
		let isWin = false;
		let accountBalance: number;
		let rouletteResultNumber: string;
		do {
			accountBalance =
				await this.userBalanceHandler.walletBalanceInFiatRounded();
			rouletteResultNumber =
				await this.placeBetAndWaitForResult(testData);
			const resultColor = this.gamdomPage.getColorFromResultNumber(
				Number(rouletteResultNumber),
			);
			logger.info(`Roulette result: ${RouletteNumberColor[resultColor]}`);
			isWin = resultColor === targetColor;
			if (!isWin) {
				logger.info("Roulette lost! Trying again...");
			}
		} while (!isWin);
		return { accountBalance, rouletteResultNumber };
	}

	@step("Assert account balance is correct after a win")
	public async assertBalanceAfterWin(
		balanceBeforeWin: number,
		testData: RouletteBetTestData,
	): Promise<void> {
		const expectedBalance =
			balanceBeforeWin -
			testData.betAmount +
			this.gamdomPage.calculateProfit(
				testData.betAmount,
				testData.betColor,
			);
		await expect
			.poll(
				async () =>
					this.userBalanceHandler.walletBalanceInFiatRounded(),
				{
					message: `Account balance should settle at ${expectedBalance} after payout`,
					timeout: Timeout.LONG,
				},
			)
			.toBe(expectedBalance);
	}

	@step("Navigate to Roulette and start green hunt")
	public async navigateAndStartGreenHunt(
		bet: number,
		type: GreenHuntTypeOption,
	): Promise<void> {
		await this.gamdomPage.navigate();
		await this.gamdomPage.waitBettingWindowAvailable();
		await this.startGreenHunt(bet, type);
	}

	@step("Place manual bet and verify green hunt state")
	public async placeBetAndVerifyGreenHunt(
		testData: RouletteBetTestData,
		percentage: number,
	): Promise<string> {
		const greenHuntAmount = calculateGreenHuntAmountByPercentage(
			testData.betAmount,
			percentage,
		);
		const accountBalance =
			await this.userBalanceHandler.walletBalanceInFiatRounded();
		await this.prepareBet(testData);
		await this.gamdomPage.assertThat().playersBetsDisplayed([
			{
				betColor: testData.betColor,
				username: testData.username,
				betAmount: testData.betAmount,
			},
		]);
		await this.gamdomPage.assertThat().totalBetsAre(RouletteBetColor.GREEN);
		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.accountBalanceIs(
				accountBalance - testData.betAmount - greenHuntAmount,
			);
		return this.gamdomPage.getRoundResultNumber();
	}

	@step("Start green hunt")
	public async startGreenHunt(
		bet: number,
		type: GreenHuntTypeOption,
	): Promise<void> {
		await this.gamdomPage.expandAutobetSection();
		await this.gamdomPage.map
			.greenHuntAutomaticallyBetTextInput()
			.fill(bet.toString());
		await this.gamdomPage.selectGreenHuntType(type);
		await this.gamdomPage.map.startGreenHuntButton().click();

		await this.gamdomPage.assertThat().greenHuntIsActive();
	}

	@step("Start autobet")
	public async startAutobet(stopAutobetValue: number): Promise<void> {
		await this.gamdomPage.expandAutobetSection();
		await this.gamdomPage.map.stopIfBalanceIsOver.fill(
			stopAutobetValue.toString(),
		);
		await this.gamdomPage.map.startAutobetButton.click();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([this.gamdomPage.map.stopAutobetButton]);
	}

	@step("Stop autobet")
	public async stopAutobet(): Promise<void> {
		await this.gamdomPage.map.stopAutobetButton.click();
		await this.gamdomPage
			.assertThat()
			.checkElementsAreVisible([this.gamdomPage.map.startAutobetButton]);
	}
}
