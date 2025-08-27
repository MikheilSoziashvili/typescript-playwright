import { BasePageStep } from "@pages/base/base-page-step";
import { step } from "decorators/step";
import { parseToFloat } from "@core/utils/utils";
import { BetTestData } from "@dtos/test-data";
import { CrashGamePage } from "./crash-game-page";
import { logger } from "@logger/logger";
import { BetIncreaseCondition } from "@enums/crash-autobet-section";

export class CrashGamePageSteps extends BasePageStep<CrashGamePage> {
	public constructor(gamdomPage: CrashGamePage) {
		super(gamdomPage);
	}

	@step("Place bet")
	public async placeBet(betTestData: BetTestData): Promise<void> {
		const accountBalanceBeforeBet =
			await this.gamdomPage.authenticatedHeader.getAccountBalance();

		await this.gamdomPage.placeBet(
			betTestData.betAmount,
			betTestData.autoCashoutMultiplier,
		);
		await this.gamdomPage.assertThat().playerBetsAccepted([
			{
				username: betTestData.username,
				betAmount: `${betTestData.betAmount}`,
			},
		]);
		await this.gamdomPage
			.assertThat()
			.playerBetBoxesDisplayed([
				{ betAmount: parseToFloat(betTestData.betAmount) },
			]);
		await this.gamdomPage.authenticatedHeader
			.assertThat()
			.accountBalanceIs(accountBalanceBeforeBet - betTestData.betAmount);
	}

	@step("Toggle autobet setup")
	public async toggleAutobetSetup(
		betTestData: BetTestData,
		stopBetAmount: number,
	): Promise<void> {
		await this.gamdomPage.toggleAutobet();
		await this.gamdomPage.stopBetIfMoreThan(stopBetAmount);
	}

	@step("Enable autobet and fill amount")
	public async enableAutobetAndFillAmount(betAmount: number): Promise<void> {
		await this.gamdomPage.toggleAutobet();
		await this.gamdomPage.fillInBetAmount(betAmount);
		await this.gamdomPage.assertThat().startAutobetButtonIsEnabled();
	}

	@step("Start autobet")
	public async startAutobet(betAmount: number): Promise<void> {
		await this.enableAutobetAndFillAmount(betAmount);
		await this.gamdomPage.map.placeBetBtn.click();
		await this.gamdomPage.assertThat().checkElementsContainText([
			{
				locator: this.gamdomPage.map.placeBetBtn,
				expectedText: "Stop Autobet",
			},
		]);
		await this.gamdomPage
			.assertThat()
			.checkElementsAreDisabled([
				this.gamdomPage.map.stopBetIfMoreThanField,
			]);
	}

	@step("Stop autobet")
	public async stopAutobet(): Promise<void> {
		await this.gamdomPage.map.placeBetBtn.click();
		await this.gamdomPage.assertThat().checkElementsContainText([
			{
				locator: this.gamdomPage.map.placeBetBtn,
				expectedText: "Start Autobet",
			},
		]);
		await this.gamdomPage
			.assertThat()
			.checkElementsAreEnabled([
				this.gamdomPage.map.stopBetIfMoreThanField,
			]);
	}

	@step("Execute actions")
	private async executeActions(
		actions: (() => Promise<void>)[],
	): Promise<void> {
		for (const action of actions) {
			await action();
		}
	}

	@step("Start autobet session")
	private async startAutobetSession(
		betAmount: number,
		autoCashoutMultiplier: number,
	): Promise<void> {
		await this.gamdomPage.placeBet(betAmount, autoCashoutMultiplier);
	}

	private shouldContinueAutobet(
		currentBetAmount: number,
		stopIfBetMoreThanAmount: number,
	): boolean {
		if (currentBetAmount > stopIfBetMoreThanAmount) {
			logger.info(
				`Bet amount has reached the stop limit of ${stopIfBetMoreThanAmount}. Exiting autobet...`,
			);
			return false;
		}
		return true;
	}

	@step("Process round result")
	private async processRoundResult(
		autoCashoutMultiplier: number,
	): Promise<{ betWon: boolean; crashedMultiplier: number }> {
		await this.gamdomPage.waitCrash();

		const crashedMultiplierString =
			await this.gamdomPage.getCrashedMultiplier();
		const crashedMultiplier = parseFloat(crashedMultiplierString);

		const betWon = crashedMultiplier >= autoCashoutMultiplier;

		if (betWon) {
			logger.info(`Bet won! Multiplier reached: ${crashedMultiplier}.`);
		} else {
			logger.warn(
				`Bet lost. Multiplier crashed at: ${crashedMultiplier}.`,
			);
		}

		return { betWon, crashedMultiplier };
	}

	@step("Update bet amount")
	private async updateBetAmount(
		previousBetAmount: number,
		betWon: boolean,
		increaseCondition: BetIncreaseCondition,
		increaseByMultiplier: number,
		baseBetAmount: number,
	): Promise<number> {
		await this.gamdomPage.waitBettingWindowAvailable();

		const currentBetAmount = await this.gamdomPage
			.assertThat()
			.verifyBetAmountUpdatedCorrectly(
				previousBetAmount,
				betWon,
				increaseCondition,
				increaseByMultiplier,
				baseBetAmount,
			);

		return currentBetAmount;
	}

	@step("Autobet until bet more than threshold")
	public async autobetUntilBetMoreThan(
		betTestData: BetTestData,
		stopIfBetMoreThanAmount: number,
		increaseByMultiplier: number,
		increaseCondition: BetIncreaseCondition,
		...actions: (() => Promise<void>)[]
	): Promise<void> {
		const autoCashoutMultiplier = betTestData.autoCashoutMultiplier;

		await this.executeActions(actions);

		await this.startAutobetSession(
			betTestData.betAmount,
			autoCashoutMultiplier,
		);

		let currentBetAmount = betTestData.betAmount;
		let previousBetAmount = currentBetAmount;

		while (true) {
			currentBetAmount = await this.gamdomPage.getCurrentBetAmount();

			if (
				!this.shouldContinueAutobet(
					currentBetAmount,
					stopIfBetMoreThanAmount,
				)
			) {
				break;
			}

			const { betWon } = await this.processRoundResult(
				autoCashoutMultiplier,
			);

			currentBetAmount = await this.updateBetAmount(
				previousBetAmount,
				betWon,
				increaseCondition,
				increaseByMultiplier,
				betTestData.betAmount,
			);

			previousBetAmount = currentBetAmount;
		}
	}
}
